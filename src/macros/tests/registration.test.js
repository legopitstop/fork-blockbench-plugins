import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Registration intents", () => {
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const folder = path.join(__dirname, "../ts/intents");
const files = ["blockbench", "controls", "desktop", "media", "scripting", "web"];
const all = new Map();
const types = Object.fromEntries(["Text", "Number", "Boolean", "URL", "Date", "Enum", "Variable", "AskEachTime"].map((name) => [name, name.toLowerCase()]));
class Intent {
  constructor(id, options) {
    expect(id).toMatch(/^[a-z][a-z0-9_]*$/);
    expect(!all.has(id)).toBeTruthy();
    expect(typeof options.perform).toBe("function");
    expect(typeof options.category).toBe("string");
    for (const parameter of options.parameters ?? []) {
      expect(parameter.name).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(Object.values(types).includes(parameter.type)).toBeTruthy();
    }
    this.id = id;
    all.set(id, options);
  }
  addEnum(name, values) {
    expect(this.id && Array.isArray(values) && values.length).toBeTruthy();
    return this;
  }
}
Intent.all = all;
Intent.canPerform = (id) => all.has(id);

for (const file of files) {
  const source = fs.readFileSync(path.join(folder, `${file}.ts`), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = vm.createContext({
    exports: {}, process, URL, TextEncoder, crypto, Blob,
    require(specifier) {
      if (specifier === "../intent") return { Intent, IntentParameterTypes: types };
      if (specifier === "../macro") return { Macros: { all: [], resolveParams: async (value) => value } };
      if (specifier === "gif.js/dist/gif.js") return { default: class GIF {} };
      throw new Error(`${file}: unexpected import ${specifier}`);
    },
  });
  context.globalThis = context;
  vm.runInContext(js, context, { filename: `${file}.ts` });
  const declared = [...source.matchAll(/new Intent\("([^"]+)"/g)].map((match) => match[1]);
  for (const id of declared) expect(all.has(id)).toBeTruthy();
}

expect(all.size).toBe(165);

});
