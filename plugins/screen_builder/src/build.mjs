import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../screen_builder.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
