import "./languages.js";
import { ChatBench } from "./ChatBench.js";
import { VERSION, ID } from "./constants.js";
import { Service } from "./services/index.js";
import { modelAction, serviceAction } from "./actions.js";

// Import Services
import "./services/ollama.js";
import "./services/openai.js";

(function () {
  const serviceOptions = {};
  var deleteables = [];

  BBPlugin.register(ID, {
    title: "AI Bench",
    author: "legopitstop",
    icon: "icon.png",
    description: "Your Blockbench AI assistant. (Supports Ollama)",
    has_changelog: true,
    website: "https://docs.lpsmods.dev/ai_bench",
    repository:
      "https://github.com/legopitstop/blockbench-plugins/tree/master/src/ai_bench",
    variant: "both",
    version: VERSION,
    min_version: "4.8.0",
    tags: ["Blockbench", "AI"],
    new_repository_format: true,

    oninstall() {
      Service.all.forEach((service) => service.install());
    },
    onuninstall() {
      Service.all.forEach((service) => service.uninstall());
    },

    onload() {
      // Service.all.forEach((service) => service.load());
      // TODO:
      // - Service.selected.

      let style =
        Blockbench.addCSS(`#ai_history{background:var(--color-back);color:var(--color-text);padding:5px;font-size:12pt;overflow-y:scroll;overflow-x:hidden;word-break:break-word;min-height:81px;}
        #ai_history li{padding-top:1px;padding-left:7px;clear:both;}
        #ai_history li b.user{color:var(--color-accent_text);background-color:var(--color-accent);}
        #ai_history li b{margin-left:-6px;border-radius:4px;padding:1px 4px;background-color:var(--color-button);}
        #ai_chat_bar{height:32px;margin-bottom:6px;margin-top:5px;}
        #ai_chat_input{padding:5px;width:calc(100% - 36px);margin-left:2px;}
        `);

      // Load services
      for (let service of Service.all) {
        serviceOptions[service.id] = service.name;
      }

      // var service = new Setting("ai_service", {
      //   icon: "auto_awesome",
      //   category: "general",
      //   type: "select",
      //   // value: "unset",
      //   options: serviceOptions,
      //   onChange(id) {
      //     ChatBench.disabled = false;
      //     Service.all.forEach((service) => service.unload());
      //     if (!id) {
      //       ChatBench.sendError("No service selected!");
      //       ChatBench.disabled = true;
      //       return;
      //     }
      //     Service.all.find((service) => service.id === id)?.load();
      //   },
      // });
      // var serviceConfig = new Setting("ai_service_options", {
      //   icon: "auto_awesome",
      //   category: "general",
      //   type: "click",
      //   click() {
      //     if (Service.selected == null) {
      //       return Blockbench.showQuickMessage("No service selected!");
      //     }
      //     Service.selected.show();
      //   },
      // });
      deleteables.push(style, modelAction, serviceAction);

      // Load service
      if (Settings.get("ai_service") == "unset") {
        // TODO: If no service send this msg.
        ChatBench.sendError("No service selected!");
        ChatBench.disabled = true;
        return;
      }
      Service.all
        .find((service) => service.id == Settings.get("ai_service"))
        ?.load();
    },
    onunload() {
      Service.all.forEach((service) => service.unload());
      deleteables.forEach((d) => d.delete());
      ChatBench.delete();
      modelAction.delete();
      serviceAction.delete();
    },
  });
})();
