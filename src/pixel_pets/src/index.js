import './languages.js';
import { VERSION, ID } from "./constants.js";

import { spawnPet } from './actions.js';

// Pets
import './animal/cat.js';
import './animal/dog.js';

(function () {
  var deleteables = [];
  BBPlugin.register(ID, {
    title: "Pixel Pets",
    author: "legopitstop",
    icon: "icon.png",
    description: "",
    has_changelog: true,
    website: "https://docs.lpsmods.dev/pixel_pets",
    repository:
      "https://github.com/legopitstop/blockbench-plugins/tree/master/src/pixel_pets",
    variant: "both",
    version: VERSION,
    min_version: "4.8.0",
    tags: ["Blockbench"],
    new_repository_format: true,
    onload() {
      deleteables.push(spawnPet);
    },
    onunload() {
      deleteables.forEach((d) => d.delete());
    },
  });
})();
