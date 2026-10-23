import type { Event as NoteEvent } from './music';
import { playbackSchedule } from './playbackTiming.ts';

type Playback = {
  owner: string;
  events: NoteEvent[];
  bars: number;
  bpm: number;
  volume: number;
  onBeat: (beat: number) => void;
  onStop: () => void;
};
type Session = Playback & {
  bus: GainNode;
  wet: GainNode;
  nodes: AudioNode[];
  sources: OscillatorNode[];
  frame: number;
};

// A local, modeled felt-style tone: softly struck, detuned strings, damped
// overtones, natural decay, and a short room. No network sample dependency.
class FeltPiano {
  private context?: AudioContext;
  private wave?: PeriodicWave;
  private room?: AudioBuffer;
  private output?: DynamicsCompressorNode;
  private active?: Session;
  private pending?: Playback;
  private generation = 0;

  private initialize() {
    if (this.context) return this.context;
    const Constructor = window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Constructor) throw new Error('Audio playback is not supported in this browser. Try a current browser.');
    const context = new Constructor();
    const real = new Float32Array(11);
    const imaginary = new Float32Array([0, 1, .48, .21, .12, .065, .035, .02, .01, .006, .003]);
    this.wave = context.createPeriodicWave(real, imaginary);
    this.room = context.createBuffer(2, Math.ceil(context.sampleRate * .85), context.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const samples = this.room.getChannelData(channel);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = (Math.random() * 2 - 1) * Math.exp(-i / (context.sampleRate * .16));
      }
    }
    this.output = context.createDynamicsCompressor();
    this.output.threshold.value = -16;
    this.output.knee.value = 12;
    this.output.ratio.value = 3;
    this.output.connect(context.destination);
    this.context = context;
    return context;
  }

  async play(options: Playback) {
    this.stop();
    const generation = ++this.generation;
    this.pending = options;
    try {
      const schedule = playbackSchedule(options.events, options.bars, options.bpm);
      const context = this.initialize();
      // Called only from a user's Play gesture, including on Safari/iOS.
      await context.resume();
      if (generation !== this.generation) return;
      if (context.state !== 'running') throw new Error('Audio could not start. Tap Play again to enable sound.');
      const bus = context.createGain();
      bus.gain.value = options.volume;
      bus.connect(this.output!);
      const room = context.createConvolver();
      room.buffer = this.room!;
      const wet = context.createGain();
      wet.gain.value = .12;
      bus.connect(room);
      room.connect(wet);
      wet.connect(this.output!);
      const session: Session = { ...options, bus, wet, nodes: [bus, room, wet], sources: [], frame: 0 };
      this.active = session;
      this.pending = undefined;
      const start = context.currentTime + .06;
      for (const note of schedule.notes) {
        const onset = start + note.offset;
        const release = onset + note.duration;
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = .35;
        filter.frequency.setValueAtTime(Math.min(3900, 800 + note.frequency * 2.6), onset);
        filter.frequency.exponentialRampToValueAtTime(700 + note.frequency * .9, onset + Math.min(.6, note.duration));
        const envelope = context.createGain();
        const peak = .15;
        envelope.gain.setValueAtTime(0, onset);
        envelope.gain.linearRampToValueAtTime(peak, onset + .018);
        envelope.gain.setTargetAtTime(peak * .16, onset + .018, 1.9);
        const heldLevel = peak * (.16 + .84 * Math.exp(-Math.max(0, note.duration - .018) / 1.9));
        envelope.gain.setValueAtTime(heldLevel, release);
        envelope.gain.exponentialRampToValueAtTime(.0001, release + .36);
        filter.connect(envelope);
        envelope.connect(bus);
        session.nodes.push(filter, envelope);
        for (const detune of [-1.4, 1.4]) {
          const string = context.createOscillator();
          string.setPeriodicWave(this.wave!);
          string.frequency.value = note.frequency;
          string.detune.value = detune;
          string.connect(filter);
          string.start(onset);
          string.stop(release + .4);
          session.sources.push(string);
          session.nodes.push(string);
        }
      }
      const tick = () => {
        if (this.active !== session) return;
        const elapsed = Math.max(0, context.currentTime - start);
        session.onBeat(Math.min(schedule.totalBeats, elapsed / schedule.secondsPerBeat));
        // Keep the final rests and a short release/room tail, not just the last note.
        if (elapsed >= schedule.duration + 1.25) this.stop(session.owner);
        else session.frame = requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      if (generation !== this.generation) return;
      this.stop(options.owner);
      throw error;
    }
  }

  setVolume(owner: string, volume: number) {
    if (this.pending?.owner === owner) this.pending.volume = volume;
    if (this.active?.owner === owner && this.context) {
      this.active.bus.gain.setTargetAtTime(volume, this.context.currentTime, .02);
    }
  }

  stop(owner?: string) {
    if (owner && this.active?.owner !== owner && this.pending?.owner !== owner) return;
    ++this.generation;
    const pending = this.pending;
    this.pending = undefined;
    pending?.onStop();
    const session = this.active;
    if (!session || !this.context) return;
    this.active = undefined;
    cancelAnimationFrame(session.frame);
    const now = this.context.currentTime;
    session.bus.gain.cancelScheduledValues(now);
    session.bus.gain.setTargetAtTime(0, now, .008);
    session.wet.gain.setTargetAtTime(0, now, .008);
    for (const source of session.sources) source.stop(now + .04);
    // Disconnect this session only, so starting another roll cannot be cut off.
    setTimeout(() => session.nodes.forEach(node => node.disconnect()), 80);
    session.onStop();
  }
}

export const feltPiano = new FeltPiano();
