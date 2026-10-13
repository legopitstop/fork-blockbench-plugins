/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes } from "../intent";
import { Macros } from "../macro";

enum AppearanceOperation {
  Turn = "turn",
  Toggle = "toggle",
}
enum AppearanceMode {
  Dark = "dark",
  Light = "light",
}

function isLight(theme: CustomTheme): boolean {
  const color = theme.colors.back || theme.colors.ui;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not inspect theme colors");
  context.fillStyle = color;
  const normalized = context.fillStyle;
  const hex = /^#([0-9a-f]{6})$/i.exec(normalized);
  const channels = hex
    ? [0, 2, 4].map((offset) => parseInt(hex[1].slice(offset, offset + 2), 16))
    : (normalized.match(/\d+(?:\.\d+)?/g) ?? []).slice(0, 3).map(Number);
  if (channels.length !== 3) throw new Error(`Cannot determine appearance of theme: ${theme.name}`);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 >= 128;
}

new Intent("set_appearance", {
  category: "controls",
  parameters: [
    {
      name: "op",
      type: IntentParameterTypes.Enum,
    },
    {
      name: "mode",
      type: IntentParameterTypes.Enum,
    },
  ],
  perform(params) {
    const current = CustomTheme.selected;
    if (!current) throw new Error("No theme is selected");
    const mode =
      params.op === AppearanceOperation.Toggle
        ? isLight(current)
          ? AppearanceMode.Dark
          : AppearanceMode.Light
        : params.mode;
    if (mode !== AppearanceMode.Dark && mode !== AppearanceMode.Light)
      throw new Error(`Unknown appearance mode: ${mode}`);
    if (isLight(current) === (mode === AppearanceMode.Light)) return current.id;
    const themes = CustomTheme.themes.filter((theme) => !theme.desktop_only || !Blockbench.isWeb);
    const next =
      themes.find((theme) => theme.id === mode) ??
      themes.find((theme) => theme.source === "built_in" && isLight(theme) === (mode === AppearanceMode.Light)) ??
      themes.find((theme) => isLight(theme) === (mode === AppearanceMode.Light));
    if (!next) throw new Error(`No ${mode} theme is available`);
    CustomTheme.loadTheme(next);
    return next.id;
  },
  summary: (params) => {
    return tl(`macros.set_appearance.${params.op}`).replace("$operation", String(params.op));
  },
})
  .addEnum("op", Object.values(AppearanceOperation))
  .addEnum("mode", Object.values(AppearanceMode));

new Intent("take_screenshot", {
  category: "controls",
  parameters: [
    { name: "source", type: IntentParameterTypes.Enum },
    { name: "width", type: IntentParameterTypes.Number },
    { name: "height", type: IntentParameterTypes.Number },
  ],
  perform(params) {
    const width = Number(params.width) || undefined;
    const height = Number(params.height) || undefined;
    if (width !== undefined && (width < 1 || !Number.isFinite(width))) throw new Error("Invalid screenshot width");
    if (height !== undefined && (height < 1 || !Number.isFinite(height))) throw new Error("Invalid screenshot height");
    const options = { width, height };
    return new Promise<string>((resolve) => {
      const callback = (data: string) => resolve(data);
      switch (params.source) {
        case "screen":
          Screencam.fullScreen(options, callback);
          break;
        case "2d":
          Screencam.screenshot2DEditor(options, callback);
          break;
        case "clean":
          Screencam.cleanCanvas(options, callback);
          break;
        case "preview":
          if (!Preview.selected) throw new Error("No preview is selected");
          Screencam.screenshotPreview(Preview.selected, options, callback);
          break;
        default:
          throw new Error(`Unknown screenshot source: ${params.source}`);
      }
    });
  },
}).addEnum("source", ["preview", "screen", "2d", "clean"]);

let imageFolder: { runId: number; folder: string } | undefined;
const browserFolders = new Map<string, any>();
new Intent("choose_output_folder", {
  category: "controls",
  async perform() {
    if (!Blockbench.isWeb) return Blockbench.pickDirectory({ title: "Choose output folder for renders" }) || "__return";
    const picker = (window as any).showDirectoryPicker;
    if (typeof picker !== "function") throw new Error("This browser cannot choose an output folder");
    try {
      const folder = await picker.call(window, { mode: "readwrite" });
      const id = `browser-folder:${guid()}`;
      browserFolders.set(id, folder);
      return id;
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return "__return";
      throw error;
    }
  },
});
new Intent("save_image", {
  category: "controls",
  parameters: [
    { name: "image", type: IntentParameterTypes.Text },
    { name: "name", type: IntentParameterTypes.Text },
    { name: "folder", type: IntentParameterTypes.Text },
  ],
  async perform(params, _macro, result) {
    const image = String(params.image || result || "");
    const match = /^data:image\/png;base64,(.+)$/.exec(image);
    if (!match) throw new Error("Expected a PNG image");
    const bytes = Uint8Array.from(atob(match[1]), (character) => character.charCodeAt(0));
    const name =
      (String(params.name || "image")
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
        .trim() || "image") + ".png";
    const configuredFolder = String(params.folder || "");
    if (configuredFolder.startsWith("browser-folder:")) {
      const folder = browserFolders.get(configuredFolder);
      if (!folder) throw new Error("Output folder is no longer available");
      const file = await folder.getFileHandle(name, { create: true });
      const stream = await file.createWritable();
      await stream.write(bytes);
      await stream.close();
      return name;
    }
    const folder = Blockbench.isWeb
      ? ""
      : configuredFolder ||
        (() => {
          if (imageFolder?.runId === Macros.runId) return imageFolder.folder;
          const selected = Blockbench.pickDirectory({ title: "Choose output folder" });
          if (selected) imageFolder = { runId: Macros.runId, folder: selected };
          return selected;
        })();
    if (!Blockbench.isWeb && !folder) return undefined;
    if (folder) {
      const path = `${folder.replace(/[\\/]$/, "")}/${name}`;
      await new Promise<void>((resolve) =>
        Blockbench.writeFile(path, { content: bytes.buffer, savetype: "buffer" }, () => resolve()),
      );
      return path;
    }
    Blockbench.export({
      type: "PNG Image",
      extensions: ["png"],
      name: name.slice(0, -4),
      content: bytes.buffer,
      savetype: "buffer",
    });
    return name;
  },
});
