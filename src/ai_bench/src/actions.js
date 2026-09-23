export const modelAction = new Action("change_ai_model", {
  category: "blockbench",
  icon: "auto_awesome",
  click() {
    new Dialog("change_ai_model", {
      title: tl("action.change_ai_model"),
      form: {
        info: { type: "info", text: "action.change_ai_model.info" },
        model: { type: "select", options: { none: "None" } },
        manage: {
          type: "buttons",
          buttons: ["Manage"],
          click(res) {
            console.log(res);
          },
        },
      },
      onConfirm(res) {
        console.log(res);
      },
    }).show();
  },
});

export const serviceAction = new Action("ai_service_options", {
  category: "blockbench",
  icon: "settings",
  click() {
    new Dialog("ai_service_options", {
      title: tl("action.ai_service_options"),
      form: {
        info: { type: "info", text: "action.ai_service_options.info" },
        service: {
          type: "select",
          label: "Service",
          options: { none: "None" },
        },
      },
      onConfirm(res) {
        console.log(res);
      },
    }).show();
  },
});
