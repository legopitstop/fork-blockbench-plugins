import './languages.js';
import { VERSION, ID } from "./constants.js";
import { Tweak, TweakConfig } from "./tweaks/index.js";

// Import Tweaks
import "./tweaks/header_color.js";
import "./tweaks/wrap_tabs.js";
import "./tweaks/close_actions.js";
import "./tweaks/pin_tab.js";

(function () {
  var selectProfile;
  var unselectProfile;
  var deleteables = [];

  BBPlugin.register(ID, {
    title: "Tweaks & Stuff",
    author: "legopitstop",
    icon: "icon.png",
    description:
      "Adds a few tweaks to Blockbench to make your modeling experience better.",
    has_changelog: true,
    website: "https://docs.lpsmods.dev/tweaks_n_stuff",
    repository:
      "https://github.com/legopitstop/blockbench-plugins/tree/master/src/tweaks_n_stuff",
    variant: "both",
    version: VERSION,
    min_version: "4.8.0",
    tags: ["Blockbench"],
    new_repository_format: true,
    oninstall() {
      Tweak.all.forEach((tweak) => tweak.install());
    },
    onuninstall() {
      Tweak.all.forEach((tweak) => tweak.uninstall());
    },
    onload() {
      TweakConfig.load();
      MenuBar.addAction(Tweak.action, "file.-1");
      deleteables.push(Tweak.dialog, Tweak.action);

      Tweak.all.forEach((tweak) => tweak.load());

      if (Tweak.all.size == 0) {
        console.warn("No tweaks registered!");
      }

      // CUSTOM EVENTS

      // TODO: On Update event (Modifying profile color does'nt update)
      selectProfile = SettingsProfile.prototype.select;
      SettingsProfile.prototype.select = function (...args) {
        selectProfile.apply(this, args);
        Blockbench.dispatchEvent("profile_changed", {
          profile: SettingsProfile.selected,
        });
      };

      unselectProfile = SettingsProfile.prototype.unselect;
      SettingsProfile.prototype.unselect = function (...args) {
        unselectProfile.apply(this, args);
        Blockbench.dispatchEvent("profile_changed", { profile: null });
      };

      // TODO: Issue when opening a model that asks to import a texture.
      hideDialog = Dialog.prototype.hide;
      Dialog.prototype.hide = function (...args) {
        Blockbench.dispatchEvent("hide_dialog", Dialog.open);
        hideDialog.apply(this, args);
      };

      showDialog = Dialog.prototype.show;
      Dialog.prototype.show = function (...args) {
        showDialog.apply(this, args);
        Blockbench.dispatchEvent("show_dialog", Dialog.open);
      };
    },
    onunload() {
      SettingsProfile.prototype.select = selectProfile;
      SettingsProfile.prototype.unselect = unselectProfile;
      Dialog.prototype.hide = hideDialog;
      Dialog.prototype.show = showDialog;
      Tweak.all.forEach((tweak) => tweak.unload());
      deleteables.forEach((d) => d.delete());
    },
  });
})();
