import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/ai_bench/ai_bench.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
