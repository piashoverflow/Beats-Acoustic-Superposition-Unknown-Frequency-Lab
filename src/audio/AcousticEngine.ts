export class AcousticEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gain1: GainNode | null = null;
  private gain2: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public start(f1: number, f2: number, a1: number, a2: number, volume: number): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    if (this.isPlaying) {
      this.update(f1, f2, a1, a2, volume);
      return;
    }

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    // Keep gain comfortable for two summed sine waves
    master.gain.linearRampToValueAtTime(Math.max(0.0001, volume * 0.25), now + 0.06);
    master.connect(ctx.destination);

    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(a1 * 0.5, now);
    g1.connect(master);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(a2 * 0.5, now);
    g2.connect(master);

    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(f1, now);
    o1.connect(g1);

    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(f2, now);
    o2.connect(g2);

    o1.start(now);
    o2.start(now);

    this.masterGain = master;
    this.gain1 = g1;
    this.gain2 = g2;
    this.osc1 = o1;
    this.osc2 = o2;
    this.isPlaying = true;
  }

  public update(f1: number, f2: number, a1: number, a2: number, volume: number): void {
    if (!this.isPlaying || !this.ctx || !this.osc1 || !this.osc2 || !this.gain1 || !this.gain2 || !this.masterGain) {
      return;
    }
    const now = this.ctx.currentTime;
    this.osc1.frequency.setTargetAtTime(f1, now, 0.015);
    this.osc2.frequency.setTargetAtTime(f2, now, 0.015);
    this.gain1.gain.setTargetAtTime(a1 * 0.5, now, 0.015);
    this.gain2.gain.setTargetAtTime(a2 * 0.5, now, 0.015);
    this.masterGain.gain.setTargetAtTime(Math.max(0.0001, volume * 0.25), now, 0.02);
  }

  public stop(): void {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const master = this.masterGain;
    const o1 = this.osc1;
    const o2 = this.osc2;

    if (master) {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.0001, now + 0.05);
    }

    window.setTimeout(() => {
      try {
        o1?.stop();
        o2?.stop();
        o1?.disconnect();
        o2?.disconnect();
        master?.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    }, 70);

    this.osc1 = null;
    this.osc2 = null;
    this.gain1 = null;
    this.gain2 = null;
    this.masterGain = null;
    this.isPlaying = false;
  }

  public playChime(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const acousticEngine = new AcousticEngine();
