/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes as Type, IntentResult } from "../intent";

const field = (name: string, type: Type = Type.Text) => ({ name, type });
const value = (input: IntentResult, previous: IntentResult) => input === undefined || input === "" ? previous : input;
const string = (input: IntentResult) => String(input ?? "").trim();

function node() {
  if (Blockbench.isWeb) throw new Error("File actions require desktop Blockbench");
  const requireNode = (globalThis as any).require;
  if (typeof requireNode !== "function") throw new Error("Node access is unavailable");
  return {
    fs: requireNode("node:fs") as typeof import("node:fs"),
    path: requireNode("node:path") as typeof import("node:path"),
    child: requireNode("node:child_process") as typeof import("node:child_process"),
  };
}

function required(input: IntentResult, label: string): string {
  const result = string(input);
  if (!result) throw new Error(`${label} is required`);
  return result;
}

function paths(input: IntentResult): string[] {
  if (Array.isArray(input)) return input.flatMap(paths);
  const path = string(input);
  return path ? [path] : [];
}

function stats(path: string) {
  const { fs } = node();
  const stat = fs.statSync(path);
  return { path, name: node().path.basename(path), size: stat.size, isDirectory: stat.isDirectory(),
    created: stat.birthtime.toISOString(), modified: stat.mtime.toISOString(), extension: node().path.extname(path) };
}

function optionalNumber(input: IntentResult, label: string, fallback: number): number {
  if (input === "" || input == null) return fallback;
  const number = Number(input);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} must be a nonnegative number`);
  return number;
}

function optionalDate(input: IntentResult, label: string, fallback: number, endOfDay = false): number {
  if (input === "" || input == null) return fallback;
  const date = input instanceof Date ? input.getTime() : new Date(String(input)).getTime();
  if (!Number.isFinite(date)) throw new Error(`${label} must be a valid date`);
  return endOfDay && typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input) ? date + 86_399_999 : date;
}

function namePattern(input: IntentResult): RegExp | undefined {
  const pattern = string(input);
  if (!pattern) return;
  const source = Array.from(pattern).map((character) => character === "*" ? ".*" : character === "?" ? "."
    : character.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")).join("");
  return new RegExp(`^${source}$`, "i");
}

function run(command: string, args: string[]): void {
  const { child } = node();
  const process = child.spawnSync(command, args, { encoding: "utf8", windowsHide: true });
  if (process.error) throw process.error;
  if (process.status !== 0) throw new Error(process.stderr?.trim() || `${command} exited with code ${process.status}`);
}

new Intent("select_file", {
  category: "desktop", variant: "desktop", parameters: [field("file")],
  perform(params) {
    const file = string(params.file);
    if (file) { node().fs.accessSync(file); return file; }
    return new Promise((resolve) => Blockbench.import({ type: "File", extensions: ["*"], readtype: "buffer", multiple: false },
      (files) => resolve(files?.[0]?.path || undefined)));
  },
});

new Intent("move_file", {
  category: "desktop", variant: "desktop", parameters: [field("src"), field("dest")],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const src = required(value(params.src, result), "Source file");
    let dest = required(params.dest, "Destination");
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) dest = path.join(dest, path.basename(src));
    fs.renameSync(src, dest);
    return dest;
  },
});

new Intent("rename_file", {
  category: "desktop", variant: "desktop", parameters: [field("file"), field("name")],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const file = required(value(params.file, result), "File");
    const name = required(params.name, "New name");
    if (path.basename(name) !== name || name === "." || name === "..") throw new Error("New name must be a file name");
    const target = path.join(path.dirname(file), name);
    fs.renameSync(file, target);
    return target;
  },
});

new Intent("save_file", {
  category: "desktop", variant: "desktop", parameters: [field("file"), field("content")],
  perform(params, _macro, result) {
    const file = required(params.file, "File path");
    const content = value(params.content, result);
    node().fs.writeFileSync(file, typeof content === "string" ? content : JSON.stringify(content ?? "", null, 2), "utf8");
    return file;
  },
});

new Intent("delete_file", {
  category: "desktop", variant: "desktop", parameters: [field("file")],
  perform(params, _macro, result) {
    const file = required(value(params.file, result), "File");
    node().fs.unlinkSync(file);
    return file;
  },
});

new Intent("create_folder", {
  category: "desktop", variant: "desktop", parameters: [field("name"), field("path")],
  perform(params) {
    const { fs, path } = node();
    const name = required(params.name, "Folder name");
    const folder = string(params.path) ? path.join(string(params.path), name) : name;
    fs.mkdirSync(folder, { recursive: true });
    return folder;
  },
});

new Intent("get_contents_of_folder", {
  category: "desktop", variant: "desktop", parameters: [field("folder")],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const folder = required(value(params.folder, result), "Folder");
    return fs.readdirSync(folder).map((name) => path.join(folder, name));
  },
});

new Intent("find_files", {
  category: "desktop", variant: "desktop",
  description: "Find files in a folder. Name Pattern uses * and ? wildcards; size is in bytes and modified dates are inclusive.",
  parameters: [field("folder"), field("recursive", Type.Boolean), field("name_pattern"), field("extension"),
    field("min_size", Type.Number), field("max_size", Type.Number), field("modified_after", Type.Date), field("modified_before", Type.Date)],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const folder = path.resolve(required(value(params.folder, result), "Folder"));
    if (!fs.statSync(folder).isDirectory()) throw new Error(`Not a folder: ${folder}`);
    const recursive = params.recursive === true || params.recursive === "true";
    const pattern = namePattern(params.name_pattern);
    const requestedExtension = string(params.extension).toLowerCase();
    const extension = requestedExtension ? `.${requestedExtension.replace(/^\./, "")}` : "";
    const minSize = optionalNumber(params.min_size, "Minimum size", 0);
    const maxSize = optionalNumber(params.max_size, "Maximum size", Infinity);
    const after = optionalDate(params.modified_after, "Modified After", -Infinity);
    const before = optionalDate(params.modified_before, "Modified Before", Infinity, true);
    if (minSize > maxSize) throw new Error("Minimum size cannot exceed maximum size");
    if (after > before) throw new Error("Modified After cannot be later than Modified Before");
    const found: string[] = [];
    const pending = [folder];
    while (pending.length) {
      const current = pending.pop()!;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const file = path.join(current, entry.name);
        if (entry.isDirectory()) { if (recursive) pending.push(file); continue; }
        if (!entry.isFile()) continue;
        if (pattern && !pattern.test(entry.name)) continue;
        if (extension && path.extname(entry.name).toLowerCase() !== extension) continue;
        const stat = fs.statSync(file);
        if (stat.size < minSize || stat.size > maxSize || stat.mtimeMs < after || stat.mtimeMs > before) continue;
        found.push(file);
      }
    }
    return found.sort((a, b) => a.localeCompare(b));
  },
});

new Intent("get_file_from_folder", {
  category: "desktop", variant: "desktop", parameters: [field("folder"), field("name")],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const folder = required(value(params.folder, result), "Folder");
    const name = required(params.name, "File name");
    const file = path.resolve(folder, name);
    const relative = path.relative(path.resolve(folder), file);
    if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("File must be inside the folder");
    fs.accessSync(file);
    return file;
  },
});

new Intent("append_to_text_file", {
  category: "desktop", variant: "desktop", parameters: [field("name"), field("text"), field("operation", Type.Enum)],
  perform(params, _macro, result) {
    const file = required(params.name, "Text file");
    const text = String(value(params.text, result) ?? "");
    const operation = string(params.operation).toLowerCase();
    if (operation === "prepend") {
      const fs = node().fs;
      fs.writeFileSync(file, text + (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""), "utf8");
    } else if (operation === "append" || !operation) node().fs.appendFileSync(file, text, "utf8");
    else throw new Error(`Unsupported operation: ${operation}`);
    return file;
  },
}).addEnum("operation", ["append", "prepend"]);

new Intent("make_archive", {
  category: "desktop", variant: "desktop", parameters: [field("input"), field("output"), field("type", Type.Enum)],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const inputs = paths(value(params.input, result));
    if (!inputs.length) throw new Error("Archive input is required");
    const type = string(params.type).toLowerCase() || "zip";
    if (!["zip", "tar", "tar.gz", "tgz"].includes(type)) throw new Error(`Unsupported archive type: ${type}`);
    const output = path.resolve(required(params.output, "Archive output"));
    if (type === "zip" && !output.toLowerCase().endsWith(".zip")) throw new Error("ZIP output must end in .zip");
    for (const input of inputs) fs.accessSync(input);
    const root = path.dirname(path.resolve(inputs[0]));
    const members = inputs.map((input) => path.relative(root, path.resolve(input)));
    if (members.some((member) => member.startsWith("..") || path.isAbsolute(member))) throw new Error("Archive inputs must share a parent folder");
    const flag = type === "zip" ? "-a" : type === "tar.gz" || type === "tgz" ? "-z" : "";
    run("tar", [...(flag ? [flag] : []), "-cf", output, "-C", root, ...members]);
    return output;
  },
}).addEnum("type", ["zip", "tar", "tar.gz", "tgz"]);

new Intent("extract_archive", {
  category: "desktop", variant: "desktop", parameters: [field("archive"), field("destination")],
  perform(params, _macro, result) {
    const { fs, path } = node();
    const archive = path.resolve(required(value(params.archive, result), "Archive"));
    const destination = path.resolve(string(params.destination) || path.dirname(archive));
    fs.mkdirSync(destination, { recursive: true });
    run("tar", ["-xf", archive, "-C", destination]);
    return destination;
  },
});

new Intent("open_file", {
  category: "desktop", variant: "desktop", parameters: [field("file"), field("app")],
  async perform(params, _macro, result) {
    const { fs, child } = node();
    const file = required(value(params.file, result), "File");
    fs.accessSync(file);
    const app = string(params.app);
    if (!app) {
      const shell = (globalThis as any).require("electron").shell as typeof import("electron").shell;
      const error = await shell.openPath(file);
      if (error) throw new Error(error);
    } else {
      const opened = child.spawn(app, [file], { detached: true, stdio: "ignore", windowsHide: true });
      await new Promise<void>((resolve, reject) => {
        opened.once("error", reject);
        opened.once("spawn", resolve);
      });
      opened.unref();
    }
    return file;
  },
});

new Intent("get_details_of_files", {
  category: "desktop", variant: "desktop", parameters: [field("file"), field("detail", Type.Enum)],
  perform(params, _macro, result) {
    const files = paths(value(params.file, result));
    if (!files.length) throw new Error("File is required");
    const detail = string(params.detail);
    const details = files.map((file) => {
      const info = stats(file);
      if (detail && !(detail in info)) throw new Error(`Unknown file detail: ${detail}`);
      return detail ? info[detail as keyof typeof info] : info;
    });
    return details.length === 1 ? details[0] : details;
  },
}).addEnum("detail", ["path", "name", "size", "isDirectory", "created", "modified", "extension"]);

new Intent("filter_files", {
  category: "desktop", variant: "desktop", parameters: [field("file"), field("name"), field("extension"), field("min_size", Type.Number), field("max_size", Type.Number)],
  perform(params, _macro, result) {
    const files = paths(value(params.file, result));
    const name = string(params.name).toLowerCase();
    const extension = string(params.extension).toLowerCase().replace(/^\.?/, ".");
    const min = params.min_size === "" || params.min_size == null ? -Infinity : Number(params.min_size);
    const max = params.max_size === "" || params.max_size == null ? Infinity : Number(params.max_size);
    if (Number.isNaN(min) || Number.isNaN(max)) throw new Error("File size must be a number");
    return files.filter((file) => {
      const info = stats(file);
      return (!name || info.name.toLowerCase().includes(name)) && (!extension || info.extension.toLowerCase() === extension)
        && info.size >= min && info.size <= max;
    });
  },
});
