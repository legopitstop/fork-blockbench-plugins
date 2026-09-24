import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/screen_builder/screen_builder.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
