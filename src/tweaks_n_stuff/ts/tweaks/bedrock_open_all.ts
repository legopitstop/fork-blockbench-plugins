import { ToggleTweak } from "./base";

class BedrockOpenAllTweak extends ToggleTweak {
  constructor() {
    super("bedrock_open_all", { author: "legopitstop", category: "interface" });
  }

  // TODO: Open All
  private openAll(): void {
    console.log("OPEN ALL!");
  }

  // EVENTS

  onEnable(): void {
    const select = Blockbench.on("show_dialog", ({ dialog }) => {
      if (dialog.id !== "bedrock_model_select") return;
      const button_bar = dialog.object.getElementsByClassName("dialog_bar button_bar")[0];
      if (!button_bar) return;
      const btn = document.createElement("a");
      btn.text = tl("dialog.select_model.open_all");
      btn.style = "margin-right: auto; text-decoration: underline; cursor: pointer;";
      btn.onclick = () => {
        this.openAll();
        dialog.close();
      };
      button_bar.prepend(btn);
    });
    this.deleteables.push(select);
  }
}

new BedrockOpenAllTweak();
