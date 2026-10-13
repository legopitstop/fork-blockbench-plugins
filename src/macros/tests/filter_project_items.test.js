import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const source = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "../ts/intents/blockbench.ts"),
  "utf8",
);

test("filter project items returns matching UUIDs for Repeat Each", async () => {
  const intents = new Map();
  class Intent {
    constructor(id, options) {
      intents.set(id, options);
    }
    addEnum() {
      return this;
    }
  }
  const firstGroup = { uuid: "group-a", name: "Body", visibility: true, parent: "root" };
  const secondGroup = { uuid: "group-b", name: "Hidden", visibility: false, parent: "root" };
  const context = vm.createContext({
    exports: {},
    require: (id) =>
      id === "../intent"
        ? { Intent, IntentParameterTypes: { Text: "text", Enum: "enum", Number: "number" } }
        : undefined,
    Project: {},
    Cube: {
      all: [
        { uuid: "cube-a", name: "Left Arm", visibility: true, parent: firstGroup },
        { uuid: "cube-b", name: "Right Arm", visibility: false, parent: firstGroup },
        { uuid: "cube-c", name: "Left Leg", visibility: true, parent: secondGroup },
      ],
    },
    Group: { all: [firstGroup, secondGroup] },
    Texture: {
      all: [
        { uuid: "texture-a", name: "Skin", visible: true, group: "texture-group" },
        { uuid: "texture-b", name: "Skin Alt", visible: false, group: "texture-group" },
      ],
    },
    TextureGroup: { all: [{ uuid: "texture-group", name: "Materials" }] },
    Animation: { all: [{ uuid: "animation-a", name: "Walk" }] },
  });
  context.globalThis = context;
  const ts = require("typescript");
  vm.runInContext(
    ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
      .outputText,
    context,
  );
  const filter = intents.get("filter_project_items").perform;
  const result = (params) => Array.from(filter(params));

  expect(result({ items: "cubes", name: "arm", visibility: "visible", parent: "Body" })).toEqual(["cube-a"]);
  expect(result({ items: "cubes", parent: "root" })).toEqual([]);
  expect(result({ items: "groups", visibility: "hidden" })).toEqual(["group-b"]);
  expect(result({ items: "textures", visibility: "hidden", parent: "Materials" })).toEqual(["texture-b"]);
  expect(result({ items: "animations", name: "walk" })).toEqual(["animation-a"]);
  expect(() => filter({ items: "animations", visibility: "hidden" })).toThrow(/do not support/);
});
