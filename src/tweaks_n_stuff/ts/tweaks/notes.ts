import { ToggleTweak } from "./base";

class NotesTweak extends ToggleTweak {
  private static panel: Panel;
  private static originalCompile: (options: any) => any;
  private static originalParse: (model: any, path: string) => any;

  constructor() {
    super("notes", { author: "legopitstop", category: "general" });
  }

  private static injectCompile(options: any): any {
    const res = NotesTweak.originalCompile.apply(Codecs.project, [options]);
    try {
      const data = JSON.parse(res);
      data.notes = NotesTweak.panel.vue.notes ?? "";
      return JSON.stringify(data);
    } catch (err) {
      return res;
    }
  }

  private static injectParse(model: any, path: string): any {
    NotesTweak.originalParse.apply(Codecs.project, [model, path]);
    Project.notes = model.notes ?? "";
    NotesTweak.panel.vue.notes = Project.notes;
    return;
  }

  // EVENTS

  onEnable() {
    const css = `#note_editor .preview {height: calc(var(--main-panel-height) - 143px);overflow: auto;}
    .note_editor {
		height: calc(100vh - 228px);
		display: flex;
		flex-direction: column;
	}
	.note_editor > .prism-editor-component {
		flex-grow: 1;
	}`;
    const noteEditorMode = new BarSelect("note_editor_mode", {
      // @ts-ignore
      icon_mode: true,
      options: {
        source: { name: true, icon: "code" },
        reading: { name: true, icon: "menu_book" },
      },
      onChange() {
        NotesTweak.panel.vue.mode = this.value;
      },
    });
    NotesTweak.panel = new Panel("note", {
      icon: "note",
      resizable: true,
      growable: true,
      default_position: {
        slot: "right_bar",
        float_position: [0, 2],
        float_size: [300, 400],
        height: 400,
      },
      toolbars: [
        new Toolbar("note_editor", {
          children: ["note_editor_mode"],
        }),
      ],
      component: {
        data: {
          mode: noteEditorMode.value,
          notes: "",
        },
        methods: {
          formatNote(text: string): string {
            return pureMarked(text);
          },
        },
        components: {
          VuePrismEditor,
        },
        template: `<div id="note_editor">
            <div v-if="mode==='reading'">
                <div class="preview markdown" v-html="formatNote(notes)"></div>
            </div>

            <div v-if="mode==='source'">
                <vue-prism-editor v-model="notes" language="markdown" class="note_editor" />
            </div>
        </div>`,
      },
    });
    const select = Blockbench.on("select_project", () => {
      NotesTweak.panel.vue.notes = Project.notes;
    });
    const unselect = Blockbench.on("unselect_project", ({ project }) => {
      project.notes = NotesTweak.panel.vue.notes;
    });
    const save = Blockbench.on("save_project", () => {
      Project.notes = NotesTweak.panel.vue.notes;
    });

    ModelProject.prototype.notes = "";

    // Inject compile
    NotesTweak.originalCompile = Codecs.project.compile;
    Codecs.project.compile = NotesTweak.injectCompile;

    // Inject parse
    NotesTweak.originalParse = Codecs.project.parse;
    Codecs.project.parse = NotesTweak.injectParse;

    this.deleteables.push(Blockbench.addCSS(css), noteEditorMode, NotesTweak.panel, select, unselect, save);
  }

  onDisable(): void {
    Codecs.project.compile = NotesTweak.originalCompile;
    Codecs.project.parse = NotesTweak.originalParse;
  }
}

new NotesTweak();
