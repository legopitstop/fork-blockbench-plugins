import { Intent, IntentData, IntentParameters, IntentResult } from "./intent";

import PRESET_4 from "./data/macros/test.json";
import PRESET_1 from "./data/macros/export_all.json";
import PRESET_2 from "./data/macros/randomize_height.json";
import PRESET_3 from "./data/macros/render_items.json";
import { defineComponent } from "vue";

export interface MacroData {
  name: string;
  icon: string;
  intents: IntentData[];
}

export abstract class Macros {
  static isRunning: boolean = false;
  static selected?: MacroData = undefined;
  static all: MacroData[] = [];
  private static result?: IntentResult = undefined;

  private static showContextMenu(macro, event): void {
    console.log(macro);
    // Select
    
    new Menu([
      {
        name: "Edit",
        icon: "edit",
        click: () => {
          Intent.editDialog.show();
        },
      },
      {
        name: "Export",
        icon: "insert_drive_file",
        click: () => {
          console.log("EXPORT");
        },
      },
      {
        name: "Delete",
        icon: "delete",
        click: () => {
          console.log("DELETE");
        },
      },
    ]).open(event);
  }

  static component = defineComponent({
    name: "Macro",
    props: {
      macro: { type: Object },
    },
    data() {
      return {};
    },
    methods: {
      showContextMenu: this.showContextMenu,
    },
    template: `
    <div>
      <div class="macro_options_button" @click="showContextMenu(this.macro, $event)" @contextmenu="showContextMenu(this.macro, $event)">
          <i class="material-icons">more_horiz</i>
      </div>
      <div class="macro_icon">
          <i class="material-icons">{{ macro.icon }}</i>
      </div>
      <div class="macro_name">{{ macro.name }}</div>
    </div>`,
  });

  static load(): void {
    const macros = JSON.stringify([PRESET_4, PRESET_1, PRESET_2, PRESET_3]);
    Macros.all = JSON.parse(localStorage.getItem("macros") ?? macros) as MacroData[];

    // TODO: Testing
    Macros.selected = Macros.all[0];
  }

  static save(): void {
    localStorage.setItem("macros", JSON.stringify(Macros.all));
  }

  private static format(template: string, params: Record<string, any>): string {
    return template.replace(/\$(\w+)/g, (_, key) => {
      const value = key in params ? String(params[key]) : "";
      return `<span class="param" data-key="${key}">${value}</span>`;
    });
  }

  /**
   * Whether or not the macro can run on this variant.
   * @param {MacroData} macro
   * @returns {boolean}
   */
  static canRun(macro: MacroData): boolean {
    for (const intent of macro.intents) {
      if (!Intent.canPerform(intent.type)) return false;
    }
    return true;
  }

  static renderSummary(intent: IntentData): string {
    const type = Intent.all.get(intent.type);
    if (!type) return `<p style="color: red;">Unknown intent <code>${intent.type}</code></p>`;
    const text = this.format(tl(type.options.summary(intent.params)) ?? tl(type.options.name ?? ""), intent.params);
    return `<p>${text}</p>`;
  }

  static async run(index: number): Promise<void> {
    if (this.isRunning) {
      Blockbench.showQuickMessage("message.macro_running");
      return;
    }
    const macro = this.all[index];
    if (!macro) return;
    if (!Macros.canRun(macro)) {
      Blockbench.showMessageBox({ title: macro.name ?? "Macro", message: "message.unsupported_variant" });
      return;
    }
    this.isRunning = true;
    Blockbench.showQuickMessage("message.run_macro");
    if (!macro.intents) return;
    const total = macro.intents.length;
    let c = 0;
    Blockbench.setProgress(0);
    try {
      for (const intent of macro.intents) {
        // Update progress
        c++;
        Blockbench.showStatusMessage(`Macro action (${c}/${total})`, 2 * 1000);
        Blockbench.setProgress(c / total);

        // Run intent.
        const intentType = Intent.all.get(intent.type);
        if (!intentType) continue;
        const r = await intentType.perform(this.resolveParams(intent.params), macro, Macros.result);
        if (typeof r === "string" && r === "__return") return;
        Macros.result = r;
        console.log(`Result: ${Macros.result}`);
      }
    } finally {
      this.isRunning = false;
      Blockbench.setProgress(0);
    }
  }

  static resolveParams(params: IntentParameters): IntentParameters {
    let result: IntentParameters = {};
    for (const [k, v] of Object.entries(params)) {
      result[k] = this.resolveValue(v);
    }
    return result;
  }

  static resolveValue(value?: IntentResult): IntentResult {
    if (value === "$result") return this.resolveValue(Macros.result);
    return value;
  }
}
