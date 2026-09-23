import { PluginIntent } from "../intent";

const ID = "tweaks_n_stuff";
new PluginIntent("pin_tab", ID, {
  perform() {
    return undefined;
  },
});

new PluginIntent("unpin_tab", ID, {
  perform() {
    return undefined;
  },
});
