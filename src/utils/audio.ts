// Web Speech Synthesis and Web Audio API synthesizer for kids learning

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    // Lazy init speech voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.selectBestVoice();
      };
      this.selectBestVoice();
    }
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private selectBestVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer high quality English voices (US, GB)
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Samantha') || 
      v.name.includes('Daniel') ||
      v.name.includes('Karen')
    ) || enVoices[0];
    if (preferred) {
      this.voice = preferred;
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Speak word with Web Speech API
  public speak(text: string, rate: number = 0.85, pitch: number = 1.05) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // 0.85 is clear and friendly for young learners
    utterance.pitch = pitch; // slightly higher pitch is warm and engaging
    if (this.voice) {
      utterance.voice = this.voice;
    }
    window.speechSynthesis.speak(utterance);
  }

  // Promise-based speech for sequential dialogues
  public speakAsync(text: string, rate: number = 0.85, pitch: number = 1.05): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setTimeout(resolve, 1500);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  // Stop any ongoing speech
  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Slow "Turtle" pronunciation for phonics listening
  public speakSlow(text: string) {
    this.speak(text, 0.55, 1.0);
  }

  // Chime sound for correct answer
  public playCorrect() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // Success celebration combo
  public playSuccess() {
    this.playCorrect();
    this.playStar();
  }

  // Gentle bounce sound for wrong answer (not harsh for kids)
  public playWrong() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Flip card tap sound
  public playCardFlip() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Star sound
  public playStar() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const freqs = [880, 1174.66, 1760]; // A5, D6, A6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.36);
    });
  }

  // Fanfare victory sound
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const chord = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.50, t: 0.36 },
      { f: 1318.51, t: 0.52 },
    ];

    chord.forEach(item => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + item.t);

      gain.gain.setValueAtTime(0, now + item.t);
      gain.gain.linearRampToValueAtTime(0.2, now + item.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.t);
      osc.stop(now + item.t + 0.5);
    });
  }

  // Letter tap sound
  public playTap() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Bubble pop / burst sound for kids games
  public playPop() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Ascending combo sound when achieving streaks
  public playCombo() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.22);
    });
  }

  // Knock knock sound for doors and boxes in hide-and-seek
  public playKnock() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now + offset);
      osc.frequency.exponentialRampToValueAtTime(90, now + offset + 0.05);

      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.07);
    });
  }

  // Mystery rustle / shimmer sound when checking hiding bushes
  public playRustle() {
    if (!this.soundEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const freqs = [700, 850, 620, 950];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.03);
      gain.gain.setValueAtTime(0.1, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.09);
    });
  }
}

export const sound = new SoundManager();
