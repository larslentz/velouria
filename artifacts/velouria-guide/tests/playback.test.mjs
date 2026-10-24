import test from 'node:test';
import assert from 'node:assert/strict';
import { KEYS, VARIATIONS, combinedArrangementEvents, dyadSighEvents, expandedProgression, melodyEvents, variationEvents } from '../src/music.ts';
import { playbackSchedule } from '../src/playbackTiming.ts';

test('audio uses the exact pitches, start times and held durations in every roll and key', () => {
  for (const key of KEYS) {
    const chords = expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({ ...chord, pitch })));
    const rolls = [[dyadSighEvents(key), 2], [chords, 8], [melodyEvents(key), 8],
      ...VARIATIONS.map(variation => [variationEvents(key, variation.kind), 8])];
    for (const [events, bars] of rolls) for (const bpm of [40, 60, 120]) {
      const schedule = playbackSchedule(events, bars, bpm);
      assert.equal(schedule.duration, bars * 4 * 60 / bpm);
      assert.equal(schedule.notes.length, events.length);
      events.forEach((event, index) => {
        const note = schedule.notes[index];
        assert.equal(note.pitch, event.pitch);
        assert.ok(Math.abs(note.offset - event.start * 60 / bpm) < .000000001);
        assert.ok(Math.abs(note.duration - event.duration * 60 / bpm) < .000000001);
        assert.ok(Math.abs(note.frequency - 440 * 2 ** ((event.pitch - 69) / 12)) < .000001);
      });
    }
  }
});

test('playback preserves empty bars and the full eight-bar duration', () => {
  const schedule = playbackSchedule(melodyEvents('A♭'), 8, 60);
  assert.equal(schedule.duration, 32);
  assert.ok(schedule.notes.every(note => note.offset + note.duration <= 8 || note.offset >= 24));
  assert.equal(playbackSchedule([], 8, 60).duration, 32);
});

test('invalid audio data or tempos fail explicitly', () => {
  const notes = dyadSighEvents('C');
  for (const bpm of [0, 20, 121, NaN, Infinity]) assert.throws(() => playbackSchedule(notes, 2, bpm));
  assert.throws(() => playbackSchedule(notes, 0, 60));
  assert.throws(() => playbackSchedule([{ ...notes[0], pitch: 128 }], 2, 60));
  assert.throws(() => playbackSchedule([{ ...notes[0], duration: -1 }], 2, 60));
  assert.throws(() => playbackSchedule([{ ...notes[0], start: 8 }], 2, 60));
});

test('combined arrangement shares exact chord/melody timing in every key and tempo, without an intro', () => {
  for (const key of KEYS) {
    const events = combinedArrangementEvents(key);
    const chords = expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({
      start: chord.start, duration: chord.duration, pitch,
    })));
    const harmony = events.filter(note => note.label.startsWith('Foundation'));
    const melody = events.filter(note => note.label.startsWith('Sincere Fragment'));
    const timing = ({ start, duration, pitch }) => ({ start, duration, pitch });
    assert.deepEqual(harmony.map(timing), chords);
    assert.deepEqual(melody.map(timing), melodyEvents(key).map(timing));
    assert.equal(harmony[0].start, 0);
    assert.equal(melody[0].start, 0);
    for (const bar of [2, 3, 4, 5]) {
      assert.ok(!melody.some(note => note.start < (bar + 1) * 4 && note.start + note.duration > bar * 4));
      assert.ok(harmony.some(note => note.start <= bar * 4 && note.start + note.duration >= (bar + 1) * 4));
    }
    for (const bpm of [40, 50, 60, 70, 80, 100, 120]) {
      const schedule = playbackSchedule(events, 8, bpm);
      assert.equal(schedule.totalBeats, 32);
      assert.equal(schedule.duration, 32 * 60 / bpm);
      schedule.notes.forEach((note, index) => {
        assert.ok(Math.abs(note.offset - events[index].start * 60 / bpm) < 1e-9);
        assert.ok(Math.abs(note.duration - events[index].duration * 60 / bpm) < 1e-9);
        assert.equal(note.pitch, events[index].pitch);
      });
    }
  }
});

test('Late Breath plays over unchanged Foundation chords throughout the full eight-bar cycle', () => {
  for (const key of KEYS) {
    const lateMelody = variationEvents(key, 'late');
    const events = combinedArrangementEvents(key, lateMelody, 'Late Breath');
    const harmony = events.filter(note => note.label.startsWith('Foundation'));
    const melody = events.filter(note => note.label.startsWith('Late Breath'));
    const timing = ({ start, duration, pitch }) => ({ start, duration, pitch });
    const chords = expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({
      start: chord.start, duration: chord.duration, pitch,
    })));

    assert.deepEqual(harmony.map(timing), chords);
    assert.deepEqual(melody.map(timing), lateMelody.map(timing));
    assert.equal(melody.length, 6, 'both melody phrases are delayed');
    for (const bar of [2, 3, 4, 5]) {
      assert.ok(!melody.some(note => note.start < (bar + 1) * 4 && note.start + note.duration > bar * 4));
      assert.ok(harmony.some(note => note.start <= bar * 4 && note.start + note.duration >= (bar + 1) * 4));
    }
  }
});
