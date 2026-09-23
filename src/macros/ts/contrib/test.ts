// TODO: For testing
import { PluginIntent } from "../intent";

const ID = "asset_browser";
new PluginIntent("open_asset_browser", ID, {
  category: "test",
  perform() {
    return undefined;
  },
});
