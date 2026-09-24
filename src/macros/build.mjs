import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/macros/macros.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
