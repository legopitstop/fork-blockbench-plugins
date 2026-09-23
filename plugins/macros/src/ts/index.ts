/// <reference types="blockbench-types" />

import { ID, VERSION } from "./constants";
import "./languages";
import "./intents";
import "./contrib";

import { Intent, PluginIntent } from "./intent";
import { Macros } from "./macro";
import ICONS from "./data/icons.json";

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
  tags: ["Blockbench"],
  new_repository_format: true,
  oninstall() {},
  onuninstall() {},
  onload() {
    Macros.load();

    Intent.menu = new Action("macros", {
      icon: "play_arrow",
      click() {},
      children() {
        return [
          ...Macros.all
            .filter((macro) => Macros.canRun(macro))
            .map((macro, index) => {
              return {
                name: macro.name,
                icon: macro.icon,
                click() {
                  Macros.run(index);
                },
              };
            }),
          new MenuSeparator(),
          {
            name: tl("dialog.manage_macros"),
            icon: "build",
            condition: () => Macros.all.length !== 0,
            click() {
              Intent.manageDialog.show();
            },
          },
          {
            name: tl("dialog.create_macro"),
            icon: "add",
            click() {
              Macros.selected = { name: `Macro ${Macros.all.length + 1}`, icon: "play_arrow", intents: [] };
              Intent.editDialog.show();
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
          };
        },
        components: {
          Macro: Macros.component,
        },
        // TODO: :macro should be an index in Macros.all
        template: `<div>
          <div class="search_bar" id="macro_search_bar">
            <input type="text" inputmode="search" class="dark_bordered" @keyup.enter="alert('worked')">
            <i class="material-icons">search</i>
          </div>
          <div>
            <ul class="macros">
              <li class="macro" v-for="macro in macros" :key="macro.id">
                <Macro :macro="macro" />
              </li>
            </ul>
          </div>
        </div>`,
      },
    });

    Intent.editDialog = new Dialog({
      title: "dialog.edit_macro",
      id: "edit_macro",
      width: 600,
      form: {
        name: { type: "text", label: "Name", value: Macros.selected?.name ?? "New macro" },
        icon: { type: "select", label: "Icon", value: Macros.selected?.icon ?? "", options: ICONS },
        _1: "_",
        add: {
          type: "buttons",
          buttons: ["Add Action"],
          click: () => {
            Intent.actionChooser.show();
          },
        },
      },
      buttons: ["macro.save_and_run", "dialog.save", "dialog.cancel"],
      onButton(button_index) {
        switch (button_index) {
          // Save & Run
          case 0:
            Macros.save();
            Macros.run(0);
            break;
          // Save
          case 1:
            Macros.save();
            break;
        }
      },
      component: {
        data() {
          return {
            macro: Macros.selected,
          };
        },
        components: {
          Intent: Intent.component,
        },
        methods: {
          addAction: () => {
            Intent.actionChooser.show();
          },
        },
        template: `<div>
        <ul id="macro_intents">
          <li v-if="macro.intents.length === 0" class="empty" @click="addAction">
            <span>Select an action to get started.</span>
          </li>
          <li class="intent" v-for="intent in macro.intents" :key="intent.id">
            <Intent :intent="intent" />
          </li>
        </ul>
        </div>`,
      },
    });

    Intent.actionChooser = new Dialog({
      title: "dialog.add_action",
      id: "add_action",
      width: 600,
      buttons: ["dialog.add", "dialog.cancel"],
      onButton(button_index) {
        switch (button_index) {
          // TODO: Add the action to the selected macro.
          case 0:
            console.log("add action");
            break;
        }
      },
      component: {
        data() {
          return {
            categories: Intent.categories,
            pinnedIntents: Intent.pinned,
            plugins: PluginIntent.plugins,
            search: "",
          };
        },
        components: {
          Intent: Intent.component,
        },
        methods: {},
        computed: {
          searchResults() {
            return Intent.search(this.search);
          },
        },
        template: `<div id="action_chooser">
          <div class="search_bar" id="action_search_bar">
            <input type="text" inputmode="search" class="dark_bordered" v-model="search">
            <i class="material-icons">search</i>
          </div>
          <div v-if="search.length">
            <ul>
              <li class="intent_card elevated" v-for="intent in searchResults" :key="intent.id">
                  <i class="material-icons">{{ intent.options.icon }}</i>
                  <div>{{ intent.options.name }}</div>
              </li>
            </ul>
          </div>
          <div v-else>
            <ul class="plugin_tag_list">
              <li v-for="[id, name] in categories" :key="id" @click="search = 'category:'+id">{{ name }}</li>
            </ul>
            <ul>
              <li class="intent_card elevated" v-for="intent in pinnedIntents" :key="intent.id">
                  <i class="material-icons">{{ intent.options.icon }}</i>
                  <div>{{ intent.options.name }}</div>
              </li>
            </ul>
            <ul>
              <li class="elevated" @click="search = 'plugin:test'">Test</li>

              <li class="elevated" v-for="plugin in plugins" :key="plugin.id">
                {{ plugin.name }}
              </li>
            </ul>
          </div>
        </div>`,
      },
    });

    MenuBar.addAction(Intent.menu, "tools");

    const css = `#macro_intents {display: block; background-color: var(--color-back); margin-top: 16px; max-height: 100%; overflow: auto;}
    #macro_intents .intent {position: relative; background-color: var(--color-elevated); padding: 16px; border-radius: 5px; margin: 16px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);}
    #macro_intents .intent:not(:last-child) {margin-bottom: 10px;}
    #macro_intents .empty {position: relative; text-align: center; border: 2px dashed var(--color-text); border-radius: 5px; padding: 16px; margin: 16px; cursor: pointer;}
    #macro_intents .empty:hover {border-color: var(--color-accent);}
    .intent .param {background-color: var(--color-button); color: var(--color-text); padding-left: 6px; padding-right: 6px; cursor: pointer; border-radius: 5px;}
    .delete_macro_intent_button {position: absolute; top: 4px; right: 0px; height: 30px; width: 30px; margin-left: 1px; margin-right: 1px; cursor: pointer; }
    .delete_macro_intent_button:hover { color: var(--color-light) }
    .intent_icon {display: inline-block; vertical-align: text-top;}
    .intent_summary {display: inline-block;overflow-wrap: normal;}

    .form_intent_button {color: var(--color-accent); vertical-align: text-top;}
    
    .macros {display: flex; margin-top: 16px; max-height: 100%; overflow: auto; gap: 8px;}
    .macro {flex: 1; position: relative; width: 100%; background-color: var(--color-back); padding: 16px; border-radius: 5px;}
    .macro_options_button {position: absolute; top: 4px; right: 0px; height: 30px; width: 30px; margin-left: 1px; margin-right: 1px; cursor: pointer; }
    .macro_options_button:hover { color: var(--color-light) }
    
    #macro_search_bar {display: flex; margin: auto;}
    #action_search_bar {display: flex; margin: auto;}
    
    #action_chooser .intent_card {display: flex; gap: 1; padding: 8px; margin-bottom: 4px;}`;
    deleteables.push(Blockbench.addCSS(css));
  },
  onunload() {
    // deleteables.forEach((e) => e.delete());
    Intent.menu?.delete();
    Intent.manageDialog?.delete();
  },
});
