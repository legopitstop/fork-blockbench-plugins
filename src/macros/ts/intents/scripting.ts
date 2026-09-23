/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes } from "../intent";

new Intent("comment", {
  category: 'scripting',
  icon: "comment",
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform() {
    return undefined;
  },
});

new Intent("show_content", {
  category: 'scripting',
  icon: "message",
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform(params, macro) {
    Blockbench.showMessageBox({ title: macro.name ?? "Macro", message: params.text.toString() });
    return undefined;
  },
});

new Intent("show_alert", {
  category: 'scripting',
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
          title: params.title ?? "Alert",
          message: params.prompt?.toString() ?? "Do you want to continue?",
          buttons: btns,
        },
        (button) => {
          const result = button === 0 ? "__return" : true;
          if (!btn) return resolve(true);
          resolve(result);
        }
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
  category: 'scripting',
  icon: "question_mark",
  parameters: [
    { name: "type", type: IntentParameterTypes.Enum },
    { name: "value", type: IntentParameterTypes.Enum },
  ],
  form: {
    default: { type: "text", label: "Default Answer", placeholder: "Text" },
    multiple: { type: "checkbox", label: "Allow Multiple Lines", value: true },
  },
  perform(params, macro) {
    return new Promise((resolve) => {
      Blockbench.textPrompt(macro.name ?? "Macro", params?.value?.toString() ?? "", (text) => {
        resolve(text);
      });
    });
  },
})
  .addEnum(
    "type",
    Object.values(IntentParameterTypes).filter((x) => !["enum"].includes(x))
  )
  .addEnum("value", Object.values(InputValue));

// TODO: Implement
new Intent("count", {
  category: 'scripting',
  parameters: [
    { name: "items", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Text },
  ],
  perform() {
    return undefined;
  },
});

// Control Flow

// TODO: Implement
new Intent("choose_from_menu", {
  category: 'scripting',
  parameters: [{ name: "prompt", type: IntentParameterTypes.Text }],
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("if", {
  category: 'scripting',
  parameters: [{ name: "condition", type: IntentParameterTypes.Boolean }],
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("repeat", {
  category: 'scripting',
  parameters: [{ name: "count", type: IntentParameterTypes.Number }],
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("repeat_each", {
  category: 'scripting',
  parameters: [{ name: "items", type: IntentParameterTypes.Text }],
  perform() {
    return undefined;
  },
});

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

new Intent("wait", {
  category: 'scripting',
  icon: "access_time",
  parameters: [{ name: "seconds", type: IntentParameterTypes.Number }],
  async perform() {
    await sleep(1);
    return undefined;
  },
});

// Variables

// TODO: Implement
new Intent("set_variable", {
  category: 'scripting',
  parameters: [
    { name: "name", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Text },
  ],
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_variable", {
  category: 'scripting',
  parameters: [{ name: "name", type: IntentParameterTypes.Text }],
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("add_variable", {
  category: 'scripting',
  parameters: [
    { name: "name", type: IntentParameterTypes.Text },
    { name: "input", type: IntentParameterTypes.Number },
  ],
  perform() {
    return undefined;
  },
});

// Lists

// TODO: Implement
new Intent("list", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("choose_from_list", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_from_list", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Dictionaries

// TODO: Implement
new Intent("dictionary", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_dictionary_value", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("set_dictionary_value", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_dictionary_from", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Numbers

// TODO: Implement
new Intent("number", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("random_number", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("round_number", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("format_number", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_numbers_input", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Math

// TODO: Implement
new Intent("calculate", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("calculate_expression", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("calculate_statistics", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("measurement", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("convert_measurement", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Dates

// TODO: Implement
new Intent("date", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("format_date", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("adjust_date", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_time_between_dates", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_dates_input", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("convert_time_zone", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Text

// TODO: Implement
new Intent("text", {
  category: 'scripting',
  parameters: [{ name: "text", type: IntentParameterTypes.Text }],
  perform(params) {
    return params.text ?? "";
  },
});

// TODO: Implement
new Intent("get_text_input", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("show_definition", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_name_emoji", {
  category: 'scripting',
  perform() {
    return undefined;
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

// TODO: Implement
new Intent("change_case", {
  category: 'scripting',
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
        return params?.text.toString();
      case TextCase.CapitalizeEveryWord:
        return params?.text.toString();
      case TextCase.CapitalizeSentence:
        return params?.text.toString();
      case TextCase.CapitalizeAlternating:
        return params?.text.toString();
      default:
        break;
    }
    return undefined;
  },
}).addEnum("case", Object.values(TextCase));

// TODO: Implement
new Intent("combine_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("split_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("replace_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("trim_whitespace", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("match_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_group_from_matched_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("correct_spelling", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Audio

// TODO: Implement
new Intent("speak_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("make_spoken_audio_from_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Translation

// TODO: Implement
new Intent("detect_language", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("translate_text", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Items

// TODO: Implement
new Intent("get_name", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("get_type", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("set_name", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("show_content_graph", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Intent

// TODO: Implement
new Intent("get_actions", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("run_action", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// Other

// TODO: Implement
new Intent("get_whats_on_screen", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("base64_encode", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("generate_hash", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("format_file_size", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("stop_and_output", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("stop", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("wait_to_return", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("run_script_over_ssh", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("open_x_callback_url", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});

// TODO: Implement
new Intent("nothing", {
  category: 'scripting',
  perform() {
    return undefined;
  },
});
