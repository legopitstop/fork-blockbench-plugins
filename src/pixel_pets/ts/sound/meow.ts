import { SoundEvent } from "./index.js";

class MeowSoundEvent extends SoundEvent {
  constructor() {
    super("meow");
    this.addSound("meow1.ogg");
    this.addSound("meow2.ogg");
    this.addSound("meow3.ogg");
  }
}

SoundEvent.register(new MeowSoundEvent());
