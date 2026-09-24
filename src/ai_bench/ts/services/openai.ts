import OpenAI from "openai";
import { CloudService } from "./index.js";
import { toTitleCase } from "../utils.js";

class OpenAIService extends CloudService {
  constructor() {
    super("openai", "legopitstop", "both", 'https://openai.com/policies/privacy-policy');
  }

  async onLoad() {
    // TODO:
    // - Check if API key exists.
    //  - if not prompt user to add key.
    // Chat.sendError('Please provide an API key!')
    // Chat.disabled = true;
    // this.client = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
    // for (let model of this.client.models) {
    //   console.log(model);
    //   let name = toTitleCase(model.replace(/-/gm, ' '))
    //   this.addCheckpoint(name, model);
    // }
    // this.completion = this.client.chat.completions.create({
    //   messages: [{ role: "user", content: "Say this is a test." }],
    //   model: "gpt-4o",
    // });
    // this.deleteables.push(this.client);
  }

  onUnload() {
    this.checkpoints = {};
  }

  onUninstall() {
    // TODO: Remove API key
    // localStorage.removeItem(this.getId('apiKey'));
    localStorage.removeItem(this.getId("checkpoint"));
  }

  show() {
    new Dialog("openai_config", {
      title: "OpenAI Config",
      form: {
        apiKey: { type: "text", label: "API key" },
        checkpoint: {
          type: "select",
          label: "AI Model",
          options: this.checkpoints,
        },
      },
      onConfirm(res) {
        console.log(res); // Save key to cookies.
        localStorage.setItem(this.getId("checkpoint"), res.checkpoint);
      },
    }).show();
  }
}

CloudService.register(new OpenAIService());
