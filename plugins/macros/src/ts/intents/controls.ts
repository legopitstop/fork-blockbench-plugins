/// <reference types="blockbench-types" />

import { Intent, IntentParameterTypes } from "../intent";

enum AppearanceOperation {
  Turn = "turn",
  Toggle = "toggle",
}
enum AppearanceMode {
  Dark = "dark",
  Light = "light",
}

// TODO: Implement
new Intent("set_appearance", {
  category: 'controls',
  parameters: [
    {
      name: "op",
      type: IntentParameterTypes.Enum,
    },
    {
      name: "mode",
      type: IntentParameterTypes.Enum,
    },
  ],
  perform() {
    return undefined;
  },
  summary: (params) => {
    return tl(`macros.set_appearance.${params.op}`);
  },
})
  .addEnum("op", Object.values(AppearanceOperation))
  .addEnum("mode", Object.values(AppearanceMode));

// TODO: Implement
new Intent("take_screenshot", {
  category: 'controls',
  perform() {
    return undefined;
  },
});
