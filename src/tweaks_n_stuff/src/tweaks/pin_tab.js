import { ID } from "../constants.js";
import { ToggleTweak } from "./index.js";

// TODO:
// - Make close icn the pinned keep icon.
class PinTabTweak extends ToggleTweak {
  constructor() {
    super("pin_tab", "legopitstop", "interface");
  }

  setup() {
    super.setup();
    var pinSeparateRow = new Setting("pin_separate_row", {
      value: false,
      category: "interface",
    });
    pinSeparateRow.plugin = ID;
    var pinSizing = new Setting("pin_sizing", {
      type: "select",
      category: "interface",
      value: "normal",
      options: {
        normal: "Normal",
        compact: "Compact",
        shrink: "Shrink",
      },
    });
    pinSizing.plugin = ID;
    this.deleteables.push(pinSeparateRow, pinSizing);
  }

  // TODO: Move tab to the left until it reaches pinned tabs.
  pinTab() {
    Blockbench.showQuickMessage("Pinned Tab!");
    Project.pinned = true;
  }

  // TODO: Move tab to right until it reaches non-pinned tabs.
  unpinTab() {
    Blockbench.showQuickMessage("Unpinned Tab!");
    Project.pinned = false;
  }

  onEnable() {
    ModelProject.prototype.pinned = false;
    var pinAction = new Action("pin_tab", {
      icon: "push_pin",
      condition: () => !Project.pinned,
      click: this.pinTab.bind(this),
    });
    var unpinTab = new Action("unpin_tab", {
      icon: "push_pin",
      condition: () => Project.pinned,
      click: this.unpinTab.bind(this),
    });
    ModelProject.prototype.menu.addAction(pinAction, "#manage");
    ModelProject.prototype.menu.addAction(unpinTab, "#manage");

    this.deleteables.push(pinAction, unpinTab);
  }

  onDisable() {
    delete ModelProject.prototype.pinned;
  }
}

ToggleTweak.register(new PinTabTweak());
