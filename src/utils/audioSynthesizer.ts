/**
 * Procedural Web Audio synthesizer for ambient sound effects and transitions.
 * Does not require external audio files, works completely offline and instantly.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isMuted: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : 0.15, this.ctx?.currentTime || 0, 0.2);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Camera whoosh transition sound when shifting between workstations
  public playTransitionWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Filtered noise swoosh
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.6);

      // Add a subtle tonal chime
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now + 0.1); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.35); // E5

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.05);
      osc.stop(now + 0.55);
    } catch {
      // AudioContext might be restricted until user gesture
    }
  }

  // Soft tap / UI click
  public playClick(pitch: number = 600) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.4, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Interactive hotspot discovery chime
  public playHotspotPing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Switch continuous ambience based on station type
  public updateStationAmbience(ambience: string) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    try {
      // We can synthesize a warm, low-level drone/pink noise filter matching the room
      if (this.ambientGain && this.ambientOsc) {
        const now = this.ctx.currentTime;
        let baseFreq = 110; // A2
        if (ambience === 'coffee-chatter') baseFreq = 146.83; // D3
        if (ambience === 'rooftop-breeze') baseFreq = 82.41; // E2
        if (ambience === 'creative-music') baseFreq = 130.81; // C3

        this.ambientOsc.frequency.setTargetAtTime(baseFreq, now, 0.5);
      }
    } catch {
      // ignore
    }
  }
}

export const audioSystem = new AudioSynthesizer();
