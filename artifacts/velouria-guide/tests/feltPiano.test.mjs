import test from 'node:test';
import assert from 'node:assert/strict';
import { combinedArrangementEvents, melodyEvents } from '../src/music.ts';
import { feltPiano } from '../src/feltPiano.ts';

// Deterministic Web Audio doubles: check actual scheduling and session cleanup,
// without waiting 32 seconds or relying on speakers.
test('combined audio uses one clock, stops exclusively, cancels pending starts and cleans up', async () => {
  let context;
  let resume;
  let frameId = 0;
  const frames = new Map();
  const timers = [];
  const param = () => ({
    value: 0, calls: [],
    setValueAtTime(...args) { this.calls.push(args); },
    linearRampToValueAtTime(...args) { this.calls.push(args); },
    exponentialRampToValueAtTime(...args) { this.calls.push(args); },
    setTargetAtTime(...args) { this.calls.push(args); },
    cancelScheduledValues(...args) { this.calls.push(args); },
  });
  const node = () => ({
    gain: param(), frequency: param(), detune: param(), Q: param(),
    threshold: param(), knee: param(), ratio: param(), disconnected: false,
    connect() {}, disconnect() { this.disconnected = true; },
    setPeriodicWave() {}, starts: [], stops: [],
    start(time) { this.starts.push(time); }, stop(time) { this.stops.push(time); },
  });
  class AudioContextDouble {
    currentTime = 10;
    sampleRate = 100;
    state = 'running';
    destination = {};
    oscillators = [];
    gains = [];
    nodes = [];
    constructor() { context = this; }
    resume() { return resume ? new Promise(resolve => { resume.resolve = resolve; }) : Promise.resolve(); }
    createPeriodicWave() { return {}; }
    createBuffer() { return { getChannelData: () => new Float32Array(85) }; }
    createDynamicsCompressor() { return node(); }
    createGain() { const result = node(); this.gains.push(result); this.nodes.push(result); return result; }
    createConvolver() { const result = node(); this.nodes.push(result); return result; }
    createBiquadFilter() { const result = node(); this.nodes.push(result); return result; }
    createOscillator() { const result = node(); this.oscillators.push(result); this.nodes.push(result); return result; }
  }
  const originals = Object.fromEntries(['window', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout'].map(key => [key, globalThis[key]]));
  globalThis.window = { AudioContext: AudioContextDouble };
  globalThis.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  globalThis.setTimeout = callback => { timers.push(callback); return 1; };
  const tick = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
  };
  const stops = [];
  const beats = [];
  const options = owner => ({
    owner, events: combinedArrangementEvents('A♭'), bars: 8, bpm: 60, volume: .55,
    onBeat: beat => beats.push(beat), onStop: () => stops.push(owner),
  });
  try {
    await feltPiano.play(options('combined'));
    const start = 10.06;
    const events = combinedArrangementEvents('A♭');
    assert.equal(context.oscillators.length, events.length * 2);
    events.forEach((event, index) => {
      const oscillator = context.oscillators[index * 2];
      assert.equal(oscillator.starts[0], start + event.start);
      assert.equal(oscillator.stops[0], start + event.start + event.duration + .4);
    });
    context.currentTime = start + 8;
    tick();
    assert.ok(Math.abs(beats.at(-1) - 8) < 1e-9, 'shared playhead enters bar 3 while melody rests');
    feltPiano.setVolume('combined', .2);
    assert.deepEqual(context.gains[0].gain.calls.at(-1), [.2, context.currentTime, .02]);
    const oldNodes = [...context.nodes];
    const oldSources = [...context.oscillators];
    await feltPiano.play({ ...options('solo'), events: melodyEvents('C') });
    assert.deepEqual(stops, ['combined']);
    assert.ok(oldSources.every(source => source.stops.length === 2), 'all scheduled old notes stopped');
    feltPiano.stop('combined');
    assert.deepEqual(stops, ['combined'], 'old owner cleanup cannot stop the new roll');
    timers.splice(0).forEach(callback => callback());
    assert.ok(oldNodes.every(item => item.disconnected));
    assert.ok(!context.nodes.at(-1).disconnected, 'delayed cleanup leaves new session intact');
    await feltPiano.play(options('combined-again'));
    assert.deepEqual(stops, ['combined', 'solo']);
    // Same stop(owner) used by the hook on key/tempo changes, hidden tab and unmount.
    feltPiano.stop('combined-again');
    assert.equal(stops.at(-1), 'combined-again');
    assert.equal(frames.size, 0);
    resume = {};
    const pending = feltPiano.play(options('pending'));
    const count = context.oscillators.length;
    feltPiano.stop('pending');
    resume.resolve();
    await pending;
    assert.equal(context.oscillators.length, count, 'stopped pending resume cannot schedule audio');
    assert.equal(stops.at(-1), 'pending');
    resume = undefined;
    const endStart = context.currentTime + .06;
    await feltPiano.play(options('ending'));
    context.currentTime = endStart + 32;
    tick();
    assert.equal(beats.at(-1), 32);
    assert.notEqual(stops.at(-1), 'ending', 'release tail plays after full eight bars');
    context.currentTime = endStart + 33.3;
    tick();
    assert.equal(stops.at(-1), 'ending');
    assert.equal(frames.size, 0);
  } finally {
    feltPiano.stop();
    timers.forEach(callback => callback());
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
});
