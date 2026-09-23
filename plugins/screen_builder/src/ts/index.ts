import "./languages";
import { VERSION, ID } from "./constants";

var deleteables: Deletable[] = [];
var format;
BBPlugin.register(ID, {
  title: "Screen Builder",
  author: "legopitstop",
  icon: "icon.png",
  description: "A visual editor for Minecraft: Bedrock GUIs",
  has_changelog: true,
  website: "https://docs.lpsmods.dev/screen_builder",
  repository: "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/screen_builder",
  variant: "both",
  version: VERSION,
  min_version: "4.8.0",
  tags: ["Blockbench"],
  new_repository_format: true,
  onload() {
    format = new ModelFormat("bedrock_screen", {
      icon: "monitor",
      category: "minecraft",
      show_on_start_screen: true,
      edit_mode: false,
      paint_mode: false,
      animation_mode: false,
      confidential: true,
      display_mode: false,
      image_editor: false,
      format_page: {
        button_text: "format.bedrock_screen.new",
        content: [{ text: tl("format.bedrock_screen.info.summary") }],
      },
      new() {
        newProject(this);
        return true;
      },
      onSetup() {
        console.warn("setup");
      },
      onActivation() {
        Interface.preview.classList.add("screen_mode");
        UVEditor.vue.hidden = false;
        // uv_editor_node = uv_editor_node ?? Panels.uv.node.firstChild;
        // Interface.preview.append(uv_editor_node);
        Panels.uv.update();
        Panels.textures.handle.firstChild.textContent = tl("panel.textures.images");
        console.warn("activate");
      },
      onDeactivation() {
        Interface.preview.classList.remove("screen_mode");
        // Panels.uv.node.append(uv_editor_node);
        Panels.textures.handle.firstChild.textContent = tl("panel.textures");
        setTimeout(Panels.uv.update, 0);
        console.warn("deactivate");
      },
    });
    deleteables.push(format);
  },
  onunload() {
    deleteables.forEach((d) => d.delete());
  },
});
