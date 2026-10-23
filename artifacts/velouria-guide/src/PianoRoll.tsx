import { pianoRollSvg, pitchName, type Event as NoteEvent } from './music';

type Props = {
  events: NoteEvent[];
  bars: number;
  title: string;
  testId: string;
  restBars?: number[];
};

export function PianoRoll({ events, bars, title, testId, restBars = [] }: Props) {
  const groups = new Map<string, { start: number; duration: number; notes: number[]; label: string }>();
  for (const event of events) {
    const id = `${event.start}-${event.duration}-${event.label}`;
    const group = groups.get(id);
    if (group) group.notes.push(event.pitch);
    else groups.set(id, { start: event.start, duration: event.duration, notes: [event.pitch], label: event.label });
  }
  const rows = [...groups.values()].sort((a, b) => a.start - b.start || a.notes[0] - b.notes[0]);
  return <figure className="piano-roll-study">
    <figcaption>
      <h3>{title}</h3>
      <p>Read left to right. Higher rows mean higher notes; each row is one piano key, including black keys.
        A block’s left edge tells you when to start; its length tells you how long to hold the note.
        Stacked blocks are played together.</p>
      <p className="roll-reading-tip"><strong>Count 1–2–3–4 in each bar.</strong> The note number tells you its octave (pitch range): C4 is middle C; C5 is one octave higher. ♭ means “flat,” one key below the named note. Scroll sideways on smaller screens; the notes stay full-size.</p>
    </figcaption>
    <div className="viz viz-scroll piano-roll-region" role="region" aria-label={`${title} — scrollable piano roll`} tabIndex={0} data-testid={testId} dangerouslySetInnerHTML={{ __html: pianoRollSvg(events, bars, title, restBars) }} />
    <details className="roll-note-list" data-testid={`${testId}-note-list`}>
      <summary>Read the exact notes and timing as a list</summary>
      <div className="note-table-scroll" role="region" aria-label={`${title} note list`} tabIndex={0}>
        <table>
          <caption>All timings are in beats. For example, beat 1.5 is halfway between beats 1 and 2.</caption>
          <thead><tr><th scope="col">Start</th><th scope="col">Note(s)</th><th scope="col">Hold for</th><th scope="col">What to play</th></tr></thead>
          <tbody>{rows.map((row, index) => <tr key={index}>
            <td>Bar {Math.floor(row.start / 4) + 1}, beat {Number((row.start % 4 + 1).toFixed(2))}</td>
            <td className="note-names">{row.notes.slice().sort((a, b) => a - b).map(pitchName).join(' + ')}</td>
            <td>{row.duration} {row.duration === 1 ? 'beat' : 'beats'}</td><td>{row.label}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </details>
  </figure>;
}
