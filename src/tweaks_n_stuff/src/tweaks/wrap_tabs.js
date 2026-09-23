import { ToggleTweak } from "./index.js";

class WrapTabsTweak extends ToggleTweak {
  constructor() {
    super(
      "wrap_tabs",
      "legopitstop",
      "interface"
    );
  }
  
  onEnable() {
    this.css = Blockbench.addCSS(
      `#tab_bar #tab_bar_list{overflow-y:none;scrollbar-width:auto;flex-wrap:wrap;}#tab_bar{height:auto;align-items:center;}#tab_bar .project_tab{height:32px}#search_tab_button{height:auto;}`
    );
    this.deleteables.push(this.css);
  }
}

ToggleTweak.register(new WrapTabsTweak());
