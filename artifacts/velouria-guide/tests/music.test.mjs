import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KEYS, VARIATIONS, arrangementPlan, dyadPairs, dyadSighEvents, expandedProgression,
  keyRootMidi, melodyEvents, pianoRollLayout, pianoRollSvg, pitchName, variationEvents,
} from '../src/music.ts';

function examples(key) {
  return [
    { events: dyadSighEvents(key), bars: 2 },
    { events: expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({
      pitch, start: chord.start, duration: chord.duration, label: chord.label, chordName: chord.label,
    }))), bars: 8 },
    { events: melodyEvents(key), bars: 8 },
    ...VARIATIONS.map(v => ({ events: variationEvents(key, v.kind), bars: 8 })),
  ];
}

test('every key has a perfect fourth narrowing to a major third over an unchanged bass', () => {
  for (const key of KEYS) for (const pair of dyadPairs(key)) {
    assert.equal(pair.start[0] - pair.start[1], 5);
    assert.equal(pair.rest[0] - pair.rest[1], 4);
    assert.equal(pair.start[1], pair.rest[1]);
    assert.equal(pair.start[0] - pair.rest[0], 1);
  }
});

test('dyad timing matches the instructions: bass held four beats, top changes on beat three', () => {
  for (const key of KEYS) {
    const events = dyadSighEvents(key);
    for (let bar = 0; bar < 2; bar++) {
      const [bass, first, release] = events.slice(bar * 3, bar * 3 + 3);
      assert.equal(bass.start, bar * 4);
      assert.equal(bass.duration, 4);
      assert.equal(first.start, bar * 4);
      assert.equal(first.duration, 2);
      assert.equal(release.start, bar * 4 + 2);
      assert.equal(release.duration, 2);
      assert.equal(first.pitch - release.pitch, 1);
    }
  }
});

test('dyad piano roll shows interval tags beside the upper-note names in every key', () => {
  for (const key of KEYS) {
    const events = dyadSighEvents(key);
    const svg = pianoRollSvg(events, 2);
    const markedNotes = events.filter(event => event.interval);

    assert.deepEqual(markedNotes.map(event => event.interval.abbreviation), ['P4', 'M3', 'P4', 'M3']);
    for (const event of markedNotes) {
      assert.ok(svg.includes(`>${event.interval.abbreviation}</text>`));
      assert.ok(svg.includes(`${event.interval.name} (${event.interval.abbreviation})`));
      assert.ok(svg.includes(`>${pitchName(event.pitch)}</text>`), 'keep the note name visible next to its interval tag');
    }
    assert.match(svg, /P4 means perfect fourth; M3 means major third/);
  }
});

test('progression piano roll labels each chord span in every key', () => {
  for (const key of KEYS) {
    const chords = expandedProgression(key);
    const events = chords.flatMap(chord => chord.notes.map(pitch => ({
      pitch, start: chord.start, duration: chord.duration, label: chord.label, chordName: chord.label,
    })));
    const layout = pianoRollLayout(events, 8);
    const svg = pianoRollSvg(events, 8);
    const chordTags = [...svg.matchAll(/<g class="piano-roll-chord-label">/g)];

    assert.equal(layout.top, 88, 'reserve a row for chord names above the note grid');
    assert.equal(chordTags.length, chords.length);
    for (const chord of chords) {
      assert.ok(svg.includes(`>${chord.label}</text>`), `${chord.label} should appear as a chart label`);
      const spanLabel = chord.bars.includes('–') ? `bars ${chord.bars}` : `bar ${chord.bars}`;
      assert.ok(svg.includes(`${chord.label} · ${spanLabel}`), `${chord.label} should be aligned with its bar span`);
    }
    assert.match(svg, /CHORD/);
    assert.match(svg, /Chord names appear above the notes they describe/);
  }
});

test('all rolls use readable 28px pitch rows and only the required pitch range', () => {
  for (const key of KEYS) for (const { events, bars } of examples(key)) {
    const layout = pianoRollLayout(events, bars);
    assert.equal(layout.rowHeight, 28);
    assert.equal(layout.min, Math.min(...events.map(e => e.pitch)) - 2);
    assert.equal(layout.max, Math.max(...events.map(e => e.pitch)) + 2);
    assert.ok(layout.beatWidth >= 40);
    const svg = pianoRollSvg(events, bars);
    assert.ok(svg.includes(`min-width:${layout.width}px`), 'prevent mobile text shrinking');
    for (const event of events) assert.ok(svg.includes(`>${pitchName(event.pitch)}</text>`));
  }
});

test('rendered notes align with their named pitch row, exact beat, and duration in every key', () => {
  for (const key of KEYS) for (const { events, bars } of examples(key)) {
    const layout = pianoRollLayout(events, bars);
    const svg = pianoRollSvg(events, bars);
    const blocks = [...svg.matchAll(/<rect class="piano-roll-note"[^>]+>/g)].map(([tag]) =>
      Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value])));
    assert.equal(blocks.length, events.length);
    events.forEach((event, index) => {
      const block = blocks[index];
      assert.equal(Number(block.y), layout.top + (layout.max - event.pitch) * 28 + 3);
      assert.equal(Number(block.x), layout.left + event.start * layout.beatWidth);
      assert.ok(Math.abs(Number(block.width) - event.duration * layout.beatWidth) < .0001);
      assert.equal(Number(block.height), 22);
      assert.ok(event.start >= 0 && event.start + event.duration <= bars * 4);
    });
  }
});

test('melody is silent throughout bars three to six', () => {
  for (const key of KEYS) for (const event of melodyEvents(key)) {
    assert.ok(event.start + event.duration <= 8 || event.start >= 24);
  }
});

test('warm arpeggio uses only notes of the stated flat-six major-seventh chord', () => {
  for (const key of KEYS) {
    const root = keyRootMidi(key);
    const chord = new Set([8, 12, 15, 19].map(n => (root + n) % 12));
    for (const event of variationEvents(key, 'warm')) assert.ok(chord.has(event.pitch % 12));
  }
});

test('ghost entrance and late breath have their stated one-beat and half-beat offsets', () => {
  for (const key of KEYS) {
    assert.equal(variationEvents(key, 'ghost')[0].start, 1);
    const original = melodyEvents(key);
    const late = variationEvents(key, 'late');
    assert.equal(late.length, original.length);
    assert.deepEqual(late.map(note => note.start), original.map(note => note.start + .5));
    assert.deepEqual(late.map(({ pitch, duration }) => ({ pitch, duration })),
      original.map(({ pitch, duration }) => ({ pitch, duration })));
  }
});

test('the playing plan starts chords only in bars one, three, five, seven and eight in every key', () => {
  for (const key of KEYS) {
    const plan = arrangementPlan(key);
    assert.deepEqual(plan.map(row => row.bar), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual(plan.filter(row => row.strikeChord).map(row => row.bar), [1, 3, 5, 7, 8]);
    assert.deepEqual(plan.map(row => row.chord.label),
      ['i(add9)', 'i(add9)', '♭VImaj7', '♭VImaj7', '♭IImaj7', '♭IImaj7', 'ivm9', 'V7sus4']);
    for (const row of plan) {
      const start = (row.bar - 1) * 4;
      assert.ok(row.chord.start <= start && row.chord.start + row.chord.duration >= start + 4);
    }
  }
});

test('the playing plan keeps accompaniment active during melody rests and matches every melody attack', () => {
  for (const key of KEYS) {
    const plan = arrangementPlan(key);
    assert.deepEqual(plan.flatMap(row => row.melody), melodyEvents(key));
    assert.deepEqual(plan.filter(row => row.melody.length).map(row => row.bar), [1, 2, 7, 8]);
    for (const row of plan.slice(2, 6)) {
      assert.equal(row.melody.length, 0);
      assert.ok(row.chord.notes.length > 0);
    }
  }
});
