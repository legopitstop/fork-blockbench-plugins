import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/pixel_pets/pixel_pets.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
