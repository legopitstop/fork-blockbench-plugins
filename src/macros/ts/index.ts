/// <reference types="blockbench-types" />

import { ID, VERSION } from "./constants";
import "./languages";
import "./intents";
import "./contrib";

import { Intent } from "./intent";
import { Macros } from "./macro";
import { MacroEditor } from "./editor";

const deleteables: Deletable[] = [];
BBPlugin.register(ID, {
  title: "Macros",
  author: "legopitstop",
  icon: "icon.png",
  description: "This plugin lets you automate actions.",
  has_changelog: true,
  website: "https://docs.lpsmods.dev/macros",
  repository: "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/macros",
  variant: "both",
  version: VERSION,
  min_version: "4.8.0",
  creation_date: "2026-10-13",
  tags: ["Blockbench"],
  new_repository_format: true,
  oninstall() {},
  onuninstall() {},
  onload() {
    Macros.load();
    const watchdogSetting = new Setting("macros_watchdog_seconds", {
      name: "Macros: Watchdog limit (seconds)",
      description: "Stop a macro after this many seconds. Set to 0 to disable the watchdog.",
      category: "general",
      type: "number",
      value: 60,
      min: 0,
      max: 3600,
      onChange(value) {
        Macros.watchdogSeconds = Number(value);
      },
    });
    Macros.watchdogSeconds = Number(watchdogSetting.value);

    Intent.menu = new Action("macros", {
      icon: "play_arrow",
      click() {},
      children() {
        return [
          ...Macros.all
            .filter((macro) => Macros.canRun(macro))
            .map((macro) => {
              return {
                name: macro.name,
                icon: macro.icon,
                click() {
                  Macros.run(Macros.all.indexOf(macro));
                },
              };
            }),
          new MenuSeparator(),
          {
            name: tl("dialog.manage_macros"),
            icon: "build",
            click() {
              Intent.manageDialog.show();
            },
          },
          {
            name: tl("dialog.create_macro"),
            icon: "add",
            click() {
              Macros.openEditor();
            },
          },
        ];
      },
    });

    Intent.manageDialog = new Dialog({
      title: "dialog.manage_macros",
      id: "manage_macros",
      buttons: ["dialog.close"],
      component: {
        data() {
          return {
            macros: Macros.all,
            search: "",
          };
        },
        components: {
          Macro: Macros.component,
        },
        computed: {
          filteredMacros() {
            const query = this.search.trim().toLowerCase();
            return query ? this.macros.filter((macro) => macro.name.toLowerCase().includes(query)) : this.macros;
          },
        },
        methods: {
          importMacro() {
            Macros.importMacro();
          },
        },
        template: `<div id="macro_manager">
          <div class="macro_manager_toolbar">
            <div class="search_bar" id="macro_search_bar">
              <input type="text" inputmode="search" class="dark_bordered" v-model="search">
              <i class="material-icons">search</i>
            </div>
            <button type="button" class="macro_import_button" title="Import Macro" aria-label="Import Macro" @click="importMacro"><i class="material-icons" aria-hidden="true">file_upload</i></button>
          </div>
          <ul class="macros">
            <li class="macro" v-for="macro in filteredMacros" :key="macros.indexOf(macro)">
              <Macro :macro="macro" />
            </li>
          </ul>
        </div>`,
      },
    });

    Intent.editDialog = new Dialog({
      title: "dialog.edit_macro",
      id: "edit_macro",
      width: 900,
      resizable: "xy",
      onOpen() {
        (Intent.editDialog.content_vue as any)?.resetState?.();
      },
      buttons: ["macro.save_and_run", "dialog.save", "dialog.cancel"],
      onButton(button_index) {
        switch (button_index) {
          case 0:
            Macros.run(Macros.saveDraft());
            break;
          case 1:
            Macros.saveDraft();
            break;
        }
      },
      component: MacroEditor,
    });

    MenuBar.addAction(Intent.menu, "tools");

    const css = `#edit_macro {display: flex; flex-direction: column; height: min(680px, calc(100vh - 40px));}
    #edit_macro .dialog_wrapper {display: flex; flex-direction: column; min-height: 0;}
    #edit_macro .dialog_content {display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; max-height: none; overflow: hidden;}
    #macro_editor {display: flex; flex-direction: column; flex: 1 1 0; min-width: 0; min-height: 320px; color: var(--color-text);}
    #macro_editor * {box-sizing: border-box;}
    #macro_editor button {cursor: pointer; color: inherit;}
    #macro_editor button:disabled {opacity: .35; cursor: default;}
    #macro_editor .macro_editor_header {position: relative; padding: 8px 12px 16px; border-bottom: 1px solid var(--color-border);}
    #macro_editor .macro_editor_identity {display: flex; align-items: center; gap: 12px;}
    #macro_editor .macro_editor_icon {width: 48px; height: 48px; border: 0; border-radius: 12px; background: var(--color-accent); color: var(--color-light);}
    #macro_editor .macro_editor_icon .material-icons {font-size: 27px;}
    #macro_editor .macro_editor_name {font-size: 20px; font-weight: 600; min-width: 0; flex: 1;}
    #macro_editor .macro_editor_icon_choices {position: absolute; z-index: 5; top: 62px; left: 12px; width: 290px; padding: 10px; display: flex; flex-wrap: wrap; gap: 5px; background: var(--color-elevated); border: 1px solid var(--color-border); border-radius: 8px; box-shadow: 0 6px 20px #0006;}
    #macro_editor .macro_editor_icon_choices button {border: 0; background: var(--color-button); border-radius: 5px; width: 40px; height: 36px;}
    #macro_editor .macro_editor_icon_choices input {width: 100%;}
    #macro_editor .macro_editor_body {display: grid; grid-template-columns: minmax(220px, 32%) minmax(0, 1fr); min-height: 0; flex: 1; overflow: hidden;}
    #macro_editor .macro_editor_library {display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; padding: 14px; gap: 8px; border-right: 1px solid var(--color-border);}
    #macro_editor .macro_editor_library_title, #macro_editor .macro_editor_workflow_title {font-size: 15px; font-weight: 600; margin-bottom: 4px;}
    #macro_editor .macro_editor_library input, #macro_editor .macro_editor_library select {width: 100%; min-width: 0;}
    #macro_editor .macro_editor_actions {flex: 1 1 0; min-height: 0; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain;}
    #macro_editor .macro_editor_action {width: 100%; display: flex; align-items: center; gap: 9px; text-align: left; border: 0; border-radius: 6px; background: var(--color-elevated); padding: 9px; margin-bottom: 5px; cursor: grab;}
    #macro_editor .macro_editor_action:hover {background: var(--color-button);}
    #macro_editor .macro_editor_action span {flex: 1; min-width: 0; overflow-wrap: anywhere;}
    #macro_editor .macro_editor_add {opacity: .55;}
    #macro_editor .macro_editor_workflow {min-width: 0; overflow-y: auto; padding: 16px; background: var(--color-back);}
    #macro_editor .macro_editor_workflow_title {display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;}
    #macro_editor .macro_editor_workflow_title span {font-size: 12px; font-weight: 400; opacity: .7;}
    #macro_editor .macro_editor_empty {padding: 48px 24px; text-align: center; border: 2px dashed var(--color-border); border-radius: 10px; opacity: .75;}
    #macro_editor .macro_editor_empty.macro_editor_empty_drop {border-color: var(--color-accent); opacity: 1;}
    #macro_editor .macro_editor_step {position: relative; margin-bottom: 12px; border-radius: 9px; background: var(--color-elevated); box-shadow: 0 2px 6px #0003;}
    #macro_editor .macro_editor_step:not(:last-child)::after {content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 2px; height: 8px; background: var(--color-accent); opacity: .75; pointer-events: none;}
    #macro_editor .macro_editor_step:not(:last-child)::before {content: ""; position: absolute; top: calc(100% + 7px); left: 50%; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--color-accent); opacity: .75; pointer-events: none;}
    #macro_editor .macro_editor_step.macro_editor_nested {border-left: 3px solid var(--color-accent);}
    #macro_editor .macro_editor_step.macro_editor_nested::before {content: ''; position: absolute; left: -15px; top: -12px; bottom: -12px; border-left: 2px solid var(--color-border);}
    #macro_editor .macro_editor_step.macro_editor_marker {background: var(--color-button);}
    #macro_editor .macro_editor_step.macro_editor_inserting {box-shadow: 0 3px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_insert_hint {font-size: 12px; padding: 8px 0;}
    #macro_editor .macro_editor_insert_hint button {margin-left: 8px;}
    #macro_editor .macro_editor_step.macro_editor_has_suggestions {z-index: 5;}
    #macro_editor .macro_editor_step.macro_editor_dragging {opacity: .45;}
    #macro_editor .macro_editor_step.macro_editor_drop_before {box-shadow: 0 -4px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_step.macro_editor_drop_after {box-shadow: 0 4px 0 var(--color-accent), 0 2px 6px #0003;}
    #macro_editor .macro_editor_step_header {display: flex; align-items: center; gap: 7px; padding: 9px 42px 9px 10px; border-bottom: 1px solid var(--color-border);}
    #macro_editor .macro_editor_step_header strong {flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    #macro_editor .macro_editor_step_header button {width: 26px; height: 26px; padding: 0; border: 0; background: none;}
    #macro_editor .macro_editor_step_header .macro_editor_insert_below {display: flex; align-items: center; justify-content: center; flex: 0 0 26px; min-width: 26px; max-width: 26px; min-height: 26px; max-height: 26px;}
    #macro_editor .macro_editor_step_header button .material-icons {font-size: 19px;}
    #macro_editor .macro_editor_step_header .macro_editor_remove {position: absolute; top: 7px; right: 8px; display: flex; align-items: center; justify-content: center; flex: 0 0 26px; min-width: 26px; max-width: 26px; min-height: 26px; max-height: 26px;}
    #macro_editor .macro_editor_handle {cursor: grab; opacity: .5;}
    #macro_editor .macro_editor_step_icon {color: var(--color-accent);}
    #macro_editor .macro_editor_fields {display: flex; flex-direction: column; gap: 10px; padding: 12px 14px;}
    #macro_editor .macro_editor_field {position: relative; display: flex; align-items: center; gap: 12px; min-width: 0;}
    #macro_editor .macro_editor_field.macro_editor_candidate {outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 4px; cursor: pointer;}
    #macro_editor .macro_editor_selection_prompt {display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 10px; border-radius: 6px; background: var(--color-selected); color: var(--color-text);}
    #macro_editor .macro_editor_selection_prompt span {flex: 1;}
    #macro_editor .macro_editor_selection_prompt button {border: 0; border-radius: 4px; background: var(--color-button); padding: 4px 8px;}
    #macro_editor .macro_editor_field > span {width: 110px; flex: 0 0 110px;}
    #macro_editor .macro_editor_value {display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0;}
    #macro_editor .macro_editor_vector {display: flex; flex: 1; min-width: 0; gap: 2px;}
    #macro_editor .macro_editor_vector input {width: 0; min-width: 0; flex: 1; text-align: center;}
    #macro_editor .macro_editor_vector input:nth-child(1) {border-top-right-radius: 0; border-bottom-right-radius: 0; border-top: 2px solid #f44336;}
    #macro_editor .macro_editor_vector input:nth-child(2) {border-radius: 0; border-top: 2px solid #4caf50;}
    #macro_editor .macro_editor_vector input:nth-child(3) {border-top-left-radius: 0; border-bottom-left-radius: 0; border-top: 2px solid #2196f3;}
    #macro_editor .macro_editor_value > input:not([type=checkbox]), #macro_editor .macro_editor_value > select {min-width: 0; flex: 1;}
    #macro_editor .macro_editor_value > input[type=checkbox] + button {margin-left: auto;}
    #macro_editor .macro_editor_value button {border: 0; border-radius: 4px; background: var(--color-button); height: 28px; min-width: 28px; padding: 2px;}
    #macro_editor .macro_editor_value button .material-icons {font-size: 18px;}
    #macro_editor .macro_editor_insert_variable {opacity: .7;}
    #macro_editor .macro_editor_insert_variable:hover {opacity: 1; color: var(--color-accent);}
    #macro_editor .macro_editor_variable {display: inline-flex; align-items: center; gap: 5px; min-width: 0; height: 28px; padding: 2px 3px 2px 8px; border-radius: 5px; background: var(--color-accent); color: var(--color-accent_text); font-weight: 600;}
    #macro_editor .macro_editor_variable > .material-icons {font-size: 17px;}
    #macro_editor .macro_editor_variable button {display: flex; align-items: center; justify-content: center; flex: 0 0 22px; min-width: 22px; max-width: 22px; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 4px; background: transparent; color: inherit;}
    #macro_editor .macro_editor_variable button .material-icons {font-size: 17px;}
    #macro_editor .macro_editor_suggestions {position: absolute; z-index: 10; top: calc(100% + 4px); left: 122px; right: 0; max-height: 230px; overflow-y: auto; padding: 5px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-elevated); box-shadow: 0 6px 18px #0008;}
    #macro_editor .macro_editor_suggestions.macro_editor_suggestions_above {top: auto; bottom: calc(100% + 4px);}
    #macro_editor .macro_editor_suggestions button {display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: 0; border-radius: 4px; background: transparent; text-align: left;}
    #macro_editor .macro_editor_suggestions button:hover {background: var(--color-button);}
    #macro_editor .macro_editor_suggestions .material-icons {font-size: 18px; color: var(--color-accent);}
    #macro_editor .macro_editor_hint {padding: 10px; opacity: .65;}
    #macro_manager {display: flex; flex-direction: column; min-width: 0;}
    #macro_manager .macro_manager_toolbar {display: flex; align-items: center; gap: 8px;}
    #macro_manager .macro_manager_toolbar .search_bar {flex: 1; min-width: 0;}
    #macro_manager .macro_manager_toolbar button {display: flex; align-items: center; justify-content: center; white-space: nowrap;}
    #macro_manager .macro_import_button {width: 32px; height: 32px; padding: 0; flex: 0 0 32px;}
    #macro_manager .macros {display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; max-height: 50vh; overflow-y: auto;}
    #macro_manager .macro {box-sizing: border-box; flex: 0 0 110px; position: relative; min-width: 0; background-color: var(--color-back); padding: 16px; border-radius: 5px; overflow-wrap: anywhere;}
    .macro_options_button {position: absolute; top: 4px; right: 0px; height: 30px; width: 30px; margin-left: 1px; margin-right: 1px; cursor: pointer; }
    .macro_options_button:hover { color: var(--color-light) }
    
    #macro_search_bar {display: flex; position: relative; width: 100%; box-sizing: border-box; margin: 0;}
    #macro_search_bar input {min-width: 0; flex: 1;}`;
    deleteables.push(Blockbench.addCSS(css));
  },
  onunload() {
    deleteables.forEach((e) => e.delete());
    Intent.menu?.delete();
    Intent.manageDialog?.delete();
    Intent.editDialog?.delete();
  },
});
