import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/object_notes/object_notes.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
