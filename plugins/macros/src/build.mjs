import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../macros.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
