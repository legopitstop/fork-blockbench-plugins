import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Desktop intents", () => {
  const fs = require("node:fs");
  const os = require("node:os");
  const vm = require("node:vm");
  const ts = require("typescript");

  const intents = new Map();
  class Intent {
    constructor(id, options) {
      this.options = options;
      intents.set(id, this);
    }
    addEnum() {
      return this;
    }
  }
  const source = fs.readFileSync(path.join(__dirname, "../ts/intents/desktop.ts"), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = vm.createContext({
    exports: {},
    require(specifier) {
      if (specifier === "../intent")
        return { Intent, IntentParameterTypes: { Text: "text", Enum: "enum", Number: "number" } };
      return require(specifier);
    },
    Blockbench: { isWeb: false },
    process,
  });
  context.globalThis = context;
  vm.runInContext(js, context);
  const run = (id, params = {}, result) => intents.get(id).options.perform(params, {}, result);

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "macro-desktop-"));
  try {
    const folder = run("create_folder", { name: "files", path: root });
    const file = path.join(folder, "note.txt");
    expect(run("save_file", { file, content: "hello" })).toBe(file);
    run("append_to_text_file", { name: file, text: " world" });
    expect(fs.readFileSync(file, "utf8")).toBe("hello world");
    expect(run("get_file_from_folder", { folder, name: "note.txt" })).toBe(file);
    expect(() => run("get_file_from_folder", { folder, name: "../outside.txt" })).toThrow(/inside the folder/);
    expect(run("get_contents_of_folder", { folder })[0]).toBe(file);
    expect(run("get_details_of_files", { file, detail: "size" })).toBe(11);
    expect(run("filter_files", { extension: "txt", min_size: 10 }, [file]).length).toBe(1);
    const nested = path.join(folder, "nested");
    fs.mkdirSync(nested);
    const inner = path.join(nested, "notes.txt");
    fs.writeFileSync(inner, "nested file", "utf8");
    fs.utimesSync(inner, new Date("2024-01-01T12:00:00Z"), new Date("2024-01-01T12:00:00Z"));
    expect(run("find_files", { folder, name_pattern: "*.txt", extension: "txt" })).toEqual([file]);
    expect(run("find_files", { folder, recursive: true, name_pattern: "note*.txt", min_size: 10 })).toEqual([
      inner,
      file,
    ]);
    expect(run("find_files", { folder, recursive: true, modified_before: "2024-06-01T00:00:00Z" })).toEqual([inner]);
    expect(run("find_files", { folder, recursive: true, modified_before: "2024-01-01" })).toEqual([inner]);
    expect(run("find_files", { folder: "", recursive: true, modified_after: "2024-06-01T00:00:00Z" }, folder)).toEqual([
      file,
    ]);
    expect(() => run("find_files", { folder, modified_after: "not-a-date" })).toThrow(/valid date/);
    expect(() => run("find_files", { folder, min_size: 20, max_size: 10 })).toThrow(/cannot exceed/);
    const renamed = run("rename_file", { file, name: "renamed.txt" });
    const moved = run("move_file", { src: renamed, dest: root });
    expect(moved).toBe(path.join(root, "renamed.txt"));
    const archive = path.join(root, "files.tar.gz");
    expect(run("make_archive", { input: moved, output: archive, type: "tar.gz" })).toBe(archive);
    const extracted = run("extract_archive", { archive, destination: path.join(root, "extracted") });
    expect(fs.readFileSync(path.join(extracted, "renamed.txt"), "utf8")).toBe("hello world");
    const zip = path.join(root, "files.zip");
    run("make_archive", { input: moved, output: zip, type: "zip" });
    const extractedZip = run("extract_archive", { archive: zip, destination: path.join(root, "unzipped") });
    expect(fs.readFileSync(path.join(extractedZip, "renamed.txt"), "utf8")).toBe("hello world");
    expect(run("delete_file", { file: moved })).toBe(moved);
    expect(fs.existsSync(moved)).toBe(false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
