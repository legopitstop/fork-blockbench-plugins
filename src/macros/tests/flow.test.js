import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Flow intents", async () => {
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../ts/flow.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const flowExports = {};
vm.runInNewContext(js, { exports: flowExports, require() { throw new Error("Unexpected runtime import"); } });

const step = (type) => ({ type, uuid: type, params: {} });
const steps = ["if", "text", "repeat", "text", "end_repeat", "otherwise", "text", "end_if", "text"].map(step);
expect(flowExports.matchingEnd(steps, 0)).toBe(7);
expect(flowExports.matchingEnd(steps, 2)).toBe(4);
expect([...flowExports.blockDepths(steps)]).toEqual([0, 1, 1, 2, 1, 0, 1, 0, 0]);
const flow = flowExports.parseFlow(steps);
expect(flow[0].kind).toBe("if");
expect(flow[0].yes[1].kind).toBe("repeat");
expect(flow[0].no.length).toBe(1);
expect(flow[1].kind).toBe("action");
expect(flowExports.parseFlow([step("if")])[0].kind).toBe("action"); // Older JSON-based conditionals still load.
expect(() => flowExports.parseFlow([step("otherwise")])).toThrow(/Unexpected otherwise/);
const legacy = [{ type: "if", uuid: "old", params: { condition: true, actions: JSON.stringify([step("text")]), otherwise: JSON.stringify([step("number")]) } }];
let nextId = 0;
const expanded = flowExports.expandLegacyBlocks(legacy, () => `new-${++nextId}`);
expect([...expanded.map((item) => item.type)]).toEqual(["if", "text", "otherwise", "number", "end_if"]);
expect(flowExports.parseFlow(expanded)[0].no[0].step.type).toBe("number");
const trySteps = ["try", "text", "on_error", "text", "end_try"].map(step);
expect(flowExports.matchingEnd(trySteps, 0)).toBe(4);
expect([...flowExports.blockDepths(trySteps)]).toEqual([0, 1, 0, 1, 0]);
expect(flowExports.parseFlow(trySteps)[0].onError[0].step.type).toBe("text");
expect(() => flowExports.parseFlow([step("try")])).toThrow(/missing End Try/);
expect(() => flowExports.parseFlow([step("try"), step("end_try")])).toThrow(/missing On Error/);

const editorSource = fs.readFileSync(path.join(__dirname, "../ts/editor.ts"), "utf8");
const editorJs = ts.transpileModule(editorSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const editorExports = {};
const action = (id, parameters = []) => ({ id, options: { parameters }, enumValues: new Map() });
const all = new Map([["if", action("if", [{ name: "condition", type: "boolean" }])], ["try", action("try")], ["text", action("text", [{ name: "text", type: "text" }])]]);
let guidIndex = 0;
vm.runInNewContext(editorJs, {
  exports: editorExports,
  require(specifier) {
    if (specifier === "vue") return { defineComponent: (options) => options };
    if (specifier === "./intent") return { Intent: { all }, IntentParameterTypes: { Boolean: "boolean", Number: "number" } };
    if (specifier === "./macro") return { Macros: { draft: { intents: [] } } };
    if (specifier === "./variables") return { VARIABLE_VALUES: {}, inputVariable() {}, isVariableValue() { return false; }, parseInputVariable() {} };
    if (specifier === "./flow") return flowExports;
    throw new Error(`Unexpected import: ${specifier}`);
  },
  guid: () => `id-${++guidIndex}`,
});
const editor = { ...editorExports.MacroEditor.methods, macro: { intents: [] }, insertAt: null };
editor.add(all.get("if"));
expect(editor.macro.intents.map((item) => item.type)).toEqual(["if", "otherwise", "end_if"]);
editor.insertAt = 1;
editor.add(all.get("text"));
expect(editor.macro.intents.map((item) => item.type)).toEqual(["if", "text", "otherwise", "end_if"]);
expect([...flowExports.blockDepths(editor.macro.intents)]).toEqual([0, 1, 0, 0]);
editor.insertAt = null;
editor.add(all.get("text"));
editor.move(0, editor.macro.intents.length);
expect(editor.macro.intents.map((item) => item.type)).toEqual(["text", "if", "text", "otherwise", "end_if"]);
editor.remove(1);
expect(editor.macro.intents.map((item) => item.type)).toEqual(["text"]);
editor.add(all.get("try"));
expect(editor.macro.intents.map((item) => item.type)).toEqual(["text", "try", "on_error", "end_try"]);
editor.remove(1);
expect(editor.macro.intents.map((item) => item.type)).toEqual(["text"]);

const macroSource = fs.readFileSync(path.join(__dirname, "../ts/macro.ts"), "utf8");
const macroJs = ts.transpileModule(macroSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const macroExports = {};
const executed = [];
const runtimeIntents = new Map([
  ["text", { perform: async (params) => params.text }],
  ["collect", { perform: async (params) => { executed.push(params.value); return params.value; } }],
  ["increment", { perform: async (_params, _macro, result) => Number(result) + 1 }],
  ["fail_if_two", { perform: async (_params, _macro, result) => { if (result === 2) throw new Error("item failed"); return result; } }],
  ...["if", "otherwise", "end_if", "repeat", "end_repeat", "repeat_each", "end_repeat_each", "try", "on_error", "end_try"].map((type) => [type, { perform: async () => { throw new Error(`Marker ${type} was executed`); } }]),
]);
vm.runInNewContext(macroJs, {
  exports: macroExports,
  require(specifier) {
    if (specifier === "./intent") return { Intent: { all: runtimeIntents, canPerform: (id) => runtimeIntents.has(id) } };
    if (specifier.startsWith("./data/macros/")) return { name: "Preset", intents: [] };
    if (specifier === "vue") return { defineComponent: (options) => options, reactive: (value) => value };
    if (specifier === "./variables") return { VARIABLE_VALUES: { result: "$result", askEachTime: "$ask_each_time", clipboard: "$clipboard", currentDate: "$current_date", deviceDetails: "$device_details" }, parseInputVariable() {} };
    if (specifier === "./flow") return flowExports;
    throw new Error(`Unexpected import: ${specifier}`);
  },
  Blockbench: { isWeb: false, showQuickMessage() {}, showStatusMessage() {}, setProgress() {}, showMessageBox() {} },
  console,
});
const Macros = macroExports.Macros;
const macroStep = (type, params = {}) => ({ type, uuid: `run-${type}-${Math.random()}`, params });
const runMacro = async (steps) => { Macros.all = [{ name: "Flow Test", icon: "play", intents: steps }]; await Macros.run(0); };
  await runMacro([
    macroStep("if", { condition: true }), macroStep("text", { text: "yes" }), macroStep("otherwise"),
    macroStep("text", { text: "no" }), macroStep("end_if"), macroStep("collect", { value: "$result" }),
  ]);
  expect(executed).toEqual(["yes"]);
  executed.length = 0;
  await runMacro([
    macroStep("if", { condition: false }), macroStep("text", { text: "yes" }), macroStep("otherwise"),
    macroStep("text", { text: "no" }), macroStep("end_if"), macroStep("collect", { value: "$result" }),
  ]);
  expect(executed).toEqual(["no"]);
  executed.length = 0;
  await runMacro([
    macroStep("text", { text: 0 }), macroStep("repeat", { count: 3 }), macroStep("increment"),
    macroStep("end_repeat"), macroStep("collect", { value: "$result" }),
  ]);
  expect(executed).toEqual([3]);
  executed.length = 0;
  await runMacro([
    macroStep("text", { text: [1, 2, 3] }), macroStep("repeat_each", { items: "$result" }),
    macroStep("try"), macroStep("fail_if_two"), macroStep("on_error"),
    macroStep("collect", { value: "$result" }), macroStep("end_try"), macroStep("end_repeat_each"),
    macroStep("collect", { value: "$result" }),
  ]);
  expect(executed[0]).toEqual({ name: "Error", message: "item failed" });
  expect(executed[1]).toEqual([1, { name: "Error", message: "item failed" }, 3]);

});
