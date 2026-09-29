import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Scripting intents", async () => {
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const intents = new Map();
class Intent {
  constructor(id, options) { this.id = id; this.options = options; intents.set(id, this); }
  addEnum() { return this; }
  perform(params, macro, result) { return this.options.perform(params, macro, result); }
  static canPerform(id) { return intents.has(id); }
}
Intent.all = intents;

const types = Object.fromEntries(["Text", "Number", "Boolean", "URL", "Date", "Enum"].map((name) => [name, name.toLowerCase()]));
const Macros = { resolveParams: async (params) => params, all: [] };
const source = fs.readFileSync(path.join(__dirname, "../ts/intents/scripting.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const context = vm.createContext({
  exports: {},
  require(specifier) {
    if (specifier === "../intent") return { Intent, IntentParameterTypes: types };
    if (specifier === "../macro") return { Macros };
    throw new Error(`Unexpected import: ${specifier}`);
  },
  Blockbench: { showMessageBox() {} },
  navigator: { language: "en-US" },
  window: {},
  setTimeout,
  clearTimeout,
  TextEncoder,
  URL,
  crypto,
});
vm.runInContext(js, context);

const macro = { name: "Test", intents: [] };
const run = (id, params = {}, result) => intents.get(id).options.perform(params, macro, result);

  expect(await run("calculate_expression", { expression: "2 + 3 * (4 - 1)" })).toBe(11);
  expect(await run("calculate_expression", { expression: "2^3^2" })).toBe(512);
  expect(() => run("calculate_expression", { expression: "process.exit()" })).toThrow(/Invalid expression/);
  expect(await run("calculate_statistics", { type: "median", input: "1, 9, 3" })).toBe(3);
  expect(await run("convert_measurement", { to: "cm" }, { value: 2, unit: "m" })).toBe(200);
  expect((await run("date", { date: "2024-01-02" })).toISOString()).toBe("2024-01-02T00:00:00.000Z");

  const list = ["10", "2", "2", "1"];
  expect(Array.from(run("sort_list", { type: "number" }, list))).toEqual(["1", "2", "2", "10"]);
  expect(Array.from(run("sort_list", { type: "number", order: "descending" }, list))).toEqual(["10", "2", "2", "1"]);
  expect(list).toEqual(["10", "2", "2", "1"]);
  expect(Array.from(run("remove_duplicates", {}, list))).toEqual(["10", "2", "1"]);
  expect(Array.from(run("remove_duplicates", {}, [{ a: 1, b: 2 }, { b: 2, a: 1 }]))).toEqual([{ a: 1, b: 2 }]);
  expect(Array.from(run("sort_list", { type: "date" }, ["2024-03-01", "2024-01-01"]))).toEqual(["2024-01-01", "2024-03-01"]);
  expect(run("join_list", { separator: ", " }, ["a", "b", "c"])).toBe("a, b, c");
  expect(run("join_list", {}, ["a", "b"])).toBe("a\nb");
  expect(() => run("sort_list", { type: "number" }, ["one"])).toThrow(/invalid number/);

  const firstDictionary = { name: "cube", shared: "original", nested: { left: true } };
  const secondDictionary = { shared: "updated", nested: { right: true }, count: 2 };
  expect(Array.from(run("get_dictionary_keys", {}, firstDictionary))).toEqual(["name", "shared", "nested"]);
  expect(Array.from(run("get_dictionary_keys", { dictionary: '{"a":1,"b":2}' }))).toEqual(["a", "b"]);
  expect(run("merge_dictionaries", { second: secondDictionary }, firstDictionary)).toEqual({
    name: "cube", shared: "updated", nested: { right: true }, count: 2,
  });
  expect(run("merge_dictionaries", { first: firstDictionary, second: JSON.stringify(secondDictionary), conflict: "keep_first" })).toEqual({
    name: "cube", shared: "original", nested: { left: true }, count: 2,
  });
  expect(firstDictionary.shared).toBe("original");
  expect(() => run("get_dictionary_keys", { dictionary: "[]" })).toThrow(/dictionary/);
  expect(() => run("merge_dictionaries", { second: "invalid" }, firstDictionary)).toThrow(/JSON object/);

  const actions = JSON.stringify([{ type: "calculate", uuid: "increment", params: { number1: "$result", operator: "+", number2: 1 } }]);
  expect(await run("repeat", { count: 3, actions }, 0)).toBe(3);
  expect(await run("if", { condition: false, actions, otherwise: actions }, 4)).toBe(5);

  const matches = await run("match_text", { pattern: "([a-z]+)([0-9]+)" }, "abc123");
  expect(await run("get_group_from_matched_text", { index: 0, group: "2" }, matches)).toBe("123");
  expect((await run("stop_and_output", {}, "done")).__macro_stop).toBe(true);

});
