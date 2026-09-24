import { ID } from "./constants.js";

/**
 * Wraps a function in a try-catch statement to log any errors.
 * @param {Function} callback
 */
export function wrapError(callback) {
  try {
    callback();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Converts a given string into Title Case.
 * @param {String} str
 * @returns
 */
export function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

export function getId(id) {
  return `${ID}_${id}`;
}

export class SystemMemory {
  static #total = null;

  static getTotal() {
    if ((this.#total = null)) {
      this.#total = process.getSystemMemoryInfo().total;
    }
    return this.#total / 1e6;
  }

  static getTier() {
    var total = this.getTotal();
    if (total <= 4) return 'superlow';  // 3b
    if (total <= 8) return 'low';       // 7b
    if (total <= 16) return 'mid';      // 13b
    if (total <= 32) return 'high';     // 30b
    if (total <= 64) return 'veryhigh'; // 65b
    if (total <= 128) return 'ultra';   // 130b
  }
}
