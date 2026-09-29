/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes as Type, IntentResult } from "../intent";
import GIF from "gif.js/dist/gif.js";

declare const __GIF_WORKER_SOURCE__: string;

const field = (name: string, type: Type = Type.Text) => ({ name, type });
const pick = (input: IntentResult, previous: IntentResult) => input === undefined || input === "" ? previous : input;
const str = (input: IntentResult) => String(input ?? "");
const number = (input: IntentResult, fallback: number) => input === undefined || input === "" ? fallback : Number(input);

function positive(input: IntentResult, label: string, fallback?: number): number {
  const result = number(input, fallback ?? NaN);
  if (!Number.isFinite(result) || result <= 0) throw new Error(`${label} must be a positive number`);
  return Math.round(result);
}

function canvas(width: number, height: number): HTMLCanvasElement {
  const element = document.createElement("canvas");
  element.width = Math.max(1, Math.round(width));
  element.height = Math.max(1, Math.round(height));
  return element;
}

function context(element: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = element.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  return ctx;
}

function sources(input: IntentResult): string[] {
  if (Array.isArray(input)) return input.flatMap(sources);
  if (input && typeof input === "object" && !(input instanceof URL) && !(input instanceof Date)) {
    const data = input as Record<string, IntentResult>;
    return sources(data.image ?? data.url ?? data.path);
  }
  const source = str(input).trim();
  return source ? [source] : [];
}

function imageUrl(source: string): string {
  if (!/^(data:|blob:|https?:|file:)/i.test(source)) {
    if (Blockbench.isWeb) throw new Error("Local image paths require desktop Blockbench");
    const requireNode = (globalThis as any).require;
    if (typeof requireNode !== "function") throw new Error("Node access is unavailable");
    const fs = requireNode("node:fs") as typeof import("node:fs");
    const path = requireNode("node:path") as typeof import("node:path");
    const extension = path.extname(source).slice(1).toLowerCase();
    const mime = ({ jpg: "jpeg", svg: "svg+xml" } as Record<string, string>)[extension] || extension || "png";
    return `data:image/${mime};base64,${fs.readFileSync(source).toString("base64")}`;
  }
  return source;
}

async function load(input: IntentResult): Promise<HTMLImageElement> {
  const source = sources(input)[0];
  if (!source) throw new Error("Image is required");
  const url = imageUrl(source);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${source}`));
    image.src = url;
  });
}

function output(element: HTMLCanvasElement, format = "png", quality = 0.92): string {
  const type = format.toLowerCase().replace(/^image\//, "");
  if (!["png", "jpeg", "webp"].includes(type)) throw new Error(`Unsupported image format: ${type}`);
  return element.toDataURL(`image/${type}`, quality);
}

async function edit(input: IntentResult, draw: (ctx: CanvasRenderingContext2D, image: HTMLImageElement) => void,
  width?: number, height?: number): Promise<string> {
  const image = await load(input);
  const element = canvas(width ?? image.naturalWidth, height ?? image.naturalHeight);
  draw(context(element), image);
  return output(element);
}

new Intent("convert_image", {
  category: "media", parameters: [field("image"), field("format", Type.Enum), field("quality", Type.Number)],
  async perform(params, _macro, result) {
    const image = await load(pick(params.image, result));
    const element = canvas(image.naturalWidth, image.naturalHeight);
    context(element).drawImage(image, 0, 0);
    return output(element, str(params.format) || "png", number(params.quality, 0.92));
  },
}).addEnum("format", ["png", "jpeg", "webp"]);

new Intent("filter_images", {
  category: "media", parameters: [field("images"), field("format"), field("min_width", Type.Number), field("min_height", Type.Number)],
  async perform(params, _macro, result) {
    const images = sources(pick(params.images, result));
    const format = str(params.format).replace(/^\./, "").toLowerCase();
    if (format && !/^[a-z0-9+]+$/.test(format)) throw new Error("Invalid image format");
    const filtered: string[] = [];
    for (const source of images) {
      if (format && !new RegExp(`(?:\\.${format}(?:[?#]|$)|^data:image/${format}[;,])`, "i").test(source)) continue;
      const image = await load(source);
      if (image.naturalWidth >= number(params.min_width, 0) && image.naturalHeight >= number(params.min_height, 0)) filtered.push(source);
    }
    return filtered;
  },
});

new Intent("get_details_of_image", {
  category: "media", parameters: [field("image"), field("detail", Type.Enum)],
  async perform(params, _macro, result) {
    const source = sources(pick(params.image, result))[0];
    const image = await load(source);
    const info = { width: image.naturalWidth, height: image.naturalHeight, aspectRatio: image.naturalWidth / image.naturalHeight,
      source, format: /^data:image\/([^;,]+)/.exec(source)?.[1] || /\.([a-z0-9]+)(?:[?#]|$)/i.exec(source)?.[1] || "unknown" };
    const detail = str(params.detail);
    if (detail && !(detail in info)) throw new Error(`Unknown image detail: ${detail}`);
    return detail ? info[detail as keyof typeof info] : info;
  },
}).addEnum("detail", ["width", "height", "aspectRatio", "source", "format"]);

new Intent("get_image_from_input", {
  category: "media", parameters: [field("input")],
  async perform(params, _macro, result) {
    const image = await load(pick(params.input, result));
    const element = canvas(image.naturalWidth, image.naturalHeight);
    context(element).drawImage(image, 0, 0);
    return output(element);
  },
});

new Intent("make_image_from_rich_text", {
  category: "media", parameters: [field("text"), field("width", Type.Number), field("height", Type.Number), field("font_size", Type.Number), field("color"), field("background")],
  perform(params, _macro, result) {
    const element = canvas(positive(params.width, "Width", 600), positive(params.height, "Height", 200));
    const ctx = context(element);
    if (params.background) { ctx.fillStyle = str(params.background); ctx.fillRect(0, 0, element.width, element.height); }
    const size = positive(params.font_size, "Font size", 24);
    ctx.font = `${size}px sans-serif`;
    ctx.fillStyle = str(params.color) || "#000000";
    str(pick(params.text, result)).replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]*>/g, "").split("\n")
      .forEach((line, index) => ctx.fillText(line, 10, 10 + size * (index + 1)));
    return output(element);
  },
});

new Intent("extract_text_from_image", {
  category: "media", parameters: [field("image")],
  async perform(params, _macro, result) {
    const Detector = (globalThis as any).TextDetector;
    if (!Detector) throw new Error("Text recognition is unavailable in this Blockbench runtime");
    const image = await load(pick(params.image, result));
    const words = await new Detector().detect(image) as { rawValue: string }[];
    return words.map((word) => word.rawValue).join("\n");
  },
});

new Intent("markup", {
  category: "media", parameters: [field("document"), field("shape", Type.Enum), field("x", Type.Number), field("y", Type.Number), field("width", Type.Number), field("height", Type.Number), field("color"), field("line_width", Type.Number)],
  async perform(params, _macro, result) {
    return edit(pick(params.document, result), (ctx, image) => {
      ctx.drawImage(image, 0, 0);
      ctx.strokeStyle = str(params.color) || "#ff0000";
      ctx.lineWidth = positive(params.line_width, "Line width", 3);
      const x = number(params.x, 0), y = number(params.y, 0), w = number(params.width, 100), h = number(params.height, 100);
      if (params.shape === "ellipse") { ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2); ctx.stroke(); }
      else if (params.shape === "line") { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.stroke(); }
      else ctx.strokeRect(x, y, w, h);
    });
  },
}).addEnum("shape", ["rectangle", "ellipse", "line"]);

new Intent("combine_images", {
  category: "media", parameters: [field("images"), field("orientation", Type.Enum), field("spacing", Type.Number)],
  async perform(params, _macro, result) {
    const images = await Promise.all(sources(pick(params.images, result)).map(load));
    if (!images.length) throw new Error("Images are required");
    const spacing = Math.max(0, number(params.spacing, 0));
    const vertical = params.orientation === "vertical";
    const width = vertical ? Math.max(...images.map((image) => image.naturalWidth)) : images.reduce((sum, image) => sum + image.naturalWidth, spacing * (images.length - 1));
    const height = vertical ? images.reduce((sum, image) => sum + image.naturalHeight, spacing * (images.length - 1)) : Math.max(...images.map((image) => image.naturalHeight));
    const element = canvas(width, height), ctx = context(element);
    let offset = 0;
    for (const image of images) { ctx.drawImage(image, vertical ? 0 : offset, vertical ? offset : 0); offset += (vertical ? image.naturalHeight : image.naturalWidth) + spacing; }
    return output(element);
  },
}).addEnum("orientation", ["horizontal", "vertical"]);

new Intent("crop_image", {
  category: "media", parameters: [field("image"), field("x", Type.Number), field("y", Type.Number), field("width", Type.Number), field("height", Type.Number)],
  async perform(params, _macro, result) {
    const image = await load(pick(params.image, result));
    const x = number(params.x, 0), y = number(params.y, 0);
    const width = positive(params.width, "Width", image.naturalWidth - x), height = positive(params.height, "Height", image.naturalHeight - y);
    const element = canvas(width, height);
    context(element).drawImage(image, x, y, width, height, 0, 0, width, height);
    return output(element);
  },
});

new Intent("flip_image", {
  category: "media", parameters: [field("image"), field("orientation", Type.Enum)],
  perform(params, _macro, result) {
    return edit(pick(params.image, result), (ctx, image) => {
      if (params.orientation === "vertical") { ctx.translate(0, image.naturalHeight); ctx.scale(1, -1); }
      else { ctx.translate(image.naturalWidth, 0); ctx.scale(-1, 1); }
      ctx.drawImage(image, 0, 0);
    });
  },
}).addEnum("orientation", ["horizontal", "vertical"]);

new Intent("mask_image", {
  category: "media", parameters: [field("image"), field("shape", Type.Enum)],
  perform(params, _macro, result) {
    return edit(pick(params.image, result), (ctx, image) => {
      ctx.beginPath();
      if (params.shape === "circle") ctx.ellipse(image.naturalWidth / 2, image.naturalHeight / 2, Math.min(image.naturalWidth, image.naturalHeight) / 2, Math.min(image.naturalWidth, image.naturalHeight) / 2, 0, 0, Math.PI * 2);
      else if (params.shape === "ellipse") ctx.ellipse(image.naturalWidth / 2, image.naturalHeight / 2, image.naturalWidth / 2, image.naturalHeight / 2, 0, 0, Math.PI * 2);
      else ctx.rect(0, 0, image.naturalWidth, image.naturalHeight);
      ctx.clip(); ctx.drawImage(image, 0, 0);
    });
  },
}).addEnum("shape", ["circle", "ellipse", "rectangle"]);

new Intent("overlay_image", {
  category: "media", parameters: [field("image1"), field("image2"), field("x", Type.Number), field("y", Type.Number), field("opacity", Type.Number)],
  async perform(params, _macro, result) {
    const base = await load(pick(params.image1, result)), overlay = await load(params.image2);
    const element = canvas(base.naturalWidth, base.naturalHeight), ctx = context(element);
    ctx.drawImage(base, 0, 0); ctx.globalAlpha = Math.max(0, Math.min(1, number(params.opacity, 1)));
    ctx.drawImage(overlay, number(params.x, 0), number(params.y, 0));
    return output(element);
  },
});

new Intent("overlay_text", {
  category: "media", parameters: [field("image"), field("text"), field("location", Type.Enum), field("x", Type.Number), field("y", Type.Number), field("font_size", Type.Number), field("color")],
  perform(params, _macro, result) {
    return edit(pick(params.image, result), (ctx, image) => {
      ctx.drawImage(image, 0, 0);
      const size = positive(params.font_size, "Font size", 24), location = str(params.location);
      ctx.font = `${size}px sans-serif`; ctx.fillStyle = str(params.color) || "#ffffff";
      const text = str(params.text), width = ctx.measureText(text).width;
      const x = location === "center" ? (image.naturalWidth - width) / 2 : location === "bottom_right" ? image.naturalWidth - width - 10 : number(params.x, 10);
      const y = location === "center" ? image.naturalHeight / 2 : location === "bottom_right" ? image.naturalHeight - 10 : number(params.y, size + 10);
      ctx.fillText(text, x, y);
    });
  },
}).addEnum("location", ["custom", "center", "bottom_right"]);

new Intent("resize_image", {
  category: "media", parameters: [field("image"), field("width", Type.Number), field("height", Type.Number)],
  async perform(params, _macro, result) {
    const image = await load(pick(params.image, result));
    const width = params.width ? positive(params.width, "Width") : Math.round(image.naturalWidth * positive(params.height, "Height") / image.naturalHeight);
    const height = params.height ? positive(params.height, "Height") : Math.round(image.naturalHeight * width / image.naturalWidth);
    const element = canvas(width, height);
    context(element).drawImage(image, 0, 0, width, height);
    return output(element);
  },
});

new Intent("rotate_image", {
  category: "media", parameters: [field("image"), field("rotate", Type.Number)],
  async perform(params, _macro, result) {
    const image = await load(pick(params.image, result));
    const radians = number(params.rotate, 0) * Math.PI / 180;
    const width = Math.ceil(Math.abs(image.naturalWidth * Math.cos(radians)) + Math.abs(image.naturalHeight * Math.sin(radians)));
    const height = Math.ceil(Math.abs(image.naturalWidth * Math.sin(radians)) + Math.abs(image.naturalHeight * Math.cos(radians)));
    const element = canvas(width, height), ctx = context(element);
    ctx.translate(width / 2, height / 2); ctx.rotate(radians); ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    return output(element);
  },
});

new Intent("remove_image_background", {
  category: "media", parameters: [field("image"), field("tolerance", Type.Number)],
  async perform(params, _macro, result) {
    const image = await load(pick(params.image, result));
    const element = canvas(image.naturalWidth, image.naturalHeight), ctx = context(element);
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, element.width, element.height), data = pixels.data;
    const sample = [data[0], data[1], data[2]], tolerance = Math.max(0, number(params.tolerance, 30));
    const width = element.width, height = element.height;
    const seen = new Uint8Array(width * height), queue: number[] = [];
    for (let x = 0; x < width; x++) queue.push(x, (height - 1) * width + x);
    for (let y = 0; y < height; y++) queue.push(y * width, y * width + width - 1);
    while (queue.length) {
      const pixel = queue.pop()!;
      if (seen[pixel]) continue;
      seen[pixel] = 1;
      const index = pixel * 4;
      const distance = Math.hypot(data[index] - sample[0], data[index + 1] - sample[1], data[index + 2] - sample[2]);
      if (distance > tolerance) continue;
      data[index + 3] = 0;
      const x = pixel % width, y = Math.floor(pixel / width);
      if (x > 0) queue.push(pixel - 1);
      if (x + 1 < width) queue.push(pixel + 1);
      if (y > 0) queue.push(pixel - width);
      if (y + 1 < height) queue.push(pixel + width);
    }
    ctx.putImageData(pixels, 0, 0);
    return output(element);
  },
});

new Intent("get_frames_from_image", {
  category: "media", parameters: [field("image")],
  async perform(params, _macro, result) {
    const source = sources(pick(params.image, result))[0];
    if (!source) throw new Error("Image is required");
    const Decoder = (globalThis as any).ImageDecoder;
    if (!Decoder) {
      if (/^data:image\/gif|\.gif(?:[?#]|$)/i.test(source)) throw new Error("Animated frame decoding is unavailable in this Blockbench runtime");
      const image = await load(source);
      const element = canvas(image.naturalWidth, image.naturalHeight);
      context(element).drawImage(image, 0, 0);
      return [output(element)];
    }
    const response = await fetch(imageUrl(source));
    const bytes = await response.arrayBuffer();
    const decoder = new Decoder({ data: bytes, type: response.headers.get("content-type") || "image/gif" });
    await decoder.tracks.ready;
    const frames: string[] = [];
    for (let index = 0; index < decoder.tracks.selectedTrack.frameCount; index++) {
      const { image } = await decoder.decode({ frameIndex: index });
      const element = canvas(image.displayWidth, image.displayHeight);
      context(element).drawImage(image, 0, 0); frames.push(output(element)); image.close();
    }
    decoder.close();
    return frames;
  },
});

new Intent("share", {
  category: "media", parameters: [field("input")],
  async perform(params, _macro, result) {
    if (!navigator.share) throw new Error("Sharing is unavailable in this Blockbench runtime");
    const input = str(pick(params.input, result));
    await navigator.share(/^https?:\/\//i.test(input) ? { url: input } : { text: input });
    return input;
  },
});

new Intent("copy_to_clipboard", {
  category: "media", parameters: [field("content")],
  async perform(params, _macro, result) {
    const content = str(pick(params.content, result));
    await navigator.clipboard.writeText(content);
    return content;
  },
});

new Intent("get_clipboard", {
  category: "media", async perform() { return navigator.clipboard.readText(); },
});

new Intent("make_gif", {
  category: "media", parameters: [field("content"), field("delay", Type.Number)],
  async perform(params, _macro, result) {
    const images = await Promise.all(sources(pick(params.content, result)).map(load));
    if (!images.length) throw new Error("GIF frames are required");
    const width = images[0].naturalWidth, height = images[0].naturalHeight;
    const canvases = images.map((image) => {
      const element = canvas(width, height), ctx = context(element);
      ctx.drawImage(image, 0, 0, width, height);
      return element;
    });
    const delay = positive(params.delay, "Delay", 100);
    const workerUrl = URL.createObjectURL(new Blob([__GIF_WORKER_SOURCE__], { type: "text/javascript" }));
    return new Promise<string>((resolve, reject) => {
      try {
        const encoder = new GIF({ workers: 2, quality: 10, workerScript: workerUrl, width, height, repeat: 0 });
        for (const frame of canvases) encoder.addFrame(frame, { delay, copy: true });
        encoder.on("finished", (blob: Blob) => {
          URL.revokeObjectURL(workerUrl);
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        encoder.on("error", (error: Error) => { URL.revokeObjectURL(workerUrl); reject(error); });
        encoder.render();
      } catch (error) {
        URL.revokeObjectURL(workerUrl);
        reject(error);
      }
    });
  },
});

function gfMultiply(left: number, right: number): number {
  let product = 0;
  for (let index = 0; index < 8; index++) {
    if (right & 1) product ^= left;
    left = (left << 1) ^ ((left & 128) ? 0x11d : 0);
    right >>= 1;
  }
  return product;
}

function qrModules(text: string): boolean[][] {
  const input = new TextEncoder().encode(text);
  if (input.length > 17) throw new Error("QR text is limited to 17 UTF-8 bytes");
  const bits: number[] = [0, 1, 0, 0];
  for (let shift = 7; shift >= 0; shift--) bits.push((input.length >> shift) & 1);
  for (const byte of input) for (let shift = 7; shift >= 0; shift--) bits.push((byte >> shift) & 1);
  for (let index = 0; index < 4 && bits.length < 152; index++) bits.push(0);
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let index = 0; index < bits.length; index += 8) data.push(bits.slice(index, index + 8).reduce((sum, bit) => (sum << 1) | bit, 0));
  let pad = 0;
  while (data.length < 19) data.push(pad++ % 2 ? 0x11 : 0xec);
  let divisor = [1], power = 1;
  for (let index = 0; index < 7; index++) {
    const next = Array(divisor.length + 1).fill(0);
    divisor.forEach((coefficient, position) => { next[position] ^= coefficient; next[position + 1] ^= gfMultiply(coefficient, power); });
    divisor = next; power = gfMultiply(power, 2);
  }
  const remainder = Array(7).fill(0);
  for (const byte of data) {
    const factor = byte ^ remainder.shift()!;
    remainder.push(0);
    for (let index = 0; index < 7; index++) remainder[index] ^= gfMultiply(divisor[index + 1], factor);
  }
  const stream = [...data, ...remainder].flatMap((byte) => Array.from({ length: 8 }, (_, shift) => (byte >> (7 - shift)) & 1));
  const modules = Array.from({ length: 21 }, () => Array(21).fill(false) as boolean[]);
  const reserved = Array.from({ length: 21 }, () => Array(21).fill(false) as boolean[]);
  const set = (x: number, y: number, dark: boolean) => {
    if (x >= 0 && y >= 0 && x < 21 && y < 21) { modules[y][x] = dark; reserved[y][x] = true; }
  };
  for (const [cx, cy] of [[3, 3], [17, 3], [3, 17]]) {
    for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
      const ring = Math.max(Math.abs(x), Math.abs(y));
      set(cx + x, cy + y, ring === 3 || ring <= 1);
    }
  }
  for (let index = 8; index <= 12; index++) { set(index, 6, index % 2 === 0); set(6, index, index % 2 === 0); }
  const format = 0x77c4; // Error correction L, mask 0.
  for (let index = 0; index < 15; index++) {
    const bit = ((format >> index) & 1) !== 0;
    if (index < 6) set(8, index, bit);
    else if (index === 6) set(8, 7, bit);
    else if (index === 7) set(8, 8, bit);
    else if (index === 8) set(7, 8, bit);
    else set(14 - index, 8, bit);
    if (index < 8) set(20 - index, 8, bit);
    else set(8, index + 6, bit);
  }
  set(8, 13, true);
  let cursor = 0;
  for (let right = 20; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < 21; vertical++) {
      const y = ((right + 1) & 2) ? vertical : 20 - vertical;
      for (let offset = 0; offset < 2; offset++) {
        const x = right - offset;
        if (!reserved[y][x]) modules[y][x] = Boolean(stream[cursor++] ?? 0) !== ((x + y) % 2 === 0);
      }
    }
  }
  return modules;
}

new Intent("create_qr_code", {
  category: "media", parameters: [field("text"), field("size", Type.Number)],
  perform(params, _macro, result) {
    const modules = qrModules(str(pick(params.text, result)));
    const pixels = positive(params.size, "Size", 250);
    const scale = Math.max(1, Math.floor(pixels / 29)), element = canvas(scale * 29, scale * 29), ctx = context(element);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, element.width, element.height);
    ctx.fillStyle = "#000000";
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) if (modules[y][x]) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
    return output(element);
  },
});
