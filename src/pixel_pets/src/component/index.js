/**
 * Base animal component.
 */
export class Component {
  constructor(id) {
    this.id = id;
  }
}

/**
 * Base animal attribute component.
 */
export class AttributeComponent extends Component {
  constructor(id, defaultValue = 0) {
    this.id = id;
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }
}
