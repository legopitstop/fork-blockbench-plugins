import { ToggleTweak } from "./index.js";

class HeaderColorTweak extends ToggleTweak {
  constructor() {
    super(
      "header_color",
      "legopitstop",
      "interface"
    );
  }

  update() {
    if (this.rootStyle) this.rootStyle.delete();
    if (SettingsProfile.selected == null) {
      this.rootStyle = Blockbench.addCSS(
        `:root{--color-header-bg:var(--color-frame);--color-header-text:var(--color-text);--filter-corner-logo:unset;}`
      );
      return;
    }
    const color1 = markerColors[SettingsProfile.selected.color].standard;
    const color2 = tinycolor
      .mostReadable(new tinycolor(color1), ["#333", "#ddd"])
      .toHexString();
    const filter =
      color2 == "#333333"
        ? "invert(100%) sepia(0%) saturate(6873%) hue-rotate(217deg) brightness(113%) contrast(73%)"
        : "invert(19%) sepia(10%) saturate(12%) hue-rotate(314deg) brightness(98%) contrast(96%)";
    this.rootStyle = Blockbench.addCSS(
      `:root{--color-header-bg:${color1};--color-header-text:${color2};--filter-corner-logo:${filter};}`
    );
  }

  onEnable() {
    this.update();
    const css = Blockbench.addCSS(
      `div#corner_logo{filter:var(--filter-corner-logo);}header{background-color:var(--color-header-bg)}header>*{color:var(--color-header-text) !important;}`
    );
    this.deleteables.push(
      Blockbench.on("profile_changed", this.update.bind(this)),
      css
    );
  }

  onDisable() {
    if (!this.rootStyle) return;
    this.rootStyle.delete();
  }
}

ToggleTweak.register(new HeaderColorTweak());
