import { defineComponent } from "vue";
import { Intent, IntentData, IntentParameterTypes } from "./intent";
import { Macros } from "./macro";
import { inputVariable, isVariableValue, parseInputVariable, VARIABLE_VALUES } from "./variables";
import { BLOCK_END, BLOCK_MARKERS, blockDepths, matchingEnd } from "./flow";

type EditorField = { name: string; label: string; type: string; options?: string[] };
const VARIABLE_CHOICES = [
  { value: "select", label: "Select variable", icon: "ads_click" },
  { value: VARIABLE_VALUES.askEachTime, label: "Ask Each Time", icon: "help_outline" },
  { value: VARIABLE_VALUES.clipboard, label: "Clipboard", icon: "content_paste" },
  { value: VARIABLE_VALUES.currentDate, label: "Current Date", icon: "today" },
  { value: VARIABLE_VALUES.deviceDetails, label: "Device Details", icon: "devices" },
  { value: VARIABLE_VALUES.result, label: "Previous Result", icon: "input" },
  { value: VARIABLE_VALUES.item, label: "Current Item", icon: "inventory_2" },
  { value: VARIABLE_VALUES.index, label: "Current Index", icon: "tag" },
];

function label(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fields(intent: Intent): EditorField[] {
  const result: EditorField[] = (intent.options.parameters ?? []).map((parameter) => ({
    name: parameter.name,
    label: label(parameter.name),
    type: parameter.type,
    options: intent.enumValues.get(parameter.name),
  }));
  for (const [name, config] of Object.entries(intent.options.form ?? {})) {
    if (config === "_" || result.some((field) => field.name === name)) continue;
    const option = config as { label?: string; type?: string };
    result.push({ name, label: option.label ?? label(name), type: option.type ?? "text" });
  }
  return result;
}

export const MacroEditor = defineComponent({
  name: "MacroEditor",
  data() {
    return {
      macro: Macros.draft,
      search: "",
      category: "",
      dragging: -1,
      libraryDragging: null as string | null,
      dropIndex: null as number | null,
      insertAt: null as number | null,
      iconsOpen: false,
      suggestions: null as { uuid: string; field: string; above: boolean } | null,
      selecting: null as { uuid: string; field: string } | null,
      variableChoices: VARIABLE_CHOICES,
    };
  },
  computed: {
    categories(): [string, string][] {
      return [["", "All Actions"], ...Intent.categories.entries()];
    },
    actions(): Intent[] {
      const query = this.search.trim().toLowerCase();
      return [...Intent.all.values()].filter((intent) =>
        Intent.canPerform(intent.id) &&
        !BLOCK_MARKERS.has(intent.id) &&
        (!this.category || intent.options.category === this.category) &&
        (!query || `${intent.getName()} ${intent.options.description ?? ""}`.toLowerCase().includes(query))
      );
    },
    depths(): number[] {
      return blockDepths(this.macro.intents);
    },
  },
  methods: {
    resetState(): void {
      this.suggestions = null;
      this.selecting = null;
      this.insertAt = null;
      this.dragging = -1;
      this.libraryDragging = null;
      this.dropIndex = null;
    },
    action(intentData: IntentData): Intent | undefined {
      return Intent.all.get(intentData.type);
    },
    actionIcon(intentData: IntentData): string {
      return Intent.all.get(intentData.type)?.options.icon ?? "extension";
    },
    actionName(intentData: IntentData): string {
      return Intent.all.get(intentData.type)?.getName() ?? intentData.type;
    },
    fields(intent: Intent): EditorField[] {
      return fields(intent);
    },
    fieldsForStep(step: IntentData, index: number): EditorField[] {
      const intent = this.action(step);
      if (!intent || BLOCK_MARKERS.has(step.type)) return [];
      const all = fields(intent);
      return BLOCK_END[step.type] && matchingEnd(this.macro.intents, index) > index
        ? all.filter((field) => field.name !== "actions" && field.name !== "otherwise") : all;
    },
    isMarker(step: IntentData): boolean {
      return BLOCK_MARKERS.has(step.type);
    },
    isVariable(value: unknown): boolean {
      return isVariableValue(value);
    },
    variableLabel(value: unknown): string {
      const choice = VARIABLE_CHOICES.find((item) => item.value === value);
      if (choice) return choice.label;
      const reference = parseInputVariable(value);
      if (!reference) return "Variable";
      const source = this.macro.intents.find((step) => step.uuid === reference.uuid);
      return source ? `${this.actionName(source)} · ${label(reference.field)}` : "Missing Input";
    },
    variableIcon(value: unknown): string {
      if (parseInputVariable(value)) return "link";
      return VARIABLE_CHOICES.find((item) => item.value === value)?.icon ?? "input";
    },
    showSuggestions(step: IntentData, field: string, event?: Event): void {
      if (this.selecting) return;
      const row = (event?.currentTarget as HTMLElement | undefined)?.closest(".macro_editor_field");
      const panel = (this.$el as HTMLElement).querySelector(".macro_editor_workflow");
      const below = row && panel ? panel.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom : Infinity;
      const above = row && panel ? row.getBoundingClientRect().top - panel.getBoundingClientRect().top : 0;
      this.suggestions = { uuid: step.uuid, field, above: below < 230 && above > below };
    },
    hideSuggestions(step: IntentData, field: string): void {
      window.setTimeout(() => {
        if (this.suggestions?.uuid === step.uuid && this.suggestions.field === field) this.suggestions = null;
      }, 120);
    },
    chooseVariable(step: IntentData, field: string, value: string): void {
      this.suggestions = null;
      if (value === "select") {
        this.selecting = { uuid: step.uuid, field };
      } else {
        this.setParam(step, field, value);
      }
    },
    canSelectInput(index: number): boolean {
      if (!this.selecting) return false;
      const targetIndex = this.macro.intents.findIndex((step) => step.uuid === this.selecting?.uuid);
      return targetIndex > index;
    },
    selectInput(step: IntentData, field: string, index: number, event: MouseEvent): void {
      if (!this.selecting || !this.canSelectInput(index)) return;
      event.preventDefault();
      event.stopPropagation();
      const target = this.macro.intents.find((intent) => intent.uuid === this.selecting?.uuid);
      if (target) this.setParam(target, this.selecting.field, inputVariable(step.uuid, field));
      this.selecting = null;
    },
    setParam(step: IntentData, name: string, value: string | number): void {
      this.$set(step.params, name, value);
    },
    updateParam(step: IntentData, field: EditorField, event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.setParam(step, field.name, field.type === "number" && value !== "" ? Number(value) : value);
    },
    add(intent: Intent, index = this.insertAt ?? this.macro.intents.length): void {
      const params: IntentData["params"] = {};
      for (const field of fields(intent)) {
        const formOption = intent.options.form?.[field.name];
        const defaultValue = formOption && formOption !== "_" ? formOption.value : undefined;
        params[field.name] = typeof defaultValue === "boolean" || typeof defaultValue === "number" || typeof defaultValue === "string"
          ? defaultValue : field.options?.length ? field.options[0]
          : field.type === IntentParameterTypes.Boolean || field.type === "checkbox" ? false
          : field.type === IntentParameterTypes.Number || field.type === "number" ? 0 : "";
      }
      const steps: IntentData[] = [{ type: intent.id, uuid: guid(), params }];
      if (intent.id === "if") steps.push(
        { type: "otherwise", uuid: guid(), params: {} },
        { type: "end_if", uuid: guid(), params: {} },
      );
      else if (intent.id === "try") steps.push(
        { type: "on_error", uuid: guid(), params: {} },
        { type: "end_try", uuid: guid(), params: {} },
      );
      else if (BLOCK_END[intent.id]) steps.push({ type: BLOCK_END[intent.id], uuid: guid(), params: {} });
      this.macro.intents.splice(index, 0, ...steps);
      if (this.insertAt !== null) this.insertAt = index + steps.length;
    },
    remove(index: number): void {
      const step = this.macro.intents[index];
      if (BLOCK_MARKERS.has(step.type)) return;
      const end = matchingEnd(this.macro.intents, index);
      const removed = this.macro.intents.splice(index, end - index + 1);
      const removedIds = new Set(removed.map((item) => item.uuid));
      for (const step of this.macro.intents) {
        for (const [field, value] of Object.entries(step.params)) {
          if (removedIds.has(parseInputVariable(value)?.uuid ?? "")) this.setParam(step, field, "");
        }
      }
      this.insertAt = null;
    },
    move(from: number, insertionIndex: number): void {
      if (from < 0 || insertionIndex < 0 || insertionIndex > this.macro.intents.length || BLOCK_MARKERS.has(this.macro.intents[from]?.type)) return;
      const end = matchingEnd(this.macro.intents, from);
      if (insertionIndex >= from && insertionIndex <= end + 1) return;
      const segment = this.macro.intents.splice(from, end - from + 1);
      this.macro.intents.splice(insertionIndex > from ? insertionIndex - segment.length : insertionIndex, 0, ...segment);
      this.insertAt = null;
    },
    startDrag(index: number, event: DragEvent): void {
      if (BLOCK_MARKERS.has(this.macro.intents[index].type)) { event.preventDefault(); return; }
      this.dragging = index;
      this.libraryDragging = null;
      this.dropIndex = null;
      event.dataTransfer?.setData("text/plain", String(index));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    },
    startLibraryDrag(intent: Intent, event: DragEvent): void {
      this.libraryDragging = intent.id;
      this.dragging = -1;
      this.dropIndex = null;
      event.dataTransfer?.setData("text/plain", intent.id);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
    },
    dragOver(index: number, event: DragEvent): void {
      if (this.dragging < 0 && !this.libraryDragging) return;
      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const insertionIndex = index + (event.clientY >= bounds.top + bounds.height / 2 ? 1 : 0);
      const end = this.dragging >= 0 ? matchingEnd(this.macro.intents, this.dragging) : -1;
      this.dropIndex = !this.libraryDragging && insertionIndex >= this.dragging && insertionIndex <= end + 1 ? null : insertionIndex;
      if (event.dataTransfer) event.dataTransfer.dropEffect = this.libraryDragging ? "copy" : "move";
    },
    dragOverEnd(event: DragEvent): void {
      if (this.dragging < 0 && !this.libraryDragging) return;
      this.dropIndex = !this.libraryDragging && matchingEnd(this.macro.intents, this.dragging) === this.macro.intents.length - 1 ? null : this.macro.intents.length;
      if (event.dataTransfer) event.dataTransfer.dropEffect = this.libraryDragging ? "copy" : "move";
    },
    leaveWorkflow(event: DragEvent): void {
      const next = event.relatedTarget as Node | null;
      if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.dropIndex = null;
    },
    endDrag(): void {
      this.dragging = -1;
      this.libraryDragging = null;
      this.dropIndex = null;
    },
    drop(): void {
      const from = this.dragging;
      const insertionIndex = this.dropIndex;
      if (insertionIndex !== null && this.libraryDragging) {
        const intent = Intent.all.get(this.libraryDragging);
        if (intent) this.add(intent, insertionIndex);
      } else if (from >= 0 && insertionIndex !== null) {
        this.move(from, insertionIndex);
      }
      this.endDrag();
    },
    setIcon(icon: string): void {
      this.macro.icon = icon;
      this.iconsOpen = false;
    },
  },
  template: `<div id="macro_editor">
    <div class="macro_editor_header">
      <div class="macro_editor_identity">
        <button type="button" class="macro_editor_icon" title="Choose icon" @click="iconsOpen = !iconsOpen"><i class="material-icons">{{ macro.icon }}</i></button>
        <input class="dark_bordered macro_editor_name" type="text" aria-label="Macro name" v-model="macro.name" placeholder="Untitled Macro">
      </div>
      <div v-if="iconsOpen" class="macro_editor_icon_choices">
        <button v-for="icon in ['play_arrow', 'bolt', 'build', 'auto_awesome', 'code', 'brush', 'image', 'folder', 'save', 'file_download', 'settings', 'star']" :key="icon" type="button" :title="icon" @click="setIcon(icon)"><i class="material-icons">{{ icon }}</i></button>
        <input class="dark_bordered" type="text" aria-label="Material icon name" v-model="macro.icon" placeholder="Material icon name">
      </div>
    </div>
    <div class="macro_editor_body">
      <aside class="macro_editor_library">
        <div class="macro_editor_library_title">Action Library</div>
        <input class="dark_bordered" type="search" v-model="search" placeholder="Search actions" aria-label="Search actions">
        <select class="dark_bordered" v-model="category" aria-label="Action category">
          <option v-for="[id, name] in categories" :key="id" :value="id">{{ name }}</option>
        </select>
        <div class="macro_editor_actions">
          <button v-for="intent in actions" :key="intent.id" type="button" class="macro_editor_action" draggable="true" @dragstart="startLibraryDrag(intent, $event)" @dragend="endDrag" @click="add(intent)" :title="intent.options.description">
            <i class="material-icons">{{ intent.options.icon || 'extension' }}</i>
            <span>{{ intent.getName() }}</span>
            <i class="material-icons macro_editor_add">add</i>
          </button>
          <div v-if="!actions.length" class="macro_editor_hint">No matching actions</div>
        </div>
        <div v-if="insertAt !== null" class="macro_editor_insert_hint">Choose an action to insert at step {{ insertAt + 1 }} <button type="button" @click="insertAt = null">Done</button></div>
      </aside>
      <main class="macro_editor_workflow" @dragover.prevent="dragOverEnd($event)" @drop.prevent="drop" @dragleave="leaveWorkflow($event)">
        <div class="macro_editor_workflow_title">Workflow <span>{{ macro.intents.length }} actions</span></div>
        <div v-if="selecting" class="macro_editor_selection_prompt">
          <i class="material-icons">ads_click</i>
          <span>Choose an input from an earlier action</span>
          <button type="button" @click="selecting = null">Cancel</button>
        </div>
        <div v-if="!macro.intents.length" class="macro_editor_empty" :class="{macro_editor_empty_drop: dropIndex === 0}">Choose an action from the library to start your workflow.</div>
        <div v-for="(step, index) in macro.intents" :key="step.uuid + '-' + index" class="macro_editor_step" :class="{macro_editor_dragging: dragging === index, macro_editor_drop_before: dropIndex === index, macro_editor_drop_after: dropIndex === macro.intents.length && index === macro.intents.length - 1, macro_editor_has_suggestions: suggestions && suggestions.uuid === step.uuid, macro_editor_nested: depths[index] > 0, macro_editor_marker: isMarker(step), macro_editor_inserting: insertAt === index + 1}" :style="{marginLeft: (depths[index] * 24) + 'px'}" :draggable="!isMarker(step)" @dragstart="startDrag(index, $event)" @dragend="endDrag" @dragover.stop.prevent="dragOver(index, $event)" @drop.stop.prevent="drop">
          <div class="macro_editor_step_header">
            <span v-if="!isMarker(step)" class="macro_editor_handle" title="Drag to reorder"><i class="material-icons">drag_indicator</i></span>
            <i class="material-icons macro_editor_step_icon">{{ actionIcon(step) }}</i>
            <strong>{{ actionName(step) }}</strong>
            <button v-if="!isMarker(step) || step.type === 'otherwise' || step.type === 'on_error'" class="macro_editor_insert_below" type="button" title="Insert action below" aria-label="Insert action below" @click="insertAt = index + 1"><i class="material-icons">add</i></button>
            <button v-if="!isMarker(step)" class="macro_editor_remove" type="button" title="Remove action" aria-label="Remove action" @click="remove(index)"><i class="material-icons">close</i></button>
          </div>
          <div v-if="action(step) && fieldsForStep(step, index).length" class="macro_editor_fields">
            <div v-for="field in fieldsForStep(step, index)" :key="field.name" class="macro_editor_field" :class="{macro_editor_candidate: canSelectInput(index)}" @click.capture="selectInput(step, field.name, index, $event)">
              <span>{{ field.label }}</span>
              <div v-if="isVariable(step.params[field.name])" class="macro_editor_variable" :title="variableLabel(step.params[field.name])" @click="showSuggestions(step, field.name, $event)">
                <i class="material-icons">{{ variableIcon(step.params[field.name]) }}</i><span>{{ variableLabel(step.params[field.name]) }}</span>
                <button type="button" title="Remove variable" aria-label="Remove variable" @click.stop="setParam(step, field.name, '')"><i class="material-icons">close</i></button>
              </div>
              <div v-else class="macro_editor_value">
                <input v-if="field.type === 'boolean' || field.type === 'checkbox'" type="checkbox" v-model="step.params[field.name]" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)">
                <select v-else-if="field.options && field.options.length" class="dark_bordered" v-model="step.params[field.name]" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)"><option v-for="option in field.options" :key="option" :value="option">{{ option }}</option></select>
                <input v-else class="dark_bordered" :type="field.type === 'number' ? 'number' : 'text'" :value="step.params[field.name]" :placeholder="field.name" @input="updateParam(step, field, $event)" @focus="showSuggestions(step, field.name, $event)" @blur="hideSuggestions(step, field.name)">
                <button type="button" class="macro_editor_insert_variable" title="Choose variable" aria-label="Choose variable" @mousedown.prevent @click="showSuggestions(step, field.name, $event)"><i class="material-icons">input</i></button>
              </div>
              <div v-if="suggestions && suggestions.uuid === step.uuid && suggestions.field === field.name" class="macro_editor_suggestions" :class="{macro_editor_suggestions_above: suggestions.above}">
                <button v-for="choice in variableChoices" :key="choice.value" type="button" @mousedown.prevent @click="chooseVariable(step, field.name, choice.value)">
                  <i class="material-icons">{{ choice.icon }}</i><span>{{ choice.label }}</span>
                </button>
              </div>
            </div>
          </div>
          <div v-else-if="!action(step)" class="macro_editor_hint">This action is unavailable.</div>
        </div>
      </main>
    </div>
  </div>`,
});
