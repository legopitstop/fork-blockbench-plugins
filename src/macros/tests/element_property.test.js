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

test("get and set cube or group properties with undo", () => {
  const intents = new Map();
  class Intent {
    constructor(id, options) {
      intents.set(id, options);
    }
    addEnum() {
      return this;
    }
  }
  class Cube {
    static all = [];
    constructor() {
      Object.assign(this, {
        uuid: "cube-1",
        name: "Box",
        visibility: true,
        from: [1, 2, 3],
        to: [3, 5, 7],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
      });
    }
  }
  const cube = new Cube();
  Cube.all.push(cube);
  const group = { uuid: "group-1", name: "Body", visibility: true, origin: [0, 0, 0], rotation: [0, 0, 0] };
  const edits = [];
  const context = vm.createContext({
    exports: {},
    require: (id) =>
      id === "../intent"
        ? { Intent, IntentParameterTypes: { Text: "text", Enum: "enum", Number: "number" } }
        : undefined,
    Project: {},
    Cube,
    Group: { all: [group] },
    Undo: {
      initEdit: (details) => edits.push(["start", details]),
      finishEdit: (label) => edits.push(["finish", label]),
    },
    Canvas: { updateAll: () => edits.push(["update"]) },
  });
  context.globalThis = context;
  const ts = require("typescript");
  vm.runInContext(
    ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
      .outputText,
    context,
  );
  const get = intents.get("get_element_property").perform;
  const set = intents.get("set_element_property").perform;

  expect(Array.from(get({ element: "cube-1", property: "size" }))).toEqual([2, 3, 4]);
  expect(Array.from(set({ element: "cube-1", property: "position", value: "4, 5, 6" }))).toEqual([4, 5, 6]);
  expect(cube.to).toEqual([6, 8, 10]);
  expect(cube.origin).toEqual([3, 3, 3]);
  expect(Array.from(set({ element: "cube-1", property: "size", value: [1, 2, 3] }))).toEqual([1, 2, 3]);
  expect(set({ element: "Body", property: "visibility", value: "false" })).toBe(false);
  expect(group.visibility).toBe(false);
  expect(() => set({ element: "Body", property: "size", value: "1,1,1" })).toThrow(/only available for cubes/);
  expect(() => set({ element: "cube-1", property: "size", value: "-1,2,3" })).toThrow(/cannot be negative/);
  expect(edits.filter(([kind]) => kind === "start")).toHaveLength(3);
  expect(edits.filter(([kind]) => kind === "finish")).toHaveLength(3);
});
