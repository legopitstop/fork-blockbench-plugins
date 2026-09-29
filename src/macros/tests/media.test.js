import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Media intents", async () => {
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const intents = new Map();
class Intent {
  constructor(id, options) { this.options = options; intents.set(id, this); }
  addEnum() { return this; }
}
const source = fs.readFileSync(path.join(__dirname, "../ts/intents/media.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const canvases = [];
let workerCreated = false, workerRevoked = false, usedGifJs = false;
class GIF {
  constructor(options) { expect(options.workerScript).toMatch(/^blob:/); usedGifJs = true; }
  addFrame() {}
  on(event, callback) { if (event === "finished") this.finished = callback; }
  render() { this.finished({}); }
}
const context = vm.createContext({
  exports: {},
  require(specifier) {
    if (specifier === "../intent") return { Intent, IntentParameterTypes: { Text: "text", Number: "number", Enum: "enum" } };
    if (specifier === "gif.js/dist/gif.js") return { default: GIF };
    return require(specifier);
  },
  TextEncoder,
  URL: { createObjectURL() { workerCreated = true; return "blob:gif-worker"; }, revokeObjectURL() { workerRevoked = true; } },
  Blob,
  __GIF_WORKER_SOURCE__: "worker source",
  Blockbench: { isWeb: true },
  document: { baseURI: "https://example.test/", createElement() {
    const canvas = { width: 0, height: 0, getContext() { return { drawImage() {} }; }, toDataURL() { return "data:image/png;base64,AA=="; } };
    canvases.push(canvas);
    return canvas;
  } },
  Image: class {
    naturalWidth = 2;
    naturalHeight = 1;
    set src(_) { queueMicrotask(() => this.onload()); }
  },
  FileReader: class {
    readAsDataURL() { this.result = "data:image/gif;base64,R0lGODlh"; this.onload(); }
  },
});
vm.runInContext(`${js.replace("return modules;", "exports.qrBitsPlaced = cursor; return modules;")}\nexports.qrModules = qrModules;`, context);
expect(intents.size).toBe(22);

const qr = context.exports.qrModules("Hello");
expect(context.exports.qrBitsPlaced).toBe(208);
expect(qr.length).toBe(21);
expect(qr.every((row) => row.length === 21)).toBeTruthy();
expect(qr[0][0]).toBe(true);
expect(qr[3][3]).toBe(true);
expect(qr[13][8]).toBe(true);
expect(() => context.exports.qrModules("This text is longer than 17 bytes")).toThrow(/17 UTF-8 bytes/);

const [result, resized] = await Promise.all([
  intents.get("make_gif").options.perform({ content: "data:image/png;base64,AA==" }, {}, undefined),
  intents.get("resize_image").options.perform({ image: "data:image/png;base64,AA==", width: 10 }, {}, undefined),
]);
  expect(usedGifJs).toBeTruthy();
  expect(workerCreated && workerRevoked).toBeTruthy();
  expect(result.startsWith("data:image/gif;base64,")).toBeTruthy();
  expect(resized.startsWith("data:image/png;base64,")).toBeTruthy();
  expect(canvases.some((canvas) => canvas.width === 10 && canvas.height === 5)).toBeTruthy();

});
