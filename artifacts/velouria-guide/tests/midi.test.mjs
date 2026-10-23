import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMidi, midiFilename, MIDI_TICKS_PER_BEAT as PPQ } from '../src/midi.ts';
import { KEYS, VARIATIONS, dyadSighEvents, expandedProgression, melodyEvents,
  variationEvents, combinedArrangementEvents } from '../src/music.ts';

// Decode the exported binary independently of the writer, including every
// delta time, meta-event, note-off, track boundary and end-of-track marker.
function readMidi(bytes) {
  const buffer = Buffer.from(bytes);
  assert.equal(buffer.toString('ascii', 0, 4), 'MThd');
  assert.equal(buffer.readUInt32BE(4), 6);
  assert.equal(buffer.readUInt16BE(8), 1);
  assert.equal(buffer.readUInt16BE(12), PPQ);
  const tracks = [];
  let position = 14;
  for (let i = 0; i < buffer.readUInt16BE(10); i++) {
    assert.equal(buffer.toString('ascii', position, position + 4), 'MTrk');
    const end = position + 8 + buffer.readUInt32BE(position + 4);
    assert.ok(end <= buffer.length);
    position += 8;
    const events = [];
    let tick = 0;
    function variable() {
      let result = 0;
      for (let j = 0; j < 4; j++) {
        assert.ok(position < end);
        const byte = buffer[position++];
        result = result * 128 + (byte & 127);
        if (!(byte & 128)) return result;
      }
      assert.fail('Invalid MIDI delta time');
    }
    while (position < end) {
      tick += variable();
      const status = buffer[position++];
      if (status === 0xff) {
        const type = buffer[position++];
        const length = variable();
        events.push({ tick, type, data: buffer.subarray(position, position + length) });
        position += length;
        if (type === 0x2f) assert.equal(position, end);
      } else if ((status & 0xf0) === 0xc0) {
        events.push({ tick, program: buffer[position++], channel: status & 15 });
      } else {
        assert.ok([0x80, 0x90].includes(status & 0xf0));
        events.push({ tick, on: (status & 0xf0) === 0x90, channel: status & 15,
          pitch: buffer[position++], velocity: buffer[position++] });
      }
    }
    assert.equal(position, end);
    assert.equal(events.at(-1).type, 0x2f);
    const sounding = new Map();
    const notes = [];
    for (const event of events.filter(event => 'on' in event)) {
      assert.ok(event.pitch <= 127 && event.velocity <= 127);
      if (event.on) {
        assert.ok(!sounding.has(event.pitch), 'Repeated pitches must release before retriggering');
        sounding.set(event.pitch, event.tick);
      } else {
        assert.ok(sounding.has(event.pitch), 'Every note-off has a note-on');
        notes.push({ pitch: event.pitch, start: sounding.get(event.pitch), end: event.tick });
        sounding.delete(event.pitch);
      }
    }
    assert.equal(sounding.size, 0, 'No hanging notes');
    tracks.push({ events, notes, end: tick });
  }
  assert.equal(position, buffer.length, 'No trailing or missing track bytes');
  return tracks;
}

const sorted = notes => notes.slice().sort((a, b) => a.start - b.start || a.pitch - b.pitch || a.end - b.end);
const expected = events => sorted(events.map(note => ({
  pitch: note.pitch, start: Math.round(note.start * PPQ),
  end: Math.round((note.start + note.duration) * PPQ),
})));

test('every roll and transformation exports exact transposed notes, timing, tempo and full bar length', () => {
  for (const key of KEYS) {
    const chords = expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({
      start: chord.start, duration: chord.duration, pitch, label: chord.label,
    })));
    const examples = [[dyadSighEvents(key), 2], [chords, 8], [melodyEvents(key), 8],
      ...VARIATIONS.map(variation => [variationEvents(key, variation.kind), 8])];
    for (const [events, bars] of examples) for (const bpm of [40, 60, 120]) {
      const tracks = readMidi(buildMidi([{ name: `Piano · ${key}`, events }], bars, bpm));
      assert.equal(tracks.length, 2);
      assert.deepEqual(sorted(tracks[1].notes), expected(events));
      tracks.forEach(track => assert.equal(track.end, bars * 4 * PPQ));
      const tempo = tracks[0].events.find(event => event.type === 0x51);
      assert.equal(tempo.data.readUIntBE(0, 3), Math.round(60_000_000 / bpm));
      assert.deepEqual([...tracks[0].events.find(event => event.type === 0x58).data], [4, 2, 24, 8]);
      assert.equal(tracks[1].events.find(event => event.type === 3).data.toString(), `Piano · ${key}`);
      assert.equal(tracks[1].events.find(event => 'program' in event).program, 0);
    }
  }
});

test('combined MIDI has separate synchronized melody and accompaniment tracks, without an introduction', () => {
  for (const key of KEYS) {
    const notes = combinedArrangementEvents(key);
    const parts = [
      { name: 'Foundation', events: notes.filter(note => note.label.startsWith('Foundation')) },
      { name: 'Sincere Fragment', events: notes.filter(note => note.label.startsWith('Sincere Fragment')) },
    ];
    const tracks = readMidi(buildMidi(parts, 8, 70));
    assert.equal(tracks.length, 3);
    parts.forEach((part, index) => {
      assert.deepEqual(sorted(tracks[index + 1].notes), expected(part.events));
      assert.equal(Math.min(...tracks[index + 1].notes.map(note => note.start)), 0);
      assert.equal(tracks[index + 1].end, 32 * PPQ);
      assert.ok(tracks[index + 1].events.filter(event => 'on' in event).every(event => event.channel === index));
    });
    assert.ok(tracks[2].notes.every(note => note.end <= 8 * PPQ || note.start >= 24 * PPQ));
  }
});

test('MIDI retains final rests and empty rolls, and releases before a same-pitch retrigger', () => {
  const events = [0, 1].map(start => ({ start, duration: 1, pitch: 60, label: 'Test' }));
  const tracks = readMidi(buildMidi([{ name: 'Repeated note', events }, { name: 'Rest', events: [] }], 8, 60));
  assert.deepEqual(sorted(tracks[1].notes), expected(events));
  assert.equal(tracks[1].end, 32 * PPQ);
  assert.equal(tracks[2].end, 32 * PPQ);
  assert.deepEqual(tracks[2].notes, []);
});

test('MIDI rejects invalid notes, tempos, lengths and track counts; filenames are readable', () => {
  const part = { name: 'Piano', events: dyadSighEvents('C') };
  for (const bpm of [0, NaN, Infinity, 121]) assert.throws(() => buildMidi([part], 2, bpm));
  for (const bars of [0, -1, 1.5, Infinity]) assert.throws(() => buildMidi([part], bars, 60));
  assert.throws(() => buildMidi([], 2, 60));
  assert.throws(() => buildMidi(Array(16).fill(part), 2, 60));
  for (const invalid of [{ pitch: 128 }, { start: -1 }, { duration: 0 }, { duration: 9 }]) {
    assert.throws(() => buildMidi([{ ...part, events: [{ ...part.events[0], ...invalid }] }], 2, 60));
  }
  assert.equal(midiFilename('Three-note melody · A♭ minor', 70), 'velouria-three-note-melody-ab-minor-70bpm.mid');
});
