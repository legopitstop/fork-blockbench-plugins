/**
 * Base sound event class.
 */
export class SoundEvent {
  static all = new Set();

  constructor(id) {
    this.id = id;
    this.sounds = [];
  }

  /**
   * Adds a new sound file to this sound event.
   * @param {String} src
   */
  addSound(src, volume = 1.0, pitch = 1.0, weight = 1.0) {
    this.sounds.push({
      audio: new Audio(src),
      volume: volume,
      pitch: pitch,
      weight: weight,
    });
  }

  /**
   * Play this sound.
   */
  play() {
    // Play random sound.
    // this.audios.play();
  }

  /**
   * Stop this sound.
   */
  stop() {
    // this.audios.stop();
  }

  /**
   * Delete this sound.
   */
  delete() {}

  /**
   * Register a sound event.
   * @param {SoundEvent} soundEventClass
   * @returns
   */
  static register(soundEventClass) {
    if (soundEventClass == SoundEvent) return;
    SoundEvent.all.add(soundEventClass);
  }
}
