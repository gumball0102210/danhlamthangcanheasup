/**
 * Ambient Audio Synthesizer and Web Speech API Narration Guide
 * 100% self-contained in browser using Web Audio API and SpeechSynthesis
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private timer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Generates a soft, atmospheric nature breeze / wave ambiance
   */
  startAmbiance(type: 'breeze' | 'waves' | 'chime' = 'breeze') {
    this.stopAmbiance();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
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

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm atmospheric frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'waves' ? 380 : 260, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
    this.gainNode = gain;

    // Gentle wave modulation if waves
    if (type === 'waves') {
      let phase = 0;
      this.timer = window.setInterval(() => {
        if (!this.gainNode || !this.ctx) return;
        phase += 0.2;
        const val = 0.04 + Math.sin(phase) * 0.035;
        this.gainNode.gain.setValueAtTime(Math.max(0.005, val), this.ctx.currentTime);
      }, 250);
    }
  }

  /**
   * Plays a delicate meditative temple bell chime
   */
  playChime() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz Solfeggio frequency
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 3);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 3.6);
  }

  stopAmbiance() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignored
      }
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const ambiancePlayer = new SoundSynthesizer();

/**
 * Text-to-speech audio guide tour narrator
 */
export class TourAudioGuide {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private rate = 1.0;
  private onStateChange: (state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void = () => {};
  private scriptLength = 0;
  private currentCharIndex = 0;

  constructor(callback?: (state: { isPlaying: boolean; isPaused: boolean; progress: number }) => void) {
    if (callback) {
      this.onStateChange = callback;
    }
  }

  speak(text: string, rate = 1.0) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.stop();
    this.rate = rate;
    this.scriptLength = text.length || 1;
    this.currentCharIndex = 0;

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate;
    utt.pitch = 1.0;
    utt.lang = 'vi-VN';

    // Find best Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utt.voice = viVoice;
    }

    utt.onboundary = (e) => {
      this.currentCharIndex = e.charIndex;
      const progress = Math.min(100, Math.round((this.currentCharIndex / this.scriptLength) * 100));
      this.onStateChange({ isPlaying: true, isPaused: false, progress });
    };

    utt.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentCharIndex = 0;
      this.onStateChange({ isPlaying: false, isPaused: false, progress: 100 });
      ambiancePlayer.stopAmbiance();
    };

    utt.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.onStateChange({ isPlaying: false, isPaused: false, progress: 0 });
      ambiancePlayer.stopAmbiance();
    };

    this.utterance = utt;
    this.isSpeaking = true;
    this.isPaused = false;
    this.onStateChange({ isPlaying: true, isPaused: false, progress: 0 });

    // Optional background breeze
    ambiancePlayer.startAmbiance('breeze');
    window.speechSynthesis.speak(utt);
  }

  pause() {
    if ('speechSynthesis' in window && this.isSpeaking && !this.isPaused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      const progress = Math.min(100, Math.round((this.currentCharIndex / this.scriptLength) * 100));
      this.onStateChange({ isPlaying: true, isPaused: true, progress });
    }
  }

  resume() {
    if ('speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      const progress = Math.min(100, Math.round((this.currentCharIndex / this.scriptLength) * 100));
      this.onStateChange({ isPlaying: true, isPaused: false, progress });
    }
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    ambiancePlayer.stopAmbiance();
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentCharIndex = 0;
    this.onStateChange({ isPlaying: false, isPaused: false, progress: 0 });
  }

  setRate(rate: number, text?: string) {
    this.rate = rate;
    if (this.isSpeaking && text) {
      this.speak(text.slice(this.currentCharIndex), rate);
    }
  }
}
