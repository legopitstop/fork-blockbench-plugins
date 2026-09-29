import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const gifWorker = readFileSync(require.resolve("gif.js/dist/gif.worker.js"), "utf8");

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/macros/macros.js",
  format: "esm",
  bundle: true,
  minify: true,
  define: { __GIF_WORKER_SOURCE__: JSON.stringify(gifWorker) },
};

await build({ ...buildOptions });
