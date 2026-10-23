import type { Event as NoteEvent } from './music.ts';
import { playbackSchedule } from './playbackTiming.ts';

export type MidiTrack = { name: string; events: NoteEvent[] };
export const MIDI_TICKS_PER_BEAT = 960;
const encoder = new TextEncoder();

function variableLength(value: number): number[] {
  if (!Number.isInteger(value) || value < 0 || value > 0x0fffffff) {
    throw new Error('This MIDI passage is too long to export.');
  }
  const bytes = [value & 0x7f];
  while ((value = Math.floor(value / 128)) > 0) bytes.unshift((value & 0x7f) | 0x80);
  return bytes;
}

function meta(type: number, data: number[]) {
  return [0xff, type, ...variableLength(data.length), ...data];
}

function chunk(name: string, data: number[]) {
  const length = data.length;
  return [...encoder.encode(name), (length >>> 24) & 255, (length >>> 16) & 255,
    (length >>> 8) & 255, length & 255, ...data];
}

// Standard MIDI File, format 1: a tempo track plus independently editable parts.
export function buildMidi(tracks: MidiTrack[], bars: number, bpm: number): Uint8Array {
  if (!tracks.length || tracks.length > 15) throw new Error('Choose between 1 and 15 MIDI parts.');
  tracks.forEach(track => playbackSchedule(track.events, bars, bpm));
  const end = bars * 4 * MIDI_TICKS_PER_BEAT;
  variableLength(end);
  const tempo = Math.round(60_000_000 / bpm);
  const conductor = chunk('MTrk', [
    0, ...meta(0x03, [...encoder.encode('Velouria · tempo and meter')]),
    0, ...meta(0x51, [(tempo >>> 16) & 255, (tempo >>> 8) & 255, tempo & 255]),
    0, ...meta(0x58, [4, 2, 24, 8]), // 4/4, quarter-note beat
    ...variableLength(end), ...meta(0x2f, []),
  ]);
  const parts = tracks.flatMap((track, index) => {
    // Skip General MIDI's percussion channel (zero-based channel 9).
    const channel = index < 9 ? index : index + 1;
    const notes = track.events.flatMap(event => {
      const start = Math.round(event.start * MIDI_TICKS_PER_BEAT);
      const finish = Math.round((event.start + event.duration) * MIDI_TICKS_PER_BEAT);
      if (finish <= start) throw new Error('A note is too short to represent in MIDI.');
      return [
        { tick: start, order: 1, pitch: event.pitch, data: [0x90 | channel, event.pitch, 64] },
        { tick: finish, order: 0, pitch: event.pitch, data: [0x80 | channel, event.pitch, 0] },
      ];
    }).sort((a, b) => a.tick - b.tick || a.order - b.order || a.pitch - b.pitch);
    const bytes = [
      0, ...meta(0x03, [...encoder.encode(track.name)]),
      0, 0xc0 | channel, 0, // Acoustic Grand Piano as an import-friendly default.
    ];
    let previousTick = 0;
    for (const note of notes) {
      bytes.push(...variableLength(note.tick - previousTick), ...note.data);
      previousTick = note.tick;
    }
    // End at the full roll length, even when its final bars contain only rests.
    bytes.push(...variableLength(end - previousTick), ...meta(0x2f, []));
    return chunk('MTrk', bytes);
  });
  const trackCount = tracks.length + 1;
  return new Uint8Array([
    ...chunk('MThd', [0, 1, (trackCount >>> 8) & 255, trackCount & 255,
      MIDI_TICKS_PER_BEAT >>> 8, MIDI_TICKS_PER_BEAT & 255]),
    ...conductor, ...parts,
  ]);
}

export function midiFilename(title: string, bpm: number) {
  const name = title.replaceAll('♭', 'b').replaceAll('♯', 'sharp')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `velouria-${name || 'piano-roll'}-${bpm}bpm.mid`;
}
