// Global Audio Manager for Rock-Chic Invitation Experience
// Handles iOS Safari / WebKit AudioContext unlocking and HTMLAudioElement playback synchronously on user gesture

const AUDIO_SRC = '/audio/shiver.m4a';

class AudioManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.listeners = new Set();
    this.unlocked = false;
  }

  getAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.src = AUDIO_SRC;
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.playsInline = true;
      this.audio.setAttribute('playsinline', '');
      this.audio.setAttribute('webkit-playsinline', '');

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notify();
      });
    }
    return this.audio;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      cb(this.isPlaying);
    }
  }

  // Called immediately in user interaction (e.g. click to open envelope)
  unlockAndPlay() {
    const audio = this.getAudio();
    if (!audio) return;

    audio.volume = 1;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.unlocked = true;
          this.isPlaying = true;
          this.notify();
        })
        .catch((err) => {
          console.log('Audio autoplay prevented, awaiting gesture:', err);
          this.isPlaying = false;
          this.notify();
        });
    }
  }

  play() {
    this.unlockAndPlay();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

export const globalAudio = new AudioManager();
