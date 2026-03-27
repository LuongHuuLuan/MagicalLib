'use client';

class AudioSystem {
  private static instance: AudioSystem;
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.bgmAudio = new Audio('/audio/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.35;
    }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  /** Phát nhạc nền cổ tích (Dance of the Sugar Plum Fairy - Tchaikovsky) */
  public playBGM() {
    this.bgmAudio?.play().catch(() => console.log('BGM: waiting for user interaction'));
  }

  public pauseBGM() {
    this.bgmAudio?.pause();
  }

  /** Sinh âm hiệu ứng theo loại */
  public playSFX(name: string) {
    if (typeof window === 'undefined') return;
    const ctx = this.getCtx();

    const sfxMap: Record<string, () => void> = {
      hover: () => this._playTone(ctx, 880, 0.05, 0.12, 'sine'),
      open:  () => this._playSweep(ctx, 300, 900, 0.12, 0.5),
      page:  () => this._playTone(ctx, 440, 0.1, 0.25, 'triangle'),
      swoosh:() => this._playSweep(ctx, 600, 200, 0.15, 0.3),
      sparkle:()=> this._playChime(ctx),
    };

    sfxMap[name]?.();
  }

  private _playTone(ctx: AudioContext, freq: number, vol: number, dur: number, type: OscillatorType) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  private _playSweep(ctx: AudioContext, startFreq: number, endFreq: number, vol: number, dur: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  private _playChime(ctx: AudioContext) {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.5);
    });
  }
}

export const audioSystem = AudioSystem.getInstance();
