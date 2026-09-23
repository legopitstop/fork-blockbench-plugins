import { AttributeComponent } from "./index.js";

export class VariantComponent extends AttributeComponent {
  constructor(defaultValue = 0) {
    super("variant", defaultValue);
  }
}
