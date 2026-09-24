import "./languages.js";
import { VERSION, ID } from "./constants.js";

(function () {
  var deleteables = [];

  BBPlugin.register(ID, {
    title: "Object Notes",
    author: "legopitstop",
    icon: "icon.png",
    description: "desc",
    has_changelog: true,
    website: "https://docs.lpsmods.dev/object_notes",
    repository: "https://github.com/legopitstop/blockbench-plugins/tree/master/src/object_notes",
    variant: "both",
    version: VERSION,
    min_version: "4.8.0",
    tags: ["Blockbench"],
    new_repository_format: true,
    oninstall() {},
    onuninstall() {},
    onload() {
      var create_note = new Action("create_note", {
        label: "Create Note",
        icon: "add",
        click() {
          Blockbench.showQuickMessage("CREATE NOTE");
        },
      });
      var edit_note = new Action("edit_note", {
        label: "Edit Note",
        icon: "pencil",
        click() {
          Blockbench.showQuickMessage("EDIT NOTE");
        },
      });
      var remove_note = new Action("remove_note", {
        label: "Remove Note",
        icon: "remove",
        click() {
          Blockbench.showQuickMessage("REMOVE NOTE");
        },
      });
      MenuBar.addAction(create_note, "edit");
      Cube.menu.addAction(create_note, "#manage");
      deleteables.push(create_note, edit_note, remove_note);
    },
    onunload() {
      deleteables.forEach((d) => d.delete());
    },
  });
})();
