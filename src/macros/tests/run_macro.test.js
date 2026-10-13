import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const folder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../ts");
const ts = require("typescript");
const compiled = (file) =>
  ts.transpileModule(readFileSync(path.join(folder, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;

test("Run Macro passes input, executes nested flow, and returns output", async () => {
  const flowExports = {};
  vm.runInNewContext(compiled("flow.ts"), { exports: flowExports });
  const intents = new Map();
  class Intent {
    static all = intents;
    static canPerform(id) {
      return intents.has(id);
    }
    constructor(id, options) {
      this.options = options;
      intents.set(id, this);
    }
    addEnum() {
      return this;
    }
    perform(params, macro, result) {
      return this.options.perform(params, macro, result);
    }
  }
  const messages = [];
  const blockbench = {
    isWeb: false,
    showQuickMessage() {},
    showStatusMessage() {},
    setProgress() {},
    showMessageBox(options) {
      messages.push(options.message);
    },
  };
  const macroExports = {};
  vm.runInNewContext(compiled("macro.ts"), {
    exports: macroExports,
    require(specifier) {
      if (specifier === "./intent") return { Intent };
      if (specifier.startsWith("./data/macros/")) return { name: "Preset", intents: [] };
      if (specifier === "vue") return { defineComponent: (options) => options, reactive: (value) => value };
      if (specifier === "./variables")
        return { VARIABLE_VALUES: { result: "$result", askEachTime: "$ask_each_time" }, parseInputVariable() {} };
      if (specifier === "./flow") return flowExports;
      throw new Error(`Unexpected import: ${specifier}`);
    },
    Blockbench: blockbench,
    console,
    setTimeout,
    clearTimeout,
  });
  const Macros = macroExports.Macros;
  const scriptingContext = vm.createContext({
    exports: {},
    Blockbench: blockbench,
    URL,
    TextEncoder,
    crypto,
    setTimeout,
    clearTimeout,
    require(specifier) {
      if (specifier === "../intent")
        return {
          Intent,
          IntentParameterTypes: {
            Text: "text",
            Number: "number",
            Boolean: "boolean",
            Date: "date",
            Enum: "enum",
            URL: "url",
          },
        };
      if (specifier === "../macro") return { Macros };
      throw new Error(`Unexpected import: ${specifier}`);
    },
  });
  scriptingContext.globalThis = scriptingContext;
  vm.runInContext(compiled("intents/scripting.ts"), scriptingContext);
  const captured = [];
  new Intent("seed", { perform: () => 3 });
  new Intent("increment", { perform: (_params, _macro, result) => Number(result) + 1 });
  new Intent("capture", {
    perform: (params) => {
      captured.push(params.value);
      return params.value;
    },
  });
  const step = (type, params = {}) => ({ type, uuid: `${type}-${Math.random()}`, params });
  const child = {
    name: "Child",
    icon: "play",
    intents: [
      step("repeat", { count: 2 }),
      step("increment"),
      step("end_repeat"),
      step("stop_and_output", { result: "$result" }),
    ],
  };
  const parent = {
    name: "Parent",
    icon: "play",
    intents: [
      step("seed"),
      step("run_macro", { macro: "Child" }),
      step("capture", { value: "$result" }),
      step("increment"),
    ],
  };
  Macros.all = [parent, child];
  await Macros.run(0);
  expect(captured).toEqual([5]);
  expect(Macros.lastOutput).toBeUndefined();
  expect(Macros.isRunning).toBe(false);
  expect(await Macros.executeMacro(parent, undefined)).toBe(6);
  expect(messages).toContain("5");
  expect(await intents.get("run_macro").perform({ macro: "Child", input: 7 }, parent, 3)).toBe(9);
  expect(await intents.get("run_action").perform({ action: "Child" }, parent, 3)).toBe(5);

  const recursive = { name: "Recursive", icon: "play", intents: [step("run_macro", { macro: "Recursive" })] };
  Macros.all.push(recursive);
  await expect(Macros.executeMacro(recursive, 1)).rejects.toThrow(/recursion/);
  expect(await Macros.executeMacro(child, 2)).toBe(4);
  Macros.all.push({ ...child });
  await expect(intents.get("run_macro").perform({ macro: "Child" }, parent, 1)).rejects.toThrow(/Multiple macros/);

  let finishSlowAction;
  new Intent("slow", {
    perform: () =>
      new Promise((resolve) => {
        finishSlowAction = resolve;
      }),
  });
  const following = [];
  new Intent("following", {
    perform: () => {
      following.push(true);
    },
  });
  Macros.all = [{ name: "Slow", icon: "play", intents: [step("slow"), step("following")] }];
  Macros.watchdogSeconds = 0.01;
  await Macros.run(0);
  expect(Macros.isRunning).toBe(false);
  expect(messages.at(-1)).toMatch(/watchdog limit/);
  finishSlowAction();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(following).toEqual([]);
});
