/// <reference types="blockbench-types" />

import { MacroData, Macros } from "./macro";
import { defineComponent } from "vue";
import { hasPlugin, loadJson, saveJson } from "./utils";

export interface IntentData {
  type: string;
  uuid: string;
  params: IntentParameters;
}

export type IntentResult = boolean | string | number | URL | Date | "__return";

export enum IntentParameterTypes {
  Text = "text",
  Number = "number",
  Boolean = "boolean",
  URL = "url",
  Date = "date",
  Enum = "enum",
  Variable = "variable",
  AskEachTime = "ask",
}

export interface IntentParameter {
  name: string;
  type: IntentParameterTypes;
}

export type IntentParameters = { [key: string]: boolean | string | number | URL | Date };

export interface IntentOptions {
  /**
   * Runs this intent.
   * @param {IntentParameters} params
   * @param {MacroData} macro
   * @param {IntentResult} result
   * @returns {IntentResult}
   */
  perform: (
    params: IntentParameters,
    macro: MacroData,
    result: IntentResult,
  ) => IntentResult | Promise<IntentResult | undefined> | undefined;

  /**
   * Whether or not this intent can run.
   * @returns
   */
  condition?: () => boolean;
  category?: string;
  name?: string;
  icon?: string;
  description?: string;
  requirePlugins?: string[];
  parameters?: IntentParameter[];
  form?: InputFormConfig;
  /**
   * Where the variant can be ran. Desktop refers to the electron app, web refers to the web app and PWA
   */
  variant?: "both" | "desktop" | "web";
  summary?: (params: IntentParameters) => string;

  // Events
  onChange?: (params: IntentParameters) => void;
}

export class Intent {
  static DEFAULT_PINNED = ["show_content"];

  static menu: Action;
  static manageDialog: Dialog;
  static editDialog: Dialog;
  static actionChooser: Dialog;

  static all = new Map<string, Intent>();

  static get pinned(): Intent[] {
    const ids = loadJson("pinned_intents", Intent.DEFAULT_PINNED) as string[];
    return [...this.all.values()].filter((x) => ids?.includes(x.id));
  }

  static get categories(): Map<string, string> {
    const result = new Map();
    for (const intent of Intent.all.values()) {
      const cat = intent.options.category;
      if (!cat) continue;
      result.set(cat, tl(`macros.category.${cat}`));
    }
    return result;
  }

  /**
   * Search for intents.
   * @param {string} query 
   * @returns {Intent[]}
   */
  static search(query: string): Intent[] {
    const tokens = query.split(" ");
    const cats: string[] = [];
    const plugins: string[] = [];
    const search: string[] = [];
    for (const token of tokens) {
      if (token.startsWith("category:")) {
        cats.push(token.replace("category:", ""));
        continue;
      }
      if (token.startsWith("plugin:")) {
        plugins.push(token.replace("plugin:", ""));
        continue;
      }
      search.push(token);
    }

    const searchText = search.join(" ").toLowerCase();
    return [...Intent.all.values()].filter((intent) => {
      const category = intent.options.category;
      const categoryMatch = cats.length === 0 || (category !== undefined && cats.includes(category));
      const pluginMatch = plugins.length === 0 || (intent instanceof PluginIntent && plugins.includes(intent.pluginId));
      const nameMatch = searchText.length === 0 || intent.getName().toLowerCase().includes(searchText);
      return (categoryMatch && pluginMatch) || nameMatch;
    });
  }

  static component = defineComponent({
    name: "Intent",
    props: {
      intent: { type: Object },
    },
    data() {
      return {
        formId: guid(),
        showForm: false,
        intentType: Intent.all.get(this.intent?.type),
        form: undefined,
      };
    },
    mounted() {
      const form = new InputForm(this.intentType.form).node;
      $(`#${this.formId}`).append(form);
    },
    methods: {
      renderSummary(intent: IntentData): string {
        return Macros.renderSummary(intent);
      },
      deleteIntent(uuid: string): void {
        if (!Macros.selected) return;
        Macros.selected.intents = Macros.selected.intents.filter((intent) => intent.uuid !== uuid);
      },
    },
    template: `
  <div>
    <div class="delete_macro_intent_button" @click="deleteIntent(intent.uuid)">
        <i class="material-icons">clear</i>
    </div>
    <div class="intent_icon">
        <i class="material-icons">{{intentType.options?.icon ?? 'token'}}</i>
    </div>
    <div class="intent_summary" v-html="renderSummary(intent)"></div>
    <span class="form_intent_button" v-if="intentType.options.form" @click="showForm = !showForm">
      <i class="material-icons" v-if="showForm">keyboard_arrow_down</i>
      <i class="material-icons" v-else>keyboard_arrow_right</i>
    </span>
    <div v-if="showForm && intentType.options.form"><hr><div :formId="id"></div></div>
  </div>`,
  });

  constructor(id: string, options?: IntentOptions) {
    this.id = id;
    this.options = options ?? { perform: () => undefined };
    if (!this.options.name) this.options.name = tl(`macros.${this.id}`);
    if (!this.options.description) this.options.description = tl(`macros.${this.id}.desc`);
    if (!this.options.summary) this.options.summary = () => tl(`macros.${this.id}.summary`);
    this.initialize();
  }

  initialize() {
    Intent.all.set(this.id, this);
  }

  readonly id: string;
  options: IntentOptions;

  getName(): string {
    return this.options.name ?? tl(`macros.${this.id}`);
  }

  addEnum(name: string, values: string[]): Intent {
    return this;
  }

  async perform(params: IntentParameters, macro: MacroData, result: IntentResult): Promise<IntentResult> {
    return await this.options.perform(params, macro, result);
  }

  static canPerform(intentType: string): boolean {
    const intent = this.all.get(intentType);
    if (!intent) return false;
    const variant = Blockbench.isWeb ? "web" : "desktop";
    const v = intent.options?.variant ?? "both";
    if (v === "both") return true;
    if (v !== variant) return false;
    return false;
  }

  /**
   * Pin this action in the action chooser.
   */
  pin(): void {
    const ids: Set<string> = new Set(loadJson("pinned_intents", Intent.DEFAULT_PINNED));
    ids.add(this.id);
    saveJson("pinned_intents", ids);
  }

  /**
   * Unpin this action from the action chooser.
   */
  unpin(): void {
    const ids: Set<string> = new Set(loadJson("pinned_intents", Intent.DEFAULT_PINNED));
    ids.delete(this.id);
    saveJson("pinned_intents", ids);
  }
}

export class PluginIntent extends Intent {
  static pluginIds = new Set();
  readonly pluginId: string;

  static get plugins(): any[] {
    return Plugins.installed.filter((x) => PluginIntent.pluginIds.has(x.id));
  }

  constructor(id: string, pluginId: string, options?: IntentOptions) {
    super(id, options);
    this.pluginId = pluginId;
  }

  initialize() {
    if (!hasPlugin(this.pluginId)) return;
    super.initialize();
    PluginIntent.pluginIds.add(this.pluginId);
  }
}
