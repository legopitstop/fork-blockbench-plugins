import { Component } from "../component/index.js";

/**
 * Base animal class.
 */
export class Animal {
  static all = new Set();

  constructor(id, name, author) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.components = new Set();
    this.setup();
  }

  setup() {}

  /**
   * Adds a component to this animal.
   * @param {Component} component
   */
  addComponent(component) {
    this.components.add(component);
  }

  /**
   * Plays an animation for this animal.
   * @param {String} id
   */
  playAnimation(id) {
    console.log(`play animation ${id}`);
  }

  /**
   * Stops an animation for this animal.
   * @param {String} id
   */
  stopAnimation(id) {
    console.log(`stop animation ${id}`);
  }

  /**
   * Plays a sound for this animal.
   * @param {String} id
   */
  playSound(id) {
    console.log(`play sound ${id}`);
  }

  /**
   * Stops a sound from this animal.
   * @param {String} id
   */
  stopSound(id) {
    console.log(`stop sound ${id}`);
  }

  /**
   * Spawn a new instance of this animal.
   */
  spawn() {}

  /**
   * Register an animal class.
   * @param {Animal} animalClass
   * @returns
   */
  static register(animalClass) {
    if (animalClass == Animal) return;
    Animal.all.push(animalClass);
  }
}
