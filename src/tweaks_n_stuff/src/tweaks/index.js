import { ID } from "../constants.js";
import { wrapError } from "../utils.js";

/**
 * Base tweak class.
 */
export class Tweak {
  static all = new Set();

  /**
   * @param {String} id
   * @param {String} name
   * @param {String} author
   * @param {String} description
   * @param {String} category
   * @param {String} condition
   */
  constructor(id, author, category, condition, name, description) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.description = description;
    this.category = category;
    this.deleteables = [];
    this.condition = condition;
    this.pluginId = ID;
    this.setting = null;
    // this.setup();

    // Fix for setting not showing up in plugin page.
    // if (this.setting) {
    //   this.setting.plugin = this.pluginId;
    // }
  }

  createConfig() {
    return {
      enabled: true,
    };
  }

  get config() {
    return TweakConfig.settings[this.id];
  }

  set config(value) {
    TweakConfig.settings[this.id] = value;
  }

  /**
   * Register this tweak.
   * @param {Tweak} tweakClass
   * @returns
   */
  static register(tweakClass) {
    if (tweakClass === Tweak) return;
    Tweak.all.add(tweakClass);
    console.debug(`🔧 Registered tweak "${tweakClass.id}"`);
  }

  /**
   * Load this tweak.
   */
  load() {
    this.setup();
    // Fix for setting not showing up in plugin page.
    if (this.setting) {
      this.setting.plugin = this.pluginId;
    }
    wrapError(this.onLoad.bind(this));
  }

  /**
   * Unload this tweak.
   */
  unload() {
    wrapError(this.onUnload.bind(this));
    this.delete();
  }

  /**
   * Install this tweak.
   */
  install() {
    wrapError(this.onInstall.bind(this));
  }

  /**
   * Uninstall this tweak.
   */
  uninstall() {
    wrapError(this.onUninstall.bind(this));
  }

  /**
   * Delete this tweak with its setting and deleteables.
   */
  delete() {
    this.deleteables.forEach((e) => e.delete());
    if (this.setting) this.setting.delete();
  }

  /**
   * Enable this tweak.
   */
  enable() {
    console.debug(`✅ Enabled tweak "${this.id}"`);
    this.isActive = true;
  }

  /**
   * Disable this tweak.
   */
  disable() {
    if (this.isActive) {
      console.debug(`❌ Disabled tweak "${this.id}"`);
    }
  }

  /**
   * Called when this tweak is created.
   */
  setup() {}

  /**
   * Called when this tweak is loaded.
   */
  onLoad() {}

  /**
   * Called when this tweak is unloaded.
   */
  onUnload() {}

  /**
   * Called when this plugin is installed.
   */
  onInstall() {}

  /**
   * Called when this plugin is uninstalled.
   */
  onUninstall() {}
}

/**
 * Base tweak with a "toggle" setting.
 */
export class ToggleTweak extends Tweak {
  /**
   * @param {String} id
   * @param {String} name
   * @param {String} author
   * @param {String} description
   * @param {String} category
   * @param {String} defaultValue
   * @param {String} condition
   */
  constructor(
    id,
    author,
    category,
    defaultValue = true,
    condition,
    name,
    description
  ) {
    super(id, author, category, condition, name, description);
    this.defaultValue = defaultValue;
  }

  get disabled() {
    return !Settings.get(this.id, false);
  }

  setup() {
    this.isActive = false;
    this.setting = new Setting(this.id, {
      name: this.name,
      type: "toggle",
      value: this.defaultValue,
      description: this.description,
      category: this.category,
      condition: this.condition,
      onChange: (v) => this.#onChange(v),
    });
  }

  onLoad() {
    if (this.disabled) return;
    this.enable();
  }

  onUnload() {
    this.disable();
  }

  enable() {
    super.enable();
    wrapError(this.onEnable.bind(this));
  }

  disable() {
    super.disable();
    if (!this.isActive) return;
    this.isActive = false;
    wrapError(this.onDisable.bind(this));
  }

  #onChange(value) {
    this.disable();
    if (!value) return;
    return this.enable();
  }

  /**
   * Called when this tweak is enabled.
   */
  onEnable() {}

  /**
   * Called when this tweak is disabled.
   */
  onDisable() {}
}

/**
 * Base tweak with a dialog setting.
 */
export class EditTweak extends Tweak {
  setup() {
    this.dialog = this.createDialog();
    this.deleteables.push(this.dialog);

    this.setting = new Setting(this.id, {
      name: this.name,
      type: "click",
      value: this.defaultValue,
      description: this.description,
      category: this.category,
      condition: this.condition,
      icon: "edit",
      click: this.onClick.bind(this),
    });
  }

  /**
   * Called when the user clicks the setting.
   */
  onClick() {
    this.dialog.show();
  }

  createDialog() {}
}

// TODO: Default value not set.
/**
 * Base tweak with a "select" setting.
 */
export class SelectTweak extends Tweak {
  /**
   * @param {String} id
   * @param {String} name
   * @param {String} author
   * @param {String} description
   * @param {String} category
   * @param {String} condition
   * @param {String} defaultKey
   */
  constructor(
    id,
    author,
    category,
    condition,
    defaultKey = "default",
    name,
    description
  ) {
    super(id, author, category, condition, name, description);
    this.defaultKey = defaultKey;
  }

  get disabled() {
    return Settings.get(this.id) == this.defaultKey;
  }

  setup() {
    this.options = this.getOptions();
    this.isActive = false;
    this.setting = new Setting(this.id, {
      name: this.name,
      type: "select",
      options: this.options,
      value: this.defaultKey,
      description: this.description,
      category: this.category,
      condition: this.condition,
      onChange: (v) => this.#onChange(v),
    });
  }

  onLoad() {
    if (this.disabled) return;
    this.enable();
  }

  onUnload() {
    this.disable();
  }

  enable() {
    super.enable();
    this.isActive = true;
    try {
      this.onEnable();
    } catch (err) {
      console.error(err);
    }
  }

  disable() {
    super.disable();
    if (!this.isActive) return;
    this.isActive = false;
    try {
      this.onDisable();
    } catch (err) {
      console.error(err);
    }
  }

  #onChange(value) {
    this.disable();
    if (this.disabled) return;
    return this.enable();
  }

  getOptions() {
    return { default: "Disabled" };
  }

  /**
   * Called when this tweak is enabled.
   */
  onEnable() {}

  /**
   * Called when this tweak is disabled.
   */
  onDisable() {}
}

/**
 * Handles tweak settings. Like wether or not its enabled or not.
 */
export class TweakConfig {
  static settings = {};

  static load() {
    var s = localStorage.getItem("tweaks_n_stuff.config");
    if (!s) {
      TweakConfig.settings = {};
      for (const t of Tweak.all) {
        TweakConfig.settings[t.id] = t.createConfig();
      }
      return TweakConfig.save();
    }
    TweakConfig.settings = JSON.parse(s);
  }

  static save() {
    localStorage.setItem(
      "tweaks_n_stuff.config",
      JSON.stringify(TweakConfig.settings)
    );
  }
}

Tweak.dialog = new Dialog("tweaks", {
  title: "Tweaks",
  buttons: [],
  width: 1200,
  resizable: "xy",
  component: {
    data: {
      tweaks: Tweak.all,
    },
    methods: {},
    mount_directly: true,
    template: `<content style="display: flex;" class="dialog_content">
      <div id="tweaks_browser_sidebar">
        <ul>
          <li v-for="tweak in tweaks" :key="tweak.id">{{ tweak.name }}</li>
        </ul>
      </div>
    </content>`,
  },
});

Tweak.action = new Action("tweaks_window", {
  name: "Tweaks…",
  description: "Open the tweak config window.",
  icon: "build",
  click: () => {
    Tweak.dialog.show();
  },
});
