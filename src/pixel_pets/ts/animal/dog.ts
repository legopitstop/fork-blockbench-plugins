import { VariantComponent } from "../component/variant.js";
import { WalkComponent } from "../component/walk.js";
import { Animal } from "./index.js";

class Dog extends Animal {
  constructor() {
    super("dog", "Dog", "legopitstop");
  }

  setup() {
    this.addComponent(new WalkComponent());
    this.addComponent(new VariantComponent());
  }
}

Animal.register(Dog);
