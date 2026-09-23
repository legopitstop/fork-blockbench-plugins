(() => {
  // src/lang/cz.json
  var cz_default = {};

  // src/lang/de.json
  var de_default = {};

  // src/lang/en.json
  var en_default = {
    "settings.example": "example",
    "settings.example.desc": "desc",
    "action.example": "example",
    "action.example.desc": "desc"
  };

  // src/lang/es.json
  var es_default = {};

  // src/lang/fr.json
  var fr_default = {};

  // src/lang/it.json
  var it_default = {};

  // src/lang/ja.json
  var ja_default = {};

  // src/lang/ko.json
  var ko_default = {};

  // src/lang/nl.json
  var nl_default = {};

  // src/lang/pl.json
  var pl_default = {};

  // src/lang/pt.json
  var pt_default = {};

  // src/lang/ru.json
  var ru_default = {};

  // src/lang/sv.json
  var sv_default = {};

  // src/lang/uk.json
  var uk_default = {};

  // src/lang/vi.json
  var vi_default = {};

  // src/lang/zh_tw.json
  var zh_tw_default = {};

  // src/lang/zh.json
  var zh_default = {};

  // src/languages.js
  Language.addTranslations("cz", cz_default);
  Language.addTranslations("de", de_default);
  Language.addTranslations("en", en_default);
  Language.addTranslations("es", es_default);
  Language.addTranslations("fr", fr_default);
  Language.addTranslations("it", it_default);
  Language.addTranslations("ja", ja_default);
  Language.addTranslations("ko", ko_default);
  Language.addTranslations("nl", nl_default);
  Language.addTranslations("pl", pl_default);
  Language.addTranslations("pt", pt_default);
  Language.addTranslations("ru", ru_default);
  Language.addTranslations("sv", sv_default);
  Language.addTranslations("uk", uk_default);
  Language.addTranslations("vi", vi_default);
  Language.addTranslations("zh_tw", zh_tw_default);
  Language.addTranslations("zh", zh_default);

  // src/constants.js
  var VERSION = "1.1.0";
  var ID = "object_notes";

  // src/index.js
  (function() {
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
      oninstall() {
      },
      onuninstall() {
      },
      onload() {
        var create_note = new Action("create_note", {
          label: "Create Note",
          icon: "add",
          click() {
            Blockbench.showQuickMessage("CREATE NOTE");
          }
        });
        var edit_note = new Action("edit_note", {
          label: "Edit Note",
          icon: "pencil",
          click() {
            Blockbench.showQuickMessage("EDIT NOTE");
          }
        });
        var remove_note = new Action("remove_note", {
          label: "Remove Note",
          icon: "remove",
          click() {
            Blockbench.showQuickMessage("REMOVE NOTE");
          }
        });
        MenuBar.addAction(create_note, "edit");
        Cube.menu.addAction(create_note, "#manage");
        deleteables.push(create_note, edit_note, remove_note);
      },
      onunload() {
        deleteables.forEach((d) => d.delete());
      }
    });
  })();
})();
//# sourceMappingURL=object_notes.js.map
