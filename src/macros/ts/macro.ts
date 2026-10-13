import { Intent, IntentData, IntentParameters, IntentResult } from "./intent";

import PRESET_4 from "./data/macros/test.json";
import PRESET_1 from "./data/macros/export_all.json";
import PRESET_2 from "./data/macros/randomize_height.json";
import PRESET_3 from "./data/macros/render_projects.json";
import { defineComponent, reactive } from "vue";
import { inputVariable, parseInputVariable, VARIABLE_VALUES } from "./variables";
import { FlowNode, expandLegacyBlocks, parseFlow } from "./flow";

export interface MacroData {
  name: string;
  icon: string;
  intents: IntentData[];
}

export abstract class Macros {
  static isRunning: boolean = false;
  static runId = 0;
  static watchdogSeconds = 60;
  static selected?: MacroData = undefined;
  static all: MacroData[] = [];
  static draft = reactive<MacroData>({ name: "", icon: "play_arrow", intents: [] });
  private static result?: IntentResult = undefined;
  static lastOutput?: IntentResult = undefined;
  private static executionStack: MacroData[] = [];

  private static showContextMenu(macro: MacroData, event: MouseEvent): void {
    const selected = macro;
    Macros.selected = selected;

    new Menu([
      ...(Macros.canRun(selected)
        ? [
            {
              name: "Run",
              icon: "play_arrow",
              click: () => {
                Blockbench.showMessageBox(
                  {
                    title: "Run Macro",
                    message: `Run "${selected.name}"?`,
                    buttons: ["macro.run", "dialog.cancel"],
                    confirm: 0,
                    cancel: 1,
                  },
                  (button) => {
                    if (button !== 0) return;
                    const index = Macros.all.indexOf(selected);
                    if (index !== -1) Macros.run(index);
                  },
                );
              },
            },
          ]
        : []),
      {
        name: "Edit",
        icon: "edit",
        click: () => {
          Macros.openEditor(selected);
        },
      },
      {
        name: "Duplicate",
        icon: "content_copy",
        click: () => {
          const copy: MacroData = JSON.parse(JSON.stringify(selected));
          const base = `${selected.name} Copy`;
          let name = base;
          for (let suffix = 2; Macros.all.some((macro) => macro.name === name); suffix++) name = `${base} ${suffix}`;
          copy.name = name;
          const ids = new Map(copy.intents.map((step) => [step.uuid, guid()]));
          for (const step of copy.intents) {
            step.uuid = ids.get(step.uuid)!;
            for (const [field, value] of Object.entries(step.params)) {
              const reference = parseInputVariable(value);
              if (reference && ids.has(reference.uuid))
                step.params[field] = inputVariable(ids.get(reference.uuid)!, reference.field);
            }
          }
          const index = Macros.all.indexOf(selected);
          Macros.all.splice(index < 0 ? Macros.all.length : index + 1, 0, copy);
          Macros.save();
        },
      },
      {
        name: "Export",
        icon: "insert_drive_file",
        click: () => {
          const name = selected.name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "macro";
          Blockbench.export({
            type: "Macro",
            extensions: ["json"],
            name,
            content: JSON.stringify(selected, null, 2),
            savetype: "text",
          });
        },
      },
      {
        name: "Delete",
        icon: "delete",
        click: () => {
          Blockbench.showMessageBox(
            {
              title: "Delete Macro",
              message: `Delete "${selected.name}"?`,
              buttons: ["dialog.delete", "dialog.cancel"],
              confirm: 0,
              cancel: 1,
            },
            (button) => {
              if (button !== 0) return;
              const index = Macros.all.indexOf(selected);
              if (index === -1) return;
              Macros.all.splice(index, 1);
              if (Macros.selected === selected) Macros.selected = undefined;
              Macros.save();
            },
          );
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
      unavailableReason: this.unavailableReason,
    },
    template: `
    <div>
      <div class="macro_options_button" :title="unavailableReason(macro)" @click="showContextMenu(macro, $event)" @contextmenu.prevent="showContextMenu(macro, $event)">
          <i class="material-icons">{{ unavailableReason(macro) ? 'warning' : 'more_horiz' }}</i>
      </div>
      <div class="macro_icon">
          <i class="material-icons">{{ macro.icon }}</i>
      </div>
      <div class="macro_name">{{ macro.name }}</div>
    </div>`,
  });

  static load(): void {
    const macros = JSON.stringify([PRESET_4, PRESET_1, PRESET_2, PRESET_3]);
    Macros.all = reactive({ items: JSON.parse(localStorage.getItem("macros") ?? macros) as MacroData[] }).items;

    const upgrades = [
      [PRESET_1, "cb528404-54af-4fad-88f3-860905b464fa"],
      [PRESET_2, "ba0463f8-12ed-4ddd-82ef-0674137ad595"],
      [PRESET_3, "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd"],
    ] as const;
    let changed = false;
    for (const macro of Macros.all) {
      const upgrade = upgrades.find(
        ([preset]) => preset.name === macro.name || (preset === PRESET_3 && macro.name === "Render Items"),
      );
      if (!upgrade) continue;
      const [preset, uuid] = upgrade;
      const oldRenderIntents = [
        ["get_project_items", "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd", { items: "selected_elements" }],
        ["set_variable", "f5f9795d-267f-4507-b13e-1d7c1d25354e", { name: "render_items", input: "$result" }],
        ["choose_output_folder", "6d40a245-3907-42b0-aa0b-96453af24669", {}],
        ["set_variable", "94e3dd0b-f36d-4538-839c-e55a28f09439", { name: "render_folder", input: "$result" }],
        [
          "repeat_each",
          "95ab83b2-7c9d-488c-8ea4-eb83dbe6da22",
          { items: "$input:f5f9795d-267f-4507-b13e-1d7c1d25354e:input" },
        ],
        ["set_element_visibility", "9d575951-b103-4d97-b82e-62316214aba6", { element: "$item", mode: "isolate" }],
        ["take_screenshot", "4ccf70e3-aae2-4d5e-a6f7-c2e190535d96", { source: "clean" }],
        [
          "save_image",
          "6e395c6a-3fd2-49c3-a277-9ae7e3bb3ff5",
          { image: "$result", name: "$item", folder: "$input:94e3dd0b-f36d-4538-839c-e55a28f09439:input" },
        ],
        ["end_repeat_each", "9d4d4971-28b7-420c-9f03-3c823cfaeea9", {}],
        ["set_element_visibility", "963d7cf9-aeec-47c4-a813-d65db81881ce", { mode: "restore" }],
      ] as const;
      if (
        macro.name === "Render Items" &&
        macro.intents.length === oldRenderIntents.length &&
        macro.intents.every((step, index) => {
          const [type, id, params] = oldRenderIntents[index];
          return (
            step.type === type &&
            step.uuid === id &&
            Object.keys(step.params).length === Object.keys(params).length &&
            Object.entries(params).every(([key, value]) => step.params[key] === value)
          );
        })
      ) {
        macro.name = preset.name;
        macro.intents.splice(0, macro.intents.length, ...JSON.parse(JSON.stringify(preset.intents)));
        changed = true;
        continue;
      }
      const oldRenderSteps = [
        ["get_project_items", "6c4f4bef-d87d-49fd-ba85-bc2a0aa68bcd"],
        ["repeat_each", "95ab83b2-7c9d-488c-8ea4-eb83dbe6da22"],
        ["set_element_visibility", "9d575951-b103-4d97-b82e-62316214aba6"],
        ["take_screenshot", "4ccf70e3-aae2-4d5e-a6f7-c2e190535d96"],
        ["save_image", "6e395c6a-3fd2-49c3-a277-9ae7e3bb3ff5"],
        ["end_repeat_each", "9d4d4971-28b7-420c-9f03-3c823cfaeea9"],
        ["set_element_visibility", "963d7cf9-aeec-47c4-a813-d65db81881ce"],
      ];
      if (
        macro.name === "Render Items" &&
        macro.intents.length === oldRenderSteps.length &&
        macro.intents.every(
          (step, index) => step.type === oldRenderSteps[index][0] && step.uuid === oldRenderSteps[index][1],
        ) &&
        macro.intents[0].params.items === "selected_elements" &&
        macro.intents[1].params.items === "$result" &&
        macro.intents[2].params.element === "$item" &&
        macro.intents[2].params.mode === "isolate" &&
        macro.intents[3].params.source === "clean" &&
        macro.intents[4].params.image === "$result" &&
        macro.intents[4].params.name === "$item" &&
        macro.intents[4].params.folder === "" &&
        macro.intents[6].params.mode === "restore"
      ) {
        macro.intents.splice(0, macro.intents.length, ...JSON.parse(JSON.stringify(preset.intents)));
        macro.name = preset.name;
        changed = true;
        continue;
      }
      const oldTypes: Record<string, string> = {
        "Export All": "export_all_projects",
        "Randomize Height": "randomize_cube_height",
        "Render Items": "render_selected_items",
      };
      if (
        macro.intents.length === 1 &&
        macro.intents[0].uuid === uuid &&
        macro.intents[0].type === oldTypes[macro.name]
      ) {
        macro.intents.splice(0, 1, ...JSON.parse(JSON.stringify(preset.intents)));
        macro.name = preset.name;
        changed = true;
        continue;
      }
      const step = macro.intents.find(
        (intent) =>
          intent.uuid === uuid && intent.type === "show_content" && intent.params?.text === "Not implemented!",
      );
      if (!step) continue;
      macro.intents.splice(macro.intents.indexOf(step), 1, ...JSON.parse(JSON.stringify(preset.intents)));
      macro.name = preset.name;
      changed = true;
    }
    if (changed) Macros.save();

    Macros.selected = Macros.all[0];
  }

  static save(): void {
    localStorage.setItem("macros", JSON.stringify(Macros.all));
  }

  static importMacro(): void {
    Blockbench.import({ type: "Macro", extensions: ["json"], readtype: "text", multiple: false }, (files) => {
      if (!files?.length) return;
      try {
        const data: unknown = JSON.parse(String(files[0].content));
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid macro file");
        const macro = data as Partial<MacroData>;
        if (
          typeof macro.name !== "string" ||
          !macro.name.trim() ||
          typeof macro.icon !== "string" ||
          !Array.isArray(macro.intents) ||
          macro.intents.some(
            (step) =>
              !step ||
              typeof step.type !== "string" ||
              typeof step.uuid !== "string" ||
              !step.params ||
              typeof step.params !== "object" ||
              Array.isArray(step.params),
          )
        ) {
          throw new Error("Invalid macro file");
        }
        const imported: MacroData = { name: macro.name, icon: macro.icon, intents: macro.intents };
        Macros.all.push(imported);
        Macros.save();
      } catch (error) {
        Blockbench.showMessageBox({
          title: "Import Macro",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  static openEditor(macro?: MacroData): void {
    Macros.selected = macro;
    Macros.draft.name = macro?.name ?? `Macro ${Macros.all.length + 1}`;
    Macros.draft.icon = macro?.icon ?? "play_arrow";
    Macros.draft.intents.splice(0, Macros.draft.intents.length, ...JSON.parse(JSON.stringify(macro?.intents ?? [])));
    Macros.draft.intents.splice(0, Macros.draft.intents.length, ...expandLegacyBlocks(Macros.draft.intents, guid));
    const ids = new Set<string>();
    for (const intent of Macros.draft.intents) {
      if (!intent.uuid || ids.has(intent.uuid)) intent.uuid = guid();
      ids.add(intent.uuid);
    }
    Intent.editDialog.show();
  }

  static saveDraft(): number {
    const macro: MacroData = JSON.parse(JSON.stringify(Macros.draft));
    macro.name = macro.name.trim() || "Untitled Macro";
    const index = Macros.selected ? Macros.all.indexOf(Macros.selected) : -1;
    if (index === -1) {
      Macros.all.push(macro);
    } else {
      Macros.all.splice(index, 1, macro);
    }
    Macros.selected = Macros.all[index === -1 ? Macros.all.length - 1 : index];
    Macros.save();
    return Macros.all.indexOf(Macros.selected);
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

  static unavailableReason(macro: MacroData): string {
    const unsupported = macro.intents.filter((step) => !Intent.canPerform(step.type));
    if (!unsupported.length) return "";
    const names = [...new Set(unsupported.map((step) => Intent.all.get(step.type)?.getName() ?? step.type))];
    const platform = Blockbench.isWeb ? "web" : "desktop";
    return `Can't run on ${platform}: ${names.join(", ")}`;
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
    if (!macro.intents) return;
    this.isRunning = true;
    const runId = ++this.runId;
    this.result = undefined;
    this.lastOutput = undefined;
    Blockbench.showQuickMessage("message.run_macro");
    Blockbench.setProgress(0);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const seconds = Number(this.watchdogSeconds);
    const timeout =
      Number.isFinite(seconds) && seconds > 0
        ? new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
              this.runId++;
              this.executionStack = [];
              reject(new Error(`Macro exceeded the ${seconds} second watchdog limit and was stopped.`));
            }, seconds * 1000);
          })
        : undefined;
    try {
      this.result = await (timeout
        ? Promise.race([this.executeMacro(macro, undefined), timeout])
        : this.executeMacro(macro, undefined));
    } catch (error) {
      console.error("Macro failed", error);
      Blockbench.showMessageBox({
        title: macro.name || "Macro",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      this.isRunning = false;
      Blockbench.setProgress(0);
    }
  }

  static async executeMacro(macro: MacroData, input: IntentResult): Promise<IntentResult> {
    const runId = this.runId;
    const stack = this.executionStack;
    const checkStopped = () => {
      if (runId !== this.runId) throw new Error("Macro stopped");
    };
    if (stack.includes(macro)) throw new Error(`Macro recursion detected: ${macro.name}`);
    if (stack.length >= 8) throw new Error("Macro calls are nested too deeply");
    if (!this.canRun(macro)) throw new Error(`Macro has unavailable actions: ${macro.name}`);
    stack.push(macro);
    const total = macro.intents.length;
    let c = 0;
    const previousInputs = new Map<string, IntentParameters>();
    let currentResult = input;
    try {
      const resolveStep = async (
        step: IntentData,
        item?: IntentResult,
        iteration?: number,
      ): Promise<IntentParameters | null> => {
        const raw = Object.fromEntries(
          Object.entries(step.params ?? {}).map(([key, value]) => [
            key,
            value === "$item" ? item : value === "$index" ? iteration : value,
          ]),
        );
        const params = await this.resolveParams(raw, previousInputs, macro, currentResult);
        if (params) previousInputs.set(step.uuid, params);
        return params;
      };
      const execute = async (
        nodes: FlowNode[],
        depth = 0,
        item?: IntentResult,
        iteration?: number,
      ): Promise<boolean> => {
        if (depth > 8) throw new Error("Control flow is nested too deeply");
        for (const node of nodes) {
          checkStopped();
          const step = node.step;
          c++;
          if (stack.length === 1) {
            Blockbench.showStatusMessage(`Macro action (${c}/${total})`, 2 * 1000);
            Blockbench.setProgress(Math.min(1, c / total));
          }
          const params = await resolveStep(step, item, iteration);
          checkStopped();
          if (params === null) return true;
          if (node.kind === "if") {
            const condition = params.condition !== false && params.condition !== "false" && Boolean(params.condition);
            if (await execute(condition ? node.yes : node.no, depth + 1, item, iteration)) return true;
          } else if (node.kind === "try") {
            try {
              if (await execute(node.body, depth + 1, item, iteration)) return true;
            } catch (error) {
              checkStopped();
              const details =
                error && typeof error === "object" ? (error as { name?: unknown; message?: unknown }) : undefined;
              currentResult = {
                name: typeof details?.name === "string" ? details.name : "Error",
                message: typeof details?.message === "string" ? details.message : String(error),
              };
              if (await execute(node.onError, depth + 1, item, iteration)) return true;
            }
          } else if (node.kind === "repeat") {
            const count = Number(params.count);
            if (!Number.isInteger(count) || count < 0 || count > 1000)
              throw new Error("Repeat count must be between 0 and 1000");
            for (let index = 0; index < count; index++) {
              if (await execute(node.children, depth + 1, item, index)) return true;
            }
          } else if (node.kind === "repeat_each") {
            const itemsInput = params.items === "" || params.items === undefined ? currentResult : params.items;
            const items = Array.isArray(itemsInput)
              ? itemsInput
              : String(itemsInput ?? "")
                  .split(/\r?\n/)
                  .filter(Boolean);
            if (items.length > 1000) throw new Error("Repeat Each supports at most 1000 items");
            const outputs: IntentResult[] = [];
            for (let index = 0; index < items.length; index++) {
              currentResult = items[index];
              if (await execute(node.children, depth + 1, items[index], index)) return true;
              outputs.push(currentResult);
            }
            currentResult = outputs;
          } else {
            const intentType = Intent.all.get(step.type);
            if (!intentType) continue;
            this.result = currentResult;
            const result = await intentType.perform(params, macro, currentResult);
            checkStopped();
            if (result === "__return") return true;
            if (result && typeof result === "object" && !Array.isArray(result) && "__macro_stop" in result) {
              if (stack.length === 1) this.lastOutput = result.value;
              currentResult = result.value;
              return true;
            }
            currentResult = result;
          }
        }
        return false;
      };
      await execute(parseFlow(macro.intents));
      checkStopped();
      return currentResult;
    } finally {
      stack.pop();
    }
  }

  static async resolveParams(
    params: IntentParameters,
    previousInputs: Map<string, IntentParameters>,
    macro: MacroData,
    currentResult?: IntentResult,
  ): Promise<IntentParameters | null> {
    const result: IntentParameters = {};
    for (const [k, v] of Object.entries(params)) {
      result[k] = await this.resolveValue(v, previousInputs, macro, k, currentResult);
      if (v === VARIABLE_VALUES.askEachTime && result[k] === undefined) return null;
    }
    return result;
  }

  static async resolveValue(
    value: IntentResult,
    previousInputs: Map<string, IntentParameters>,
    macro: MacroData,
    field: string,
    currentResult?: IntentResult,
  ): Promise<IntentResult> {
    if (value === VARIABLE_VALUES.result) return currentResult;
    if (value === VARIABLE_VALUES.askEachTime) {
      return new Promise((resolve) => {
        new Dialog({
          title: macro.name,
          form: { value: { type: "text", label: field.replace(/_/g, " ") } },
          buttons: ["dialog.ok", "dialog.cancel"],
          onConfirm(result) {
            resolve(result.value);
          },
          onCancel() {
            resolve(undefined);
          },
        }).show();
      });
    }
    if (value === VARIABLE_VALUES.clipboard) {
      try {
        return await navigator.clipboard.readText();
      } catch {
        Blockbench.showQuickMessage("Unable to read clipboard");
        return "";
      }
    }
    if (value === VARIABLE_VALUES.currentDate) return new Date();
    if (value === VARIABLE_VALUES.deviceDetails) {
      return JSON.stringify({
        platform: navigator.platform,
        language: navigator.language,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        variant: Blockbench.isWeb ? "web" : "desktop",
      });
    }
    const input = parseInputVariable(value);
    if (input) return previousInputs.get(input.uuid)?.[input.field];
    return value;
  }
}
