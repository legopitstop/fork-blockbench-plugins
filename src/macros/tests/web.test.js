import { test, expect } from "vitest";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("Web intents", async () => {
  const fs = require("node:fs");
  const vm = require("node:vm");
  const ts = require("typescript");

  const intents = new Map();
  class Intent {
    constructor(id, options) {
      intents.set(id, options);
    }
    addEnum() {
      return this;
    }
  }
  const source = fs.readFileSync(path.join(__dirname, "../ts/intents/web.ts"), "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const opened = [];
  let request;
  const response = {
    ok: true,
    url: "https://example.test/final",
    text: async () => "sample",
    headers: new Headers({ "content-type": "text/plain" }),
  };
  const document = {
    querySelector() {
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "item, entry")
        return [
          {
            querySelector(name) {
              return name === "title"
                ? { textContent: "News" }
                : name === "link"
                  ? { getAttribute: () => "/news" }
                  : null;
            },
          },
        ];
      if (selector.startsWith("link[rel=")) return [{ getAttribute: () => "/feed.xml" }];
      if (selector === "script, style, noscript")
        return {
          forEach(callback) {
            callback({ remove() {} });
          },
        };
      return [];
    },
    body: { textContent: "  Hello   world  " },
  };
  const context = vm.createContext({
    exports: {},
    URL,
    Headers,
    encodeURIComponent,
    require(specifier) {
      expect(specifier).toBe("../intent");
      return { Intent, IntentParameterTypes: { Text: "text", URL: "url", Enum: "enum" } };
    },
    window: {
      open(...args) {
        opened.push(args);
      },
    },
    fetch: async (...args) => {
      request = args;
      return response;
    },
    DOMParser: class {
      parseFromString() {
        return document;
      }
    },
  });
  vm.runInContext(js, context);
  const run = (id, params = {}, previous) => {
    expect(intents.has(id)).toBeTruthy();
    return intents.get(id).perform(params, {}, previous);
  };

  expect(intents.size).toBe(12);
  expect(run("search_web", { query: "a & b" })).toBe("https://www.google.com/search?q=a%20%26%20b");
  expect(opened[0]).toEqual(["https://www.google.com/search?q=a%20%26%20b", "_blank", "noopener,noreferrer"]);
  expect(Array.from(run("open_urls", {}, "https://a.test and https://b.test"))).toEqual([
    "https://a.test",
    "https://b.test",
  ]);
  expect(opened.length).toBe(3);
  expect(run("url", { url: "https://example.test/a" }).pathname).toBe("/a");
  expect(run("url_encode", { input: "a b" })).toBe("a%20b");
  expect(Array.from(run("get_urls_from_input", { input: "https://a.test" }))).toEqual(["https://a.test"]);
  expect(run("get_component_of_url", { url: "https://example.test/a", component: "pathname" })).toBe("/a");
  expect(await run("expand_url", { url: "https://example.test/short" })).toBe("https://example.test/final");
  expect(request[1].method).toBe("HEAD");
  expect(await run("get_contents_of_url", { url: "https://example.test" })).toBe("sample");
  expect((await run("get_headers_of_url", { url: "https://example.test" }))["content-type"]).toBe("text/plain");
  expect(request[1].method).toBe("HEAD");
  expect((await run("get_items_from_rss_feed", { url: "https://example.test/feed" }))[0].title).toBe("News");
  expect(Array.from(await run("get_rss_feeds_from_page", { url: "https://example.test/page" }))).toEqual([
    "https://example.test/feed.xml",
  ]);
  expect(await run("get_contents_of_web_page", { url: "https://example.test" })).toBe("Hello world");
  response.ok = false;
  response.status = 404;
  await expect(run("get_contents_of_url", { url: "https://example.test/missing" })).rejects.toThrow(/404/);
});
