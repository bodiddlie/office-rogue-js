export class Entity {
  constructor() {
    this.components = new Map();
  }

  addComponent(type, component) {
    this.components.set(type, component);
  }

  removeComponent(type) {
    this.components.delete(type);
  }
}
