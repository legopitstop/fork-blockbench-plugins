import { Animal } from "./animal/index.js";

export const spawnPet = new Action("spawn_pet", {
  name: "Spawn Pet",
  click: () => {
    const pets = {};
    for (let pet of Animal.all) {
      pets[pet.id] = pet.name;
    }
    const form = {
      petType: { type: "select", label: "Pet", options: pets },
    };

    // TODO: Add addional options.

    new Dialog("spawn_pet", {
      title: "Spawn Pet",
      form: form,
      onConfirm(res) {
        console.log(res);
      },
    }).show();
  },
});
