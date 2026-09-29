/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes as Type, IntentResult } from "../intent";

const string = (value: IntentResult) => value == null ? "" : String(value);
const source = (params: Record<string, IntentResult>, result: IntentResult) => string(params.url || params.input || result);
const urls = (value: IntentResult): string[] => Array.isArray(value) ? value.map(string) : string(value).match(/https?:\/\/[^\s<>"']+/g) ?? [];

new Intent("search_web", {
  category: "web", parameters: [{ name: "query", type: Type.Text }],
  perform(params, _macro, result) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(string(params.query || result))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return url;
  },
});

new Intent("open_urls", {
  category: "web", parameters: [{ name: "urls", type: Type.Text }],
  perform(params, _macro, result) {
    const list = urls(params.urls || result);
    for (const url of list) window.open(url, "_blank", "noopener,noreferrer");
    return list;
  },
});

new Intent("get_items_from_rss_feed", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const response = await fetch(source(params, result));
    if (!response.ok) throw new Error(`RSS request failed: ${response.status}`);
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("Invalid RSS or Atom feed");
    return [...xml.querySelectorAll("item, entry")].map((item) => ({
      title: item.querySelector("title")?.textContent ?? "",
      link: item.querySelector("link")?.getAttribute("href") || item.querySelector("link")?.textContent || "",
      description: item.querySelector("description, summary, content")?.textContent ?? "",
      date: item.querySelector("pubDate, published, updated")?.textContent ?? "",
    }));
  },
});

new Intent("get_rss_feeds_from_page", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const page = source(params, result);
    const response = await fetch(page);
    if (!response.ok) throw new Error(`Page request failed: ${response.status}`);
    const document = new DOMParser().parseFromString(await response.text(), "text/html");
    return [...document.querySelectorAll('link[rel="alternate"][type="application/rss+xml"], link[rel="alternate"][type="application/atom+xml"]')]
      .map((link) => new URL(link.getAttribute("href") || "", page).href);
  },
});

new Intent("url", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  perform(params, _macro, result) { return new URL(source(params, result)); },
});

new Intent("url_encode", {
  category: "web", parameters: [{ name: "input", type: Type.Text }],
  perform(params, _macro, result) { return encodeURIComponent(string(params.input || result)); },
});

new Intent("get_urls_from_input", {
  category: "web", parameters: [{ name: "input", type: Type.Text }],
  perform(params, _macro, result) { return urls(params.input || result); },
});

new Intent("get_component_of_url", {
  category: "web", parameters: [{ name: "url", type: Type.URL }, { name: "component", type: Type.Enum }],
  perform(params, _macro, result) {
    const url = new URL(source(params, result));
    const component = string(params.component) as keyof URL;
    const value = url[component];
    return typeof value === "string" ? value : undefined;
  },
}).addEnum("component", ["href", "protocol", "host", "hostname", "port", "pathname", "search", "hash", "origin"]);

new Intent("expand_url", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const response = await fetch(source(params, result), { method: "HEAD", redirect: "follow" });
    if (!response.ok) throw new Error(`URL request failed: ${response.status}`);
    return response.url;
  },
});

new Intent("get_contents_of_url", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const response = await fetch(source(params, result));
    if (!response.ok) throw new Error(`URL request failed: ${response.status}`);
    return response.text();
  },
});

new Intent("get_headers_of_url", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const response = await fetch(source(params, result), { method: "HEAD" });
    if (!response.ok) throw new Error(`URL request failed: ${response.status}`);
    return Object.fromEntries(response.headers.entries());
  },
});

new Intent("get_contents_of_web_page", {
  category: "web", parameters: [{ name: "url", type: Type.URL }],
  async perform(params, _macro, result) {
    const response = await fetch(source(params, result));
    if (!response.ok) throw new Error(`Page request failed: ${response.status}`);
    const document = new DOMParser().parseFromString(await response.text(), "text/html");
    document.querySelectorAll("script, style, noscript").forEach((node) => node.remove());
    return document.body?.textContent?.replace(/\s+/g, " ").trim() ?? "";
  },
});
