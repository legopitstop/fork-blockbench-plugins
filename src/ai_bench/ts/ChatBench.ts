import { Service } from "./services/index.js";

export class ChatBench {
  static thinking = false;
  static disabled = false;
  static messages = [];

  static add(msg) {
    if (msg.hidden === undefined) {
      msg.hidden = false;
    }
    this.messages.push(msg);
  }

  static sendError(err) {
    this.messages.push({ role: "system", content: err, color: "#f01e2c" });
  }

  static sendMessage(content, role = "user") {
    if (ChatBench.disabled || ChatBench.thinking) return;
    if (content.toLowerCase() == "/clear") {
      ChatBench.clear();
      if (Service.selected?.prompt) {
        ChatBench.add({
          role: "system",
          hidden: true,
          content: Service.selected.prompt,
        });
      }
      return;
    }
    ChatBench.thinking = true;
    let data = { role: role, content: content, images: [] };
    // TODO: Should be toggleble in settings.
    // Add screenshot of model.
    Screencam.screenshotPreview(Preview.selected, {}, (res) => {
      let base = res.replace('data:image/png;base64,', '')
      data.images.push(base);
    });
    this.add(data);
    try {
      Service.selected?.onMessage(data);
    } catch (err) {
      ChatBench.sendError(err);
      console.error(err);
    } finally {
      ChatBench.thinking = false;
    }
  }

  static delete() {
    ChatBench.panel.delete();
  }

  static clear() {
    this.thinking = false;
    this.messages.empty();
  }
}

ChatBench.panel = new Panel("ai_chat", {
  icon: "auto_awesome",
  default_position: {
    slot: "right_bar",
    float_position: [0, 0],
    float_size: [400, 300],
    height: 300,
    folded: false,
  },
  toolbars: [
    new Toolbar({
      id: 'ai_chat',
      children: [
        'ai_options',
        'ai_service_options'
      ]
    })
  ],
  growable: true,
  resizable: true,
  component: {
    name: "panel_ai",
    data: {
      messages: ChatBench.messages,
      thinking: ChatBench.thinking,
      disabled: ChatBench.disabled,
      info: ChatBench.info,
      content: "",
    },
    methods: {
      getUsername(role) {
        return role == "user" ? Settings.get("username") : "AIBench";
      },
      sendMessage() {
        if (!this.content) return;
        ChatBench.sendMessage(this.content);
        this.content = "";
      }
    },
    template: `<div>
      <ul id="ai_history">
        <li v-for="msg in messages" :key="msg.id">
          <div v-if="!msg.hidden">
            <b :class="msg.role">{{ getUsername(msg.role) }}</b>
            <span class="text" v-html="marked(msg.content)"></span>
          </div>
        </li>
      </ul>
      <div id="ai_chat_bar">
       <input type="text" id="ai_chat_input" maxlength="512" class="dark_bordered f_left" v-model="content" @keyup.enter="sendMessage" :disabled="disabled">
       <i class="material-icons" @click="sendMessage">send</i>
      </div>
    </div>`,
  },
});
