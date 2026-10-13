/// <reference types="blockbench-types" />

import { Intent, IntentData, IntentParameterTypes, IntentResult } from "../intent";
import { Macros, MacroData } from "../macro";

const str = (value: IntentResult) => (value == null ? "" : String(value));
const param = (name: string, type: IntentParameterTypes = IntentParameterTypes.Text) => ({ name, type });
const valueOf = (input: IntentResult, result: IntentResult) => (input === "" || input === undefined ? result : input);
const record = (value: IntentResult): Record<string, IntentResult> | undefined =>
  value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof URL)
    ? (value as Record<string, IntentResult>)
    : undefined;
let nestedDepth = 0;

function finite(value: IntentResult, label = "Number"): number {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${label} must be finite`);
  return number;
}

function expression(source: string): number {
  const tokens = source.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+*/^%-]/gi) ?? [];
  if (tokens.join("").toLowerCase() !== source.replace(/\s+/g, "").toLowerCase()) throw new Error("Invalid expression");
  let position = 0;
  const atom = (): number => {
    const token = tokens[position++];
    if (token === "+") return atom();
    if (token === "-") return -atom();
    if (token === "(") {
      const value = add();
      if (tokens[position++] !== ")") throw new Error("Missing closing parenthesis");
      return value;
    }
    if (!token || !/^\d/.test(token)) throw new Error("Expected a number");
    return finite(token);
  };
  const power = (): number => {
    const left = atom();
    return tokens[position] === "^" ? (position++, left ** power()) : left;
  };
  const multiply = (): number => {
    let result = power();
    while (["*", "/", "%"].includes(tokens[position])) {
      const operator = tokens[position++],
        right = power();
      result = operator === "*" ? result * right : operator === "/" ? result / right : result % right;
    }
    return result;
  };
  const add = (): number => {
    let result = multiply();
    while (["+", "-"].includes(tokens[position])) result += (tokens[position++] === "+" ? 1 : -1) * multiply();
    return result;
  };
  const result = add();
  if (position !== tokens.length) throw new Error("Unexpected expression token");
  return finite(result, "Expression result");
}

const units: Record<string, [string, number]> = {
  mm: ["length", 0.001],
  cm: ["length", 0.01],
  m: ["length", 1],
  km: ["length", 1000],
  in: ["length", 0.0254],
  ft: ["length", 0.3048],
  yd: ["length", 0.9144],
  mi: ["length", 1609.344],
  mg: ["mass", 0.001],
  g: ["mass", 1],
  kg: ["mass", 1000],
  oz: ["mass", 28.349523125],
  lb: ["mass", 453.59237],
  ms: ["time", 0.001],
  s: ["time", 1],
  min: ["time", 60],
  h: ["time", 3600],
  day: ["time", 86400],
};

function asDate(input: IntentResult): Date {
  const date = input instanceof Date ? new Date(input) : new Date(str(input));
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  return date;
}

async function service(endpoint: IntentResult, payload: object): Promise<Response> {
  const url = str(endpoint);
  if (!url) throw new Error("Configure a service endpoint for this action");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Service request failed: ${response.status}`);
  return response;
}

function parseActions(value: IntentResult): IntentData[] {
  const actions = typeof value === "string" ? JSON.parse(value || "[]") : value;
  if (
    !Array.isArray(actions) ||
    actions.length > 1000 ||
    actions.some((action) => !action || typeof action.type !== "string")
  ) {
    throw new Error("Actions must be a JSON array of macro steps");
  }
  return actions as IntentData[];
}

async function runActions(
  actions: IntentData[],
  macro: MacroData,
  input: IntentResult,
  item?: IntentResult,
  index?: number,
): Promise<IntentResult> {
  if (++nestedDepth > 8) {
    nestedDepth--;
    throw new Error("Nested actions are too deep");
  }
  let result = input;
  const previous = new Map<string, Record<string, IntentResult>>();
  try {
    for (const action of actions) {
      const intent = Intent.all.get(action.type);
      if (!intent || !Intent.canPerform(action.type)) throw new Error(`Unavailable action: ${action.type}`);
      const raw = Object.fromEntries(
        Object.entries(action.params ?? {}).map(([key, value]) => [
          key,
          value === "$result" ? result : value === "$item" ? item : value === "$index" ? index : value,
        ]),
      );
      const params = await Macros.resolveParams(raw, previous, macro);
      if (params === null) return "__return";
      previous.set(action.uuid, params);
      result = await intent.perform(params, macro, result);
      if (result === "__return" || record(result)?.__macro_stop === true) return result;
    }
    return result;
  } finally {
    nestedDepth--;
  }
}

const variables = new WeakMap<object, Map<string, IntentResult>>();
function scope(macro: object): Map<string, IntentResult> {
  let values = variables.get(macro);
  if (!values) variables.set(macro, (values = new Map()));
  return values;
}

new Intent("comment", {
  category: "scripting",
  icon: "comment",
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform() {
    return undefined;
  },
});

new Intent("show_content", {
  category: "scripting",
  icon: "message",
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform(params, macro) {
    Blockbench.showMessageBox({ title: macro.name ?? "Macro", message: str(params.text) });
    return undefined;
  },
});

new Intent("show_alert", {
  category: "scripting",
  icon: "warning",
  form: {
    title: { type: "text", label: "Title", placeholder: "optional" },
    show_cancel: { type: "checkbox", label: "Show Cancel Button", value: true },
  },
  parameters: [{ name: "prompt", type: IntentParameterTypes.Text }],
  async perform(params) {
    const btn = params?.show_cancel === undefined ? true : params?.show_cancel;
    const btns = ["dialog.ok"];
    if (btn) btns.unshift("dialog.cancel");
    return new Promise((resolve) => {
      Blockbench.showMessageBox(
        {
          title: String(params.title ?? "Alert"),
          message: params.prompt?.toString() ?? "Do you want to continue?",
          buttons: btns,
        },
        (button) => {
          const result = button === 0 ? "__return" : true;
          if (!btn) return resolve(true);
          resolve(result);
        },
      );
    });
  },
});

enum InputValue {
  AskEachTime = "ask",
  Clipboard = "clipboard",
  CurrentDate = "current_date",
}

new Intent("ask_input", {
  category: "scripting",
  icon: "question_mark",
  parameters: [
    { name: "type", type: IntentParameterTypes.Enum },
    { name: "value", type: IntentParameterTypes.Enum },
  ],
  form: {
    default: { type: "text", label: "Default Answer", placeholder: "Text" },
    multiple: { type: "checkbox", label: "Allow Multiple Lines", value: true },
  },
  async perform(params, macro) {
    if (params.value === InputValue.Clipboard) return navigator.clipboard.readText();
    if (params.value === InputValue.CurrentDate) return new Date();
    const type = str(params.type) || IntentParameterTypes.Text;
    const inputType =
      type === IntentParameterTypes.Number
        ? "number"
        : type === IntentParameterTypes.Boolean
          ? "checkbox"
          : params.multiple
            ? "textarea"
            : "text";
    const initial =
      inputType === "checkbox"
        ? params.default === true || params.default === "true"
        : inputType === "number"
          ? Number(params.default) || 0
          : str(params.default);
    return new Promise((resolve) =>
      new Dialog({
        title: macro.name || "Input",
        form: { value: { type: inputType as "text", label: "Value", value: initial as string } },
        buttons: ["dialog.ok", "dialog.cancel"],
        onConfirm(form) {
          const value = form.value;
          if (type === IntentParameterTypes.Number) resolve(finite(value));
          else if (type === IntentParameterTypes.Boolean) resolve(Boolean(value));
          else if (type === IntentParameterTypes.Date) resolve(asDate(value));
          else if (type === IntentParameterTypes.URL) resolve(new URL(str(value)));
          else resolve(str(value));
        },
        onCancel() {
          resolve(undefined);
        },
      }).show(),
    );
  },
})
  .addEnum(
    "type",
    Object.values(IntentParameterTypes).filter((x) => !["enum"].includes(x)),
  )
  .addEnum("value", Object.values(InputValue));

new Intent("count", {
  category: "scripting",
  parameters: [
    { name: "items", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Text },
  ],
  perform(params, _macro, result) {
    const input = params.input ?? result;
    if (Array.isArray(input)) return input.length;
    const text = String(input ?? "");
    const items = String(params.items ?? "");
    if (!items) return text.length;
    return text.split(items).length - 1;
  },
});

// Control Flow

new Intent("choose_from_menu", {
  category: "scripting",
  parameters: [param("prompt"), param("options")],
  perform(params, macro) {
    const options = str(params.options)
      .split(/\r?\n/)
      .map((option) => option.trim())
      .filter(Boolean);
    if (!options.length) throw new Error("Add at least one menu option");
    return new Promise((resolve) =>
      Blockbench.showMessageBox(
        { title: macro.name || "Choose", message: str(params.prompt), buttons: [...options, "dialog.cancel"] },
        (button) => {
          resolve(typeof button === "number" && button < options.length ? options[button] : undefined);
        },
      ),
    );
  },
});

new Intent("if", {
  category: "scripting",
  parameters: [param("condition", IntentParameterTypes.Boolean), param("actions"), param("otherwise")],
  async perform(params, macro, result) {
    const branch = params.condition && params.condition !== "false" ? params.actions : params.otherwise;
    return runActions(parseActions(branch), macro, result);
  },
});

new Intent("repeat", {
  category: "scripting",
  parameters: [param("count", IntentParameterTypes.Number), param("actions")],
  async perform(params, macro, result) {
    const count = Number(params.count);
    if (!Number.isInteger(count) || count < 0 || count > 1000)
      throw new Error("Repeat count must be between 0 and 1000");
    const actions = parseActions(params.actions);
    let output = result;
    for (let index = 0; index < count; index++) {
      output = await runActions(actions, macro, output, undefined, index);
      if (output === "__return" || record(output)?.__macro_stop === true) return output;
    }
    return output;
  },
});

new Intent("repeat_each", {
  category: "scripting",
  parameters: [param("items"), param("actions")],
  async perform(params, macro, result) {
    const input = valueOf(params.items, result);
    const items = Array.isArray(input) ? input : str(input).split(/\r?\n/).filter(Boolean);
    if (items.length > 1000) throw new Error("Repeat Each supports at most 1000 items");
    const actions = parseActions(params.actions);
    const outputs: IntentResult[] = [];
    for (let index = 0; index < items.length; index++) {
      const output = await runActions(actions, macro, items[index], items[index], index);
      if (output === "__return" || record(output)?.__macro_stop === true) return output;
      outputs.push(output);
    }
    return outputs;
  },
});

new Intent("try", {
  category: "scripting",
  description:
    "Run the enclosed actions and continue at On Error if one fails. The error is passed as a dictionary with name and message.",
  perform(_params, _macro, result) {
    return result;
  },
});
new Intent("on_error", {
  category: "scripting",
  name: "On Error",
  perform(_params, _macro, result) {
    return result;
  },
});
new Intent("end_try", {
  category: "scripting",
  name: "End Try",
  perform(_params, _macro, result) {
    return result;
  },
});

new Intent("otherwise", {
  category: "scripting",
  name: "Otherwise",
  icon: "call_split",
  perform(_params, _macro, result) {
    return result;
  },
});
new Intent("end_if", {
  category: "scripting",
  name: "End If",
  icon: "alt_route",
  perform(_params, _macro, result) {
    return result;
  },
});
new Intent("end_repeat", {
  category: "scripting",
  name: "End Repeat",
  icon: "repeat",
  perform(_params, _macro, result) {
    return result;
  },
});
new Intent("end_repeat_each", {
  category: "scripting",
  name: "End Repeat Each",
  icon: "repeat_on",
  perform(_params, _macro, result) {
    return result;
  },
});

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

new Intent("wait", {
  category: "scripting",
  icon: "access_time",
  parameters: [{ name: "seconds", type: IntentParameterTypes.Number }],
  async perform(params) {
    await sleep(Math.max(0, Number(params.seconds) || 0));
    return undefined;
  },
});

// Variables

new Intent("set_variable", {
  category: "scripting",
  parameters: [
    { name: "name", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Text },
  ],
  perform(params, macro, result) {
    const value = params.input ?? result;
    scope(macro).set(String(params.name), value);
    return value;
  },
});

new Intent("get_variable", {
  category: "scripting",
  parameters: [{ name: "name", type: IntentParameterTypes.Text }],
  perform(params, macro) {
    return scope(macro).get(String(params.name));
  },
});

new Intent("add_variable", {
  category: "scripting",
  parameters: [
    { name: "name", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Number },
  ],
  perform(params, macro) {
    const name = String(params.name);
    const value = Number(scope(macro).get(name) ?? 0) + Number(params.input ?? 0);
    scope(macro).set(name, value);
    return value;
  },
});

// Lists

function listItems(input: IntentResult): IntentResult[] {
  return Array.isArray(input) ? [...input] : str(input).split(/\r?\n/).filter(Boolean);
}

function listKey(item: IntentResult): string {
  const normalized = JSON.stringify(item, (_key, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)))
      : value,
  );
  return `${typeof item}:${normalized}`;
}

new Intent("list", {
  category: "scripting",
  parameters: [{ name: "items", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    const value = params.items ?? result;
    return Array.isArray(value)
      ? value
      : String(value ?? "")
          .split(/\r?\n/)
          .filter(Boolean);
  },
});

new Intent("sort_list", {
  category: "scripting",
  description: "Sort a list as text, numbers, or dates without changing the original list.",
  parameters: [param("items"), param("order", IntentParameterTypes.Enum), param("type", IntentParameterTypes.Enum)],
  perform(params, _macro, result) {
    const items = listItems(valueOf(params.items, result));
    const order = str(params.order) || "ascending";
    const type = str(params.type) || "text";
    if (!["ascending", "descending"].includes(order)) throw new Error(`Unknown sort order: ${order}`);
    if (!["text", "number", "date"].includes(type)) throw new Error(`Unknown sort type: ${type}`);
    const values = items.map((item) => {
      if (type === "text") return str(item);
      const number =
        type === "number" ? Number(item) : item instanceof Date ? item.getTime() : new Date(str(item)).getTime();
      if (!Number.isFinite(number)) throw new Error(`List contains an invalid ${type}`);
      return number;
    });
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    return items
      .map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const a = values[left.index],
          b = values[right.index];
        const comparison = type === "text" ? collator.compare(a as string, b as string) : (a as number) - (b as number);
        return (order === "ascending" ? comparison : -comparison) || left.index - right.index;
      })
      .map(({ item }) => item);
  },
})
  .addEnum("order", ["ascending", "descending"])
  .addEnum("type", ["text", "number", "date"]);

new Intent("remove_duplicates", {
  category: "scripting",
  description: "Keep the first occurrence of each value in a list.",
  parameters: [param("items")],
  perform(params, _macro, result) {
    const seen = new Set<string>();
    return listItems(valueOf(params.items, result)).filter((item) => {
      const key = listKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
});

new Intent("join_list", {
  category: "scripting",
  description: "Join list values into text. The default separator is a newline.",
  parameters: [param("items"), param("separator")],
  perform(params, _macro, result) {
    const separator = params.separator == null ? "\n" : str(params.separator);
    return listItems(valueOf(params.items, result))
      .map((item) => {
        if (item == null) return "";
        if (item instanceof Date) return item.toISOString();
        if (typeof item === "object" && !(item instanceof URL)) return JSON.stringify(item);
        return str(item);
      })
      .join(separator);
  },
});

new Intent("choose_from_list", {
  category: "scripting",
  parameters: [param("items"), param("prompt")],
  perform(params, macro, result) {
    const input = valueOf(params.items, result);
    const items = (Array.isArray(input) ? input : str(input).split(/\r?\n/)).filter((item) => str(item));
    if (!items.length) throw new Error("No list items to choose from");
    return new Promise((resolve) =>
      Blockbench.showMessageBox(
        { title: macro.name || "Choose", message: str(params.prompt), buttons: [...items.map(str), "dialog.cancel"] },
        (button) => {
          resolve(typeof button === "number" && button < items.length ? items[button] : undefined);
        },
      ),
    );
  },
});

new Intent("get_from_list", {
  category: "scripting",
  parameters: [{ name: "index", type: IntentParameterTypes.Number }],
  perform(params, _macro, result) {
    return Array.isArray(result) ? result[Number(params.index) || 0] : undefined;
  },
});

// Dictionaries

function dictionaryValue(input: IntentResult, label: string): Record<string, IntentResult> {
  let value: unknown = input;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      throw new Error(`${label} must be a JSON object`);
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value) || value instanceof Date || value instanceof URL) {
    throw new Error(`${label} must be a dictionary`);
  }
  return value as Record<string, IntentResult>;
}

new Intent("dictionary", {
  category: "scripting",
  parameters: [{ name: "json", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    const value = params.json || result;
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
    const parsed = JSON.parse(String(value || "{}"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected a JSON object");
    return parsed;
  },
});

new Intent("get_dictionary_keys", {
  category: "scripting",
  description: "Return the keys of a dictionary as a list, preserving their order.",
  parameters: [param("dictionary")],
  perform(params, _macro, result) {
    return Object.keys(dictionaryValue(valueOf(params.dictionary, result), "Dictionary"));
  },
});

new Intent("merge_dictionaries", {
  category: "scripting",
  description: "Shallow-merge two dictionaries. The previous result supplies First when left empty.",
  parameters: [param("first"), param("second"), param("conflict", IntentParameterTypes.Enum)],
  perform(params, _macro, result) {
    const first = dictionaryValue(valueOf(params.first, result), "First dictionary");
    const second = dictionaryValue(params.second, "Second dictionary");
    const conflict = str(params.conflict) || "use_second";
    if (conflict === "use_second") return { ...first, ...second };
    if (conflict === "keep_first") return { ...second, ...first };
    throw new Error(`Unknown conflict option: ${conflict}`);
  },
}).addEnum("conflict", ["use_second", "keep_first"]);

new Intent("get_dictionary_value", {
  category: "scripting",
  parameters: [{ name: "key", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    return result && typeof result === "object" && !Array.isArray(result) ? result[String(params.key)] : undefined;
  },
});

new Intent("set_dictionary_value", {
  category: "scripting",
  parameters: [
    { name: "key", type: IntentParameterTypes.Text },
    { name: "value", type: IntentParameterTypes.Text },
  ],
  perform(params, _macro, result) {
    return {
      ...(result && typeof result === "object" && !Array.isArray(result) ? result : {}),
      [String(params.key)]: params.value,
    };
  },
});

new Intent("get_dictionary_from", {
  category: "scripting",
  parameters: [param("input")],
  perform(params, _macro, result) {
    const input = valueOf(params.input, result);
    if (
      input &&
      typeof input === "object" &&
      !Array.isArray(input) &&
      !(input instanceof Date) &&
      !(input instanceof URL)
    )
      return input;
    const parsed = JSON.parse(str(input));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Input is not a JSON object");
    return parsed;
  },
});

// Numbers

new Intent("number", {
  category: "scripting",
  parameters: [{ name: "value", type: IntentParameterTypes.Number }],
  perform(params, _macro, result) {
    const number = Number(params.value ?? result);
    if (!Number.isFinite(number)) throw new Error("Expected a finite number");
    return number;
  },
});

new Intent("random_number", {
  category: "scripting",
  parameters: [
    { name: "min", type: IntentParameterTypes.Number },
    { name: "max", type: IntentParameterTypes.Number },
  ],
  perform(params) {
    const min = Number(params.min ?? 0),
      max = Number(params.max ?? 1);
    if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) throw new Error("Invalid random number range");
    return min + Math.random() * (max - min);
  },
});

new Intent("round_number", {
  category: "scripting",
  parameters: [{ name: "digits", type: IntentParameterTypes.Number }],
  perform(params, _macro, result) {
    const factor = 10 ** Math.max(-15, Math.min(15, Number(params.digits) || 0));
    return Math.round(Number(result) * factor) / factor;
  },
});

new Intent("format_number", {
  category: "scripting",
  parameters: [{ name: "locale", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    return new Intl.NumberFormat(params.locale ? String(params.locale) : undefined).format(Number(result));
  },
});

new Intent("get_numbers_input", {
  category: "scripting",
  parameters: [param("input")],
  perform(params, _macro, result) {
    const value = valueOf(params.input, result);
    if (Array.isArray(value)) return value.map((item) => finite(item));
    return (str(value).match(/[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi) ?? []).map(Number);
  },
});

// Math

new Intent("calculate", {
  category: "scripting",
  parameters: [
    param("number1", IntentParameterTypes.Number),
    param("operator", IntentParameterTypes.Enum),
    param("number2", IntentParameterTypes.Number),
  ],
  perform(params) {
    return expression(`${finite(params.number1)}${str(params.operator)}${finite(params.number2)}`);
  },
}).addEnum("operator", ["+", "-", "*", "/", "%", "^"]);

new Intent("calculate_expression", {
  category: "scripting",
  parameters: [param("expression")],
  perform(params, _macro, result) {
    return expression(str(valueOf(params.expression, result)));
  },
});

new Intent("calculate_statistics", {
  category: "scripting",
  parameters: [param("type", IntentParameterTypes.Enum), param("input")],
  perform(params, _macro, result) {
    const input = valueOf(params.input, result);
    const values = (
      Array.isArray(input)
        ? input
        : str(input)
            .split(/[\s,]+/)
            .filter(Boolean)
    ).map((value) => finite(value));
    if (!values.length) throw new Error("No numbers to analyze");
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    switch (params.type) {
      case "sum":
        return sum;
      case "mean":
        return sum / values.length;
      case "median":
        return sorted.length % 2
          ? sorted[(sorted.length - 1) / 2]
          : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
      case "min":
        return sorted[0];
      case "max":
        return sorted[sorted.length - 1];
      case "count":
        return values.length;
      case "range":
        return sorted[sorted.length - 1] - sorted[0];
      case "standard_deviation": {
        const mean = sum / values.length;
        return Math.sqrt(values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length);
      }
      default:
        throw new Error(`Unknown statistic: ${params.type}`);
    }
  },
}).addEnum("type", ["sum", "mean", "median", "min", "max", "count", "range", "standard_deviation"]);

new Intent("measurement", {
  category: "scripting",
  parameters: [param("value", IntentParameterTypes.Number), param("unit")],
  perform(params) {
    const unit = str(params.unit);
    if (!units[unit]) throw new Error(`Unknown unit: ${unit}`);
    return { value: finite(params.value), unit };
  },
});

new Intent("convert_measurement", {
  category: "scripting",
  parameters: [param("value"), param("from"), param("to")],
  perform(params, _macro, result) {
    const measurement = record(result);
    const from = str(params.from || measurement?.unit),
      to = str(params.to);
    if (!units[from] || !units[to] || units[from][0] !== units[to][0])
      throw new Error("Incompatible measurement units");
    return (finite(valueOf(params.value, measurement?.value)) * units[from][1]) / units[to][1];
  },
});

// Dates

new Intent("date", {
  category: "scripting",
  parameters: [param("date", IntentParameterTypes.Date)],
  perform(params, _macro, result) {
    const input = valueOf(params.date, result);
    return input == null || input === "" ? new Date() : asDate(input);
  },
});

new Intent("format_date", {
  category: "scripting",
  parameters: [
    param("date", IntentParameterTypes.Date),
    param("locale"),
    param("time_zone"),
    param("style", IntentParameterTypes.Enum),
  ],
  perform(params, _macro, result) {
    const date = asDate(valueOf(params.date, result));
    return new Intl.DateTimeFormat(str(params.locale) || undefined, {
      dateStyle: (str(params.style) || "medium") as "short" | "medium" | "long" | "full",
      timeZone: str(params.time_zone) || undefined,
    }).format(date);
  },
}).addEnum("style", ["short", "medium", "long", "full"]);

new Intent("adjust_date", {
  category: "scripting",
  parameters: [
    param("date", IntentParameterTypes.Date),
    param("operation", IntentParameterTypes.Enum),
    param("value", IntentParameterTypes.Number),
    param("time", IntentParameterTypes.Enum),
  ],
  perform(params, _macro, result) {
    const date = asDate(valueOf(params.date, result));
    const change = finite(params.value) * (params.operation === "subtract" ? -1 : 1);
    switch (params.time) {
      case "years":
        date.setUTCFullYear(date.getUTCFullYear() + change);
        break;
      case "months":
        date.setUTCMonth(date.getUTCMonth() + change);
        break;
      case "days":
        date.setUTCDate(date.getUTCDate() + change);
        break;
      case "hours":
        date.setUTCHours(date.getUTCHours() + change);
        break;
      case "minutes":
        date.setUTCMinutes(date.getUTCMinutes() + change);
        break;
      case "seconds":
        date.setUTCSeconds(date.getUTCSeconds() + change);
        break;
      default:
        throw new Error(`Unknown time unit: ${params.time}`);
    }
    return date;
  },
})
  .addEnum("operation", ["add", "subtract"])
  .addEnum("time", ["years", "months", "days", "hours", "minutes", "seconds"]);

new Intent("get_time_between_dates", {
  category: "scripting",
  parameters: [
    param("date1", IntentParameterTypes.Date),
    param("date2", IntentParameterTypes.Date),
    param("time", IntentParameterTypes.Enum),
  ],
  perform(params, _macro, result) {
    const first = asDate(valueOf(params.date1, result)),
      second = asDate(params.date2);
    const divisor: Record<string, number> = {
      milliseconds: 1,
      seconds: 1000,
      minutes: 60000,
      hours: 3600000,
      days: 86400000,
      weeks: 604800000,
    };
    const unit = str(params.time) || "days";
    if (!divisor[unit]) throw new Error(`Unknown time unit: ${unit}`);
    return (second.getTime() - first.getTime()) / divisor[unit];
  },
}).addEnum("time", ["milliseconds", "seconds", "minutes", "hours", "days", "weeks"]);

new Intent("get_dates_input", {
  category: "scripting",
  parameters: [param("input")],
  perform(params, _macro, result) {
    const input = valueOf(params.input, result);
    if (Array.isArray(input)) return input.map(asDate);
    return (
      str(input).match(/\b\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?\b/g) ?? []
    ).map(asDate);
  },
});

new Intent("convert_time_zone", {
  category: "scripting",
  parameters: [param("date", IntentParameterTypes.Date), param("time_zone")],
  perform(params, _macro, result) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "long",
      timeZone: str(params.time_zone) || undefined,
    }).format(asDate(valueOf(params.date, result)));
  },
});

// Text

new Intent("text", {
  category: "scripting",
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform(params) {
    return params.text ?? "";
  },
});

new Intent("get_text_input", {
  category: "scripting",
  parameters: [param("input")],
  perform(params, _macro, result) {
    const input = valueOf(params.input, result);
    return Array.isArray(input) ? input.filter((item) => typeof item === "string").join("\n") : str(input);
  },
});

new Intent("show_definition", {
  category: "scripting",
  description: "POST {word} to the endpoint; expects JSON with a definition or text field.",
  parameters: [param("word"), param("endpoint")],
  async perform(params, macro, result) {
    const word = str(valueOf(params.word, result));
    const data = await (await service(params.endpoint, { word })).json();
    const definition = str(data.definition ?? data.text);
    if (!definition) throw new Error("Definition service returned no definition");
    Blockbench.showMessageBox({ title: word || macro.name, message: definition });
    return definition;
  },
});

new Intent("get_name_emoji", {
  category: "scripting",
  description: "Gets common emoji names locally, or POSTs {emoji} to an endpoint that returns {name}.",
  parameters: [param("text"), param("endpoint")],
  async perform(params, _macro, result) {
    const input = str(valueOf(params.text, result));
    const emoji = input.match(/\p{Extended_Pictographic}(?:\uFE0F)?/u)?.[0];
    if (!emoji) throw new Error("No emoji found in input");
    if (params.endpoint) {
      const data = await (await service(params.endpoint, { emoji })).json();
      if (data.name) return str(data.name);
    }
    const common: Record<string, string> = {
      "😀": "grinning face",
      "😂": "face with tears of joy",
      "❤️": "red heart",
      "👍": "thumbs up",
      "🎉": "party popper",
      "🔥": "fire",
      "✅": "check mark",
      "⭐": "star",
    };
    return common[emoji] ?? `Emoji U+${emoji.codePointAt(0)!.toString(16).toUpperCase()}`;
  },
});

// Text Editing

enum TextCase {
  Upper = "upper",
  Lower = "lower",
  Title = "title",
  CapitalizeEveryWord = "all_words",
  CapitalizeSentence = "sentence",
  CapitalizeAlternating = "alternating",
}

new Intent("change_case", {
  category: "scripting",
  parameters: [
    { name: "text", type: IntentParameterTypes.Text },
    { name: "case", type: IntentParameterTypes.Enum },
  ],
  perform(params) {
    switch (params?.case) {
      case TextCase.Upper:
        return params?.text.toString().toUpperCase();
      case TextCase.Lower:
        return params?.text.toString().toLowerCase();
      case TextCase.Title:
        return String(params?.text ?? "")
          .toLowerCase()
          .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
      case TextCase.CapitalizeEveryWord:
        return String(params?.text ?? "").replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
      case TextCase.CapitalizeSentence:
        return String(params?.text ?? "")
          .toLowerCase()
          .replace(/(^|[.!?]\s+)\p{L}/gu, (sentence) => sentence.toUpperCase());
      case TextCase.CapitalizeAlternating:
        return [...String(params?.text ?? "")]
          .map((letter, index) => (index % 2 ? letter.toLowerCase() : letter.toUpperCase()))
          .join("");
      default:
        break;
    }
    return undefined;
  },
}).addEnum("case", Object.values(TextCase));

new Intent("combine_text", {
  category: "scripting",
  parameters: [{ name: "separator", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    return Array.isArray(result) ? result.map(String).join(String(params.separator ?? "")) : String(result ?? "");
  },
});

new Intent("split_text", {
  category: "scripting",
  parameters: [{ name: "separator", type: IntentParameterTypes.Text }],
  perform(params, _macro, result) {
    return String(result ?? "").split(String(params.separator ?? "\n"));
  },
});

new Intent("replace_text", {
  category: "scripting",
  parameters: [
    { name: "find", type: IntentParameterTypes.Text },
    { name: "replace", type: IntentParameterTypes.Text },
  ],
  perform(params, _macro, result) {
    const find = String(params.find ?? "");
    return find
      ? String(result ?? "")
          .split(find)
          .join(String(params.replace ?? ""))
      : String(result ?? "");
  },
});

new Intent("trim_whitespace", {
  category: "scripting",
  perform(_params, _macro, result) {
    return String(result ?? "").trim();
  },
});

new Intent("match_text", {
  category: "scripting",
  parameters: [
    { name: "pattern", type: IntentParameterTypes.Text },
    { name: "flags", type: IntentParameterTypes.Text },
  ],
  perform(params, _macro, result) {
    const flags = str(params.flags) || "g";
    const match = new RegExp(str(params.pattern), flags.includes("g") ? flags : `${flags}g`);
    return [...String(result ?? "").matchAll(match)].map((item) => ({
      match: item[0],
      groups: [...item].slice(1),
      named: item.groups ?? {},
    }));
  },
});

new Intent("get_group_from_matched_text", {
  category: "scripting",
  parameters: [param("index", IntentParameterTypes.Number), param("group")],
  perform(params, _macro, result) {
    const match = Array.isArray(result) ? result[Number(params.index) || 0] : result;
    const entry = record(match);
    if (!entry) throw new Error("Input is not a text match");
    const group = str(params.group);
    const named = entry.named;
    if (group && named && typeof named === "object" && !Array.isArray(named) && group in named) return named[group];
    const groups = entry.groups;
    if (!Array.isArray(groups)) throw new Error("Match has no capture groups");
    return groups[group ? Number(group) - 1 : 0];
  },
});

new Intent("correct_spelling", {
  category: "scripting",
  description: "POST {text, language} to the endpoint; expects JSON with corrected or text.",
  parameters: [param("text"), param("language"), param("endpoint")],
  async perform(params, _macro, result) {
    const data = await (
      await service(params.endpoint, {
        text: str(valueOf(params.text, result)),
        language: str(params.language) || navigator.language,
      })
    ).json();
    const corrected = data.corrected ?? data.text;
    if (typeof corrected !== "string") throw new Error("Spelling service returned no corrected text");
    return corrected;
  },
});

// Audio

new Intent("speak_text", {
  category: "scripting",
  parameters: [param("text"), param("language"), param("rate", IntentParameterTypes.Number)],
  perform(params, _macro, result) {
    if (!window.speechSynthesis) throw new Error("Speech synthesis is unavailable");
    const utterance = new SpeechSynthesisUtterance(str(valueOf(params.text, result)));
    utterance.lang = str(params.language) || navigator.language;
    utterance.rate = Number(params.rate) || 1;
    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve(true);
      utterance.onerror = (event) => reject(new Error(`Speech synthesis failed: ${event.error}`));
      window.speechSynthesis.speak(utterance);
    });
  },
});

new Intent("make_spoken_audio_from_text", {
  category: "scripting",
  description: "POST {text, language} to the endpoint; expects an audio response.",
  parameters: [param("text"), param("language"), param("endpoint")],
  async perform(params, _macro, result) {
    const response = await service(params.endpoint, {
      text: str(valueOf(params.text, result)),
      language: str(params.language) || navigator.language,
    });
    const blob = await response.blob();
    if (!blob.type.startsWith("audio/")) throw new Error("Speech service did not return audio");
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  },
});

// Translation

new Intent("detect_language", {
  category: "scripting",
  description: "POST {text} to the endpoint; expects JSON with language or lang.",
  parameters: [param("text"), param("endpoint")],
  async perform(params, _macro, result) {
    const data = await (await service(params.endpoint, { text: str(valueOf(params.text, result)) })).json();
    const language = data.language ?? data.lang;
    if (typeof language !== "string") throw new Error("Language service returned no language");
    return language;
  },
});

new Intent("translate_text", {
  category: "scripting",
  description: "POST {text, from, to} to the endpoint; expects JSON with translatedText, translation, or text.",
  parameters: [param("text"), param("from_language"), param("to_language"), param("endpoint")],
  async perform(params, _macro, result) {
    const data = await (
      await service(params.endpoint, {
        text: str(valueOf(params.text, result)),
        from: str(params.from_language) || "auto",
        to: str(params.to_language),
      })
    ).json();
    const translation = data.translatedText ?? data.translation ?? data.text;
    if (typeof translation !== "string") throw new Error("Translation service returned no text");
    return translation;
  },
});

// Items

new Intent("get_name", {
  category: "scripting",
  perform(_params, _macro, result) {
    return result && typeof result === "object" && "name" in result ? String(result.name) : "";
  },
});

new Intent("get_type", {
  category: "scripting",
  perform(_params, _macro, result) {
    if (result instanceof Date) return "date";
    if (result instanceof URL) return "url";
    if (Array.isArray(result)) return "list";
    return typeof result;
  },
});

new Intent("set_name", {
  category: "scripting",
  parameters: [param("name")],
  perform(params, _macro, result) {
    if (!result || typeof result !== "object" || Array.isArray(result) || !("name" in result))
      throw new Error("Input has no name");
    result.name = str(params.name);
    return result;
  },
});

new Intent("show_content_graph", {
  category: "scripting",
  perform(_params, macro, result) {
    const seen = new WeakSet<object>();
    const content =
      JSON.stringify(
        result,
        (_key, value) => {
          if (value && typeof value === "object") {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
          }
          return value;
        },
        2,
      ) ?? str(result);
    Blockbench.showMessageBox({ title: macro.name || "Content", message: content });
    return result;
  },
});

// Intent

new Intent("get_actions", {
  category: "scripting",
  parameters: [param("macro")],
  perform(params, macro) {
    const target = Macros.all.find((item) => item.name === str(params.macro)) ?? macro;
    return target.intents.map((action) => ({ type: action.type, uuid: action.uuid, params: action.params }));
  },
});

new Intent("run_macro", {
  category: "scripting",
  description:
    "Run a saved macro by name. Leave Input empty to pass the previous result; the called macro's output becomes this action's result.",
  parameters: [param("macro"), param("input")],
  async perform(params, _macro, result) {
    const name = str(params.macro).trim();
    if (!name) throw new Error("Macro name is required");
    const matches = Macros.all.filter((item) => item.name === name);
    if (!matches.length) throw new Error(`Macro not found: ${name}`);
    if (matches.length > 1) throw new Error(`Multiple macros are named: ${name}`);
    return Macros.executeMacro(matches[0], valueOf(params.input, result));
  },
});

new Intent("run_action", {
  category: "scripting",
  parameters: [param("action"), param("params")],
  async perform(params, macro, result) {
    const name = str(params.action);
    const target = Macros.all.find((item) => item.name === name);
    if (target) return Macros.executeMacro(target, result);
    const intent = Intent.all.get(name);
    if (!intent || name === "run_action" || !Intent.canPerform(name)) throw new Error(`Action not found: ${name}`);
    const input = typeof params.params === "string" ? JSON.parse(params.params || "{}") : (params.params ?? {});
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("Action params must be a JSON object");
    return intent.perform(input, macro, result);
  },
});

// Other

new Intent("get_whats_on_screen", {
  category: "scripting",
  perform() {
    return new Promise<string>((resolve) => Screencam.fullScreen({}, resolve));
  },
});

new Intent("base64_encode", {
  category: "scripting",
  perform(_params, _macro, result) {
    const bytes = new TextEncoder().encode(str(result));
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  },
});

new Intent("generate_hash", {
  category: "scripting",
  parameters: [param("input"), param("type", IntentParameterTypes.Enum)],
  async perform(params, _macro, result) {
    const input = new TextEncoder().encode(str(valueOf(params.input, result)));
    const digest = await crypto.subtle.digest(str(params.type) || "SHA-256", input);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  },
}).addEnum("type", ["SHA-256", "SHA-384", "SHA-512", "SHA-1"]);

new Intent("format_file_size", {
  category: "scripting",
  perform(_params, _macro, result) {
    const bytes = Number(result);
    if (!Number.isFinite(bytes) || bytes < 0) throw new Error("Expected a nonnegative file size");
    const unit = Math.min(4, Math.floor(Math.log(bytes || 1) / Math.log(1024)));
    return `${(bytes / 1024 ** unit).toFixed(unit ? 1 : 0)} ${["B", "KiB", "MiB", "GiB", "TiB"][unit]}`;
  },
});

new Intent("stop_and_output", {
  category: "scripting",
  parameters: [param("result")],
  perform(params, macro, result) {
    const value = valueOf(params.result, result);
    Blockbench.showMessageBox({
      title: macro.name || "Macro Output",
      message: typeof value === "object" ? JSON.stringify(value, null, 2) : str(value),
    });
    return { __macro_stop: true, value };
  },
});

new Intent("stop", {
  category: "scripting",
  perform() {
    return "__return";
  },
});

new Intent("wait_to_return", {
  category: "scripting",
  parameters: [param("prompt")],
  perform(params, macro, result) {
    return new Promise((resolve) =>
      Blockbench.showMessageBox(
        {
          title: macro.name || "Macro",
          message: str(params.prompt) || "Continue?",
          buttons: ["dialog.ok", "dialog.cancel"],
        },
        (button) => {
          resolve(button === 0 ? result : "__return");
        },
      ),
    );
  },
});

new Intent("run_script_over_ssh", {
  category: "scripting",
  description: "Runs a command over the system SSH client with noninteractive authentication and a 30 second limit.",
  variant: "desktop",
  parameters: [param("host"), param("user"), param("port", IntentParameterTypes.Number), param("script")],
  perform(params) {
    const host = str(params.host),
      script = str(params.script),
      user = str(params.user);
    const port = Number(params.port) || 22;
    if (
      !/^[A-Za-z0-9][A-Za-z0-9.:[\]_-]*$/.test(host) ||
      (user && !/^[A-Za-z0-9_][A-Za-z0-9._-]*$/.test(user)) ||
      !script ||
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    )
      throw new Error("Valid SSH host, user, port, and script are required");
    const requireFn = (globalThis as any).require;
    if (typeof requireFn !== "function") throw new Error("SSH requires Node access in desktop Blockbench");
    const childProcess = requireFn("node:child_process") as typeof import("node:child_process");
    return new Promise<string>((resolve, reject) => {
      const child = childProcess.spawn(
        "ssh",
        ["-p", String(port), "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", user ? `${user}@${host}` : host, script],
        { windowsHide: true },
      );
      let output = "",
        error = "";
      const timer = setTimeout(() => child.kill(), 30_000);
      child.stdout.on("data", (chunk) => {
        output += chunk;
        if (output.length > 1_000_000) child.kill();
      });
      child.stderr.on("data", (chunk) => {
        error += chunk;
        if (error.length > 1_000_000) child.kill();
      });
      child.on("error", (reason) => {
        clearTimeout(timer);
        reject(reason);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        code === 0 ? resolve(output.trim()) : reject(new Error(error.trim() || `SSH exited with code ${code}`));
      });
    });
  },
});

new Intent("open_x_callback_url", {
  category: "scripting",
  parameters: [param("url", IntentParameterTypes.URL)],
  perform(params, _macro, result) {
    const url = new URL(str(valueOf(params.url, result)));
    if (["javascript:", "data:", "file:"].includes(url.protocol)) throw new Error("Unsupported URL protocol");
    Blockbench.openLink(url.href);
    return url.href;
  },
});

new Intent("nothing", {
  category: "scripting",
  perform(_params, _macro, result) {
    return result;
  },
});
