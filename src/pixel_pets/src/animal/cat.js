import { VariantComponent } from "../component/variant.js";
import { WalkComponent } from "../component/walk.js";
import { Animal } from "./index.js";

class Cat extends Animal {
  constructor() {
    super("cat", "Cat", "legopitstop");
  }

  setup() {
    this.addComponent(new WalkComponent());
    this.addComponent(new VariantComponent());
  }
}

Animal.register(Cat);
