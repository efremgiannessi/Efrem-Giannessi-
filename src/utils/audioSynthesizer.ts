/**
 * Procedural Web Audio synthesizer for ambient sound effects, continuous office soundscape, and transitions.
 * Does not require external audio files, works completely offline and instantly.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private isMuted: boolean = false; // Start with unmuted or user toggle
  private masterVolume: number = 0.65; // 0.0 - 1.0
  private currentAmbienceType: string = 'default';
  private rainNoiseNode: AudioBufferSourceNode | null = null;
  private rainGainNode: GainNode | null = null;
  private isRainActive: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(
          this.isMuted ? 0 : this.masterVolume,
          this.ctx.currentTime
        );
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Master Volume Controls (0.0 to 1.0)
  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.init();

    if (this.masterVolume === 0) {
      this.setMuted(true);
      return;
    }

    if (this.isMuted && this.masterVolume > 0) {
      this.isMuted = false;
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.masterVolume, now, 0.05);
    }

    if (!this.isMuted && !this.ambientGain) {
      this.startContinuousOfficeAmbience();
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.init();

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      const targetGain = muted ? 0 : this.masterVolume;
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.05);
    }

    if (!muted) {
      this.startContinuousOfficeAmbience();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Continuous procedural office ambient soundscape (HVAC air circulation, subtle room presence, soft acoustic warmth)
   */
  public startContinuousOfficeAmbience() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // If already running, ensure volume is up
    if (this.ambientGain) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setTargetAtTime(0.18, now, 0.3);
      return;
    }

    try {
      const now = this.ctx.currentTime;

      // 1. Ambient Gain node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.18, now + 1.2);

      // 2. Lowpass filter for smooth, warm acoustic room tone
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(320, now);
      this.ambientFilter.Q.setValueAtTime(1.2, now);

      // 3. Pink noise buffer for soft ventilation air flow / room presence
      const bufferSize = this.ctx.sampleRate * 4; // 4 second looping buffer
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      // 4. Subtle harmonic room resonance (harmonic warmth of a quiet professional office)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now); // A2 fundamental

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, now); // E3 fifth
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.04, now);

      osc2.connect(osc2Gain);
      osc2Gain.connect(this.ambientFilter);

      noise.connect(this.ambientFilter);
      osc1.connect(this.ambientFilter);

      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      noise.start(now);
      osc1.start(now);
      osc2.start(now);

      this.noiseSource = noise;
      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
    } catch {
      // AudioContext might require initial user gesture
    }
  }

  // Camera whoosh transition sound when shifting between workstations
  public playTransitionWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

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
      gain.connect(this.masterGain);

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
      oscGain.connect(this.masterGain);
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
    if (!this.ctx || !this.masterGain) return;

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
      gain.connect(this.masterGain);

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
    if (!this.ctx || !this.masterGain) return;

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
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Melodic chime for time-synchronization and lighting mode shifts
  public playChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Active Theory signature high-frequency tech hover blip
  public playTechHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.035);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // ignore
    }
  }

  // Active Theory project card momentum glide / whoosh
  public playCardSlide() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.18);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // ignore
    }
  }

  // Active Theory subtle digital glitch artifact
  public playGlitch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 600, now);
      osc.frequency.setValueAtTime(300 + Math.random() * 400, now + 0.02);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Cinematic Sub-Bass rumble for monumental intro initialization
  public playIntroRumble() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(35, now + 2.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, now);
      filter.frequency.linearRampToValueAtTime(180, now + 0.8);
      filter.frequency.exponentialRampToValueAtTime(60, now + 2.0);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch {
      // ignore
    }
  }

  // High-tech laser sweep / scanline sound
  public playLaserScan() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // ignore
    }
  }

  // Telemetry boot beep with frequency parameter
  public playBootBeep(freq = 1400) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // Epic warp-out whoosh on entering the site
  public playWarpOut() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Bass drop whoosh
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.8);

      // 2. High harmonic chord release (C5, G5, E6)
      const chordNotes = [523.25, 783.99, 1318.51, 2093.0];
      chordNotes.forEach((freq, idx) => {
        const chordOsc = this.ctx!.createOscillator();
        const chordGain = this.ctx!.createGain();

        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, now + idx * 0.04);

        chordGain.gain.setValueAtTime(0.001, now);
        chordGain.gain.linearRampToValueAtTime(0.05, now + idx * 0.04 + 0.03);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.9);

        chordOsc.connect(chordGain);
        chordGain.connect(this.masterGain!);

        chordOsc.start(now + idx * 0.04);
        chordOsc.stop(now + idx * 0.04 + 0.95);
      });
    } catch {
      // ignore
    }
  }

  // Interactive shockwave dispersion ripple sound
  public playShockwave() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Telemetry harmonic arpeggio when interacting with frequency chips
  public playTelemetryArp(baseFreq: number = 880) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const ratios = [1, 1.25, 1.5, 2.0];
      ratios.forEach((r, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * r, now + i * 0.035);

        gain.gain.setValueAtTime(0.001, now + i * 0.035);
        gain.gain.linearRampToValueAtTime(0.035, now + i * 0.035 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.18);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + i * 0.035);
        osc.stop(now + i * 0.035 + 0.19);
      });
    } catch {
      // ignore
    }
  }

  // Switch continuous ambience based on station type
  public updateStationAmbience(ambience: string) {
    this.currentAmbienceType = ambience;
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      if (!this.ambientGain) {
        this.startContinuousOfficeAmbience();
      }

      if (this.ambientFilter && this.ambientOsc1 && this.ambientOsc2) {
        const now = this.ctx.currentTime;
        let baseFreq = 110; // A2
        let filterCutoff = 320;

        if (ambience === 'coffee-chatter' || ambience === 'contacts') {
          baseFreq = 146.83; // D3
          filterCutoff = 550;
        } else if (ambience === 'creative-music' || ambience === 'rendering') {
          baseFreq = 130.81; // C3
          filterCutoff = 480;
        } else if (ambience === 'code-typing' || ambience === 'plugins') {
          baseFreq = 123.47; // B2
          filterCutoff = 420;
        }

        this.ambientOsc1.frequency.setTargetAtTime(baseFreq, now, 0.5);
        this.ambientOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.5);
        this.ambientFilter.frequency.setTargetAtTime(filterCutoff, now, 0.6);
      }
    } catch {
      // ignore
    }
  }

  // Toggle ambient weather soundscape (relaxing soft rain on glass / window panes)
  public toggleRainSoundscape(enable?: boolean): boolean {
    const targetState = enable !== undefined ? enable : !this.isRainActive;
    this.isRainActive = targetState;
    this.init();

    if (!this.ctx || !this.masterGain) return this.isRainActive;

    try {
      const now = this.ctx.currentTime;
      if (this.isRainActive) {
        if (!this.rainGainNode) {
          // Generate realistic pink/brown filtered noise for rain soundscape
          const bufferSize = this.ctx.sampleRate * 3;
          const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
          for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              // Brown-pink integration for soft precipitation texture
              lastOut = (lastOut + 0.02 * white) / 1.02;
              data[i] = lastOut * 1.5;
            }
          }

          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          noise.loop = true;

          // Bandpass filter centered at gentle rain frequencies (1200Hz)
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1150, now);
          filter.Q.setValueAtTime(0.8, now);

          const rainGain = this.ctx.createGain();
          rainGain.gain.setValueAtTime(0.001, now);
          rainGain.gain.linearRampToValueAtTime(0.12, now + 1.2);

          noise.connect(filter);
          filter.connect(rainGain);
          rainGain.connect(this.masterGain);

          noise.start(now);
          this.rainNoiseNode = noise;
          this.rainGainNode = rainGain;
        } else {
          this.rainGainNode.gain.cancelScheduledValues(now);
          this.rainGainNode.gain.setTargetAtTime(0.12, now, 0.5);
        }
      } else {
        if (this.rainGainNode) {
          this.rainGainNode.gain.cancelScheduledValues(now);
          this.rainGainNode.gain.setTargetAtTime(0.0001, now, 0.4);
        }
      }
    } catch {
      // Audio context might be suspended
    }

    return this.isRainActive;
  }

  public getRainActive(): boolean {
    return this.isRainActive;
  }

  public unlockAudio() {
    this.isMuted = false;
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const audioSystem = new AudioSynthesizer();

// Ensure audio is ALWAYS active on any user gesture/interaction
if (typeof window !== 'undefined') {
  const activateAudio = () => {
    audioSystem.unlockAudio();
    window.removeEventListener('pointerdown', activateAudio);
    window.removeEventListener('touchstart', activateAudio);
    window.removeEventListener('scroll', activateAudio);
    window.removeEventListener('wheel', activateAudio);
    window.removeEventListener('keydown', activateAudio);
    window.removeEventListener('mousemove', activateAudio);
  };

  window.addEventListener('pointerdown', activateAudio, { passive: true });
  window.addEventListener('touchstart', activateAudio, { passive: true });
  window.addEventListener('scroll', activateAudio, { passive: true });
  window.addEventListener('wheel', activateAudio, { passive: true });
  window.addEventListener('keydown', activateAudio, { passive: true });
  window.addEventListener('mousemove', activateAudio, { passive: true });
}
