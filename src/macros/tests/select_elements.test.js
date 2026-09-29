import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const source = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../ts/intents/blockbench.ts"), "utf8");

test("select elements replaces or adds a resolved list", () => {
  const intents = new Map();
  class Intent {
    constructor(id, options) { intents.set(id, options); }
    addEnum() { return this; }
  }
  const selected = new Set(["old"]);
  const nodes = ["cube-a", "cube-b", "group-a"].map((uuid) => ({
    uuid, name: uuid.toUpperCase(), locked: false,
    select(event) { if (!event.ctrlOrCmd) selected.clear(); selected.add(uuid); },
  }));
  const edits = [];
  const context = vm.createContext({
    exports: {},
    require: (id) => id === "../intent" ? { Intent, IntentParameterTypes: { Text: "text", Enum: "enum", Number: "number" } } : undefined,
    Project: {}, Outliner: { nodes },
    Undo: { initSelection: () => edits.push("start"), finishSelection: () => edits.push("finish") },
    unselectAll: () => selected.clear(),
  });
  context.globalThis = context;
  const ts = require("typescript");
  vm.runInContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  const select = intents.get("select_elements").perform;

  expect(Array.from(select({ elements: "", mode: "replace" }, {}, ["cube-a", "cube-b"]))).toEqual(["cube-a", "cube-b"]);
  expect([...selected]).toEqual(["cube-a", "cube-b"]);
  expect(Array.from(select({ elements: "GROUP-A, cube-a, cube-a", mode: "add" }))).toEqual(["group-a", "cube-a"]);
  expect([...selected]).toEqual(["cube-a", "cube-b", "group-a"]);
  expect(() => select({ elements: "cube-a, missing", mode: "replace" })).toThrow(/not found/);
  expect([...selected]).toEqual(["cube-a", "cube-b", "group-a"]);
  nodes[0].locked = true;
  expect(() => select({ elements: "cube-a", mode: "replace" })).toThrow(/locked/);
  expect(edits).toEqual(["start", "finish", "start", "finish"]);
});
