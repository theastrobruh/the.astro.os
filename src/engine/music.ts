import { RADIO_PRESETS } from '../constants/defaults';

interface LocalTrack {
  name: string;
  url: string;
}

type MusicMode = 'radio' | 'local' | 'synth';

class GlobalMusicService {
  private audio: HTMLAudioElement | null = null;
  private synthCtx: AudioContext | null = null;
  private synthTimer: number | null = null;

  public mode: MusicMode = 'radio';
  public activeRadioIdx = 0;
  public localTracks: LocalTrack[] = [];
  public localIdx = 0;
  public isPlaying = false;
  public currentTime = 0;
  public duration = 0;
  public volume = 0.7;
  public statusNote = 'Ready to play';

  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.volume = this.volume;

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.currentTime = this.audio.currentTime;
          this.notify();
        }
      });
      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio) {
          this.duration = this.audio.duration;
          this.notify();
        }
      });
      this.audio.addEventListener('ended', () => {
        if (this.mode === 'local' && this.localTracks.length > 0) {
          this.playLocal((this.localIdx + 1) % this.localTracks.length);
        }
      });
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getCurrentTitle(): string {
    if (this.mode === 'synth') return 'Astro Ambient Synth (Local Procedural)';
    if (this.mode === 'local' && this.localTracks[this.localIdx]) return this.localTracks[this.localIdx].name;
    return RADIO_PRESETS[this.activeRadioIdx]?.name || 'Cosmic Station';
  }

  public getCurrentSub(): string {
    if (this.mode === 'synth') return 'Web Audio Synth · Offline';
    if (this.mode === 'local') return 'Local Audio File';
    return `${RADIO_PRESETS[this.activeRadioIdx]?.genre || 'Online'} · Live Stream`;
  }

  public stopSynth() {
    if (this.synthTimer !== null) {
      window.clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  public startSynth() {
    this.stopSynth();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.synthCtx) this.synthCtx = new AudioCtx();
    const ctx = this.synthCtx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const pentatonic = [196, 220, 261.63, 293.66, 329.63, 392, 440, 523.25];
    const playNote = () => {
      const now = ctx.currentTime;
      const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    };

    playNote();
    this.synthTimer = window.setInterval(playNote, 620);
    this.isPlaying = true;
    this.statusNote = 'Cosmic Synth Active';
    this.notify();
  }

  public playRadio(idx: number) {
    this.stopSynth();
    this.activeRadioIdx = idx;
    this.mode = 'radio';
    if (!this.audio) return;
    this.statusNote = 'Connecting stream...';
    this.audio.src = RADIO_PRESETS[idx].url;
    this.audio.volume = this.volume;
    this.notify();
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.statusNote = 'Streaming Live';
        this.notify();
      })
      .catch(() => {
        this.isPlaying = false;
        this.statusNote = 'Stream error, fallback to Synth';
        this.mode = 'synth';
        this.startSynth();
      });
  }

  public playLocal(idx: number, list = this.localTracks) {
    if (!list[idx]) return;
    this.stopSynth();
    this.localTracks = list;
    this.localIdx = idx;
    this.mode = 'local';
    if (!this.audio) return;
    this.audio.src = list[idx].url;
    this.audio.volume = this.volume;
    this.notify();
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.statusNote = 'Playing local file';
        this.notify();
      })
      .catch(() => {
        this.isPlaying = false;
        this.statusNote = 'Could not play track';
        this.notify();
      });
  }

  public togglePlay() {
    if (this.mode === 'synth') {
      if (this.isPlaying) {
        this.stopSynth();
        this.isPlaying = false;
        this.statusNote = 'Paused';
      } else {
        this.startSynth();
      }
      this.notify();
      return;
    }

    if (!this.audio) return;
    if (!this.audio.src) {
      this.playRadio(this.activeRadioIdx);
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.statusNote = 'Paused';
      this.notify();
    } else {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.statusNote = this.mode === 'radio' ? 'Streaming Live' : 'Playing';
          this.notify();
        })
        .catch(() => {
          this.mode = 'synth';
          this.startSynth();
        });
    }
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.audio) {
      this.audio.volume = val;
    }
    this.notify();
  }

  public seek(secs: number) {
    if (this.audio && Number.isFinite(secs)) {
      this.audio.currentTime = secs;
      this.currentTime = secs;
      this.notify();
    }
  }

  public stopCompletely() {
    this.stopSynth();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    this.isPlaying = false;
    this.statusNote = 'Stopped';
    this.notify();
  }
}

export const globalMusic = new GlobalMusicService();
