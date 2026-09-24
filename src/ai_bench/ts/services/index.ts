import { ID } from "../constants.js";
import { wrapError } from "../utils.js";

/**
 * Base service class.
 */
export class Service {
  static all = [];
  static selected = null;

  /**
   * @param {String} id
   * @param {String} name
   * @param {String} author
   * @param {String} description
   * @param {String} variant [desktop, web, both]
   */
  constructor(id, author, variant, name, description, privacyUrl) {
    this.id = id;
    this.author = author;
    this.name = name ? name : tl(`service.${id}`);
    this.description = description ? description : tl(`service.${id}.desc`);
    this.variant = variant;
    this.privacyUrl = privacyUrl;
    this.deleteables = [];
    this.checkpoints = {}; // aka ai "models"
    this.pluginId = ID;
    this.setup();
  }

  get type() {
    return "custom";
  }

  get isActive() {
    return Service.selected == this;
  }

  /**
   * Storage id for this service.
   * @param {String} name
   * @returns
   */
  getId(name) {
    return this.id + "." + name;
  }

  /**
   * Add a new checkpoint (AI model).
   * @param {String} name
   * @param {String} value
   * @returns
   */
  addCheckpoint(name, value) {
    this.checkpoints[value] = name;
    return this;
  }

  /**
   * When a new message is sent.
   * @param {String} newMsg
   */
  onMessage(newMsg) {}

  /**
   * Register this service.
   * @param {Service} serviceClass
   * @returns
   */
  static register(serviceClass) {
    if (serviceClass === Service) return;
    Service.all.push(serviceClass);
    console.debug(`✨ Registered service "${serviceClass.id}"`);
  }

  /**
   * Load this service.
   */
  load() {
    console.debug(`✅ Loaded service ${this.id}`);
    if (Service.selected == this) return;
    Service.selected = this;
    wrapError(this.onLoad.bind(this));
  }

  /**
   * Unload this service.
   */
  unload() {
    console.debug(`❌ Unloaded service ${this.id}`);
    if (Service.selected != this) return;
    Service.selected = null;
    wrapError(this.onUnload.bind(this));
    this.delete();
  }

  /**
   * Install this service.
   */
  install() {
    wrapError(this.onInstall.bind(this));
  }

  /**
   * Uninstall this service.
   */
  uninstall() {
    wrapError(this.onUninstall);
  }

  /**
   * Delete this service and its deleteables.
   */
  delete() {
    this.deleteables.forEach((d) => d.delete());
  }

  /**
   * Called when this service is created.
   */
  setup() {}

  /**
   * Called when this service is loaded.
   */
  onLoad() {}

  /**
   * Called when this service is unloaded.
   */
  onUnload() {}

  /**
   * Called when this service is installed.
   */
  onInstall() {}

  /**
   * Called when this service is uninstalled.
   */
  onUninstall() {}

  /**
   * Show a dialog with extra options for this service.
   */
  show() {}
}

/**
 * Base local service class.
 */
export class LocalService extends Service {
  get type() {
    return "local";
  }
}

/**
 * Base cloud service class.
 */
export class CloudService extends Service {
  get type() {
    return "cloud";
  }
}
