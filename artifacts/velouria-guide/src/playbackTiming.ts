import type { Event as NoteEvent } from './music.ts';

export function playbackSchedule(events: NoteEvent[], bars: number, bpm: number) {
  if (!Number.isFinite(bpm) || bpm < 40 || bpm > 120) throw new Error('Choose a tempo between 40 and 120 BPM.');
  if (!Number.isInteger(bars) || bars < 1) throw new Error('The piano roll must contain whole bars.');
  const secondsPerBeat = 60 / bpm;
  const totalBeats = bars * 4;
  const notes = events.map(event => {
    if (!Number.isInteger(event.pitch) || event.pitch < 0 || event.pitch > 127 ||
        !Number.isFinite(event.start) || event.start < 0 || !Number.isFinite(event.duration) ||
        event.duration <= 0 || event.start + event.duration > totalBeats) {
      throw new Error('A note falls outside this piano roll.');
    }
    return {
      pitch: event.pitch,
      frequency: 440 * 2 ** ((event.pitch - 69) / 12),
      offset: event.start * secondsPerBeat,
      duration: event.duration * secondsPerBeat,
    };
  });
  return { notes, secondsPerBeat, totalBeats, duration: totalBeats * secondsPerBeat };
}
