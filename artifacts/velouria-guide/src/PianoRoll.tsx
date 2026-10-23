import { useEffect, useMemo, useRef } from 'react';
import { pianoRollLayout, pianoRollSvg, pitchName, type Event as NoteEvent } from './music';
import { usePianoPlayback } from './usePianoPlayback';
import { PlaybackControls } from './PlaybackControls';

type Props = {
  events: NoteEvent[];
  bars: number;
  title: string;
  testId: string;
  restBars?: number[];
};

export function PianoRoll({ events, bars, title, testId, restBars = [] }: Props) {
  const player = usePianoPlayback(events, bars);
  const region = useRef<HTMLDivElement>(null);
  const restKey = restBars.join(',');
  const svg = useMemo(() => pianoRollSvg(events, bars, title, restKey ? restKey.split(',').map(Number) : []), [events, bars, title, restKey]);
  useEffect(() => {
    const container = region.current;
    const line = container?.querySelector<SVGLineElement>('[data-playhead]');
    if (!container || !line) return;
    const layout = pianoRollLayout(events, bars);
    const position = layout.left + (player.beat ?? 0) * layout.beatWidth;
    line.setAttribute('x1', String(position));
    line.setAttribute('x2', String(position));
    line.setAttribute('visibility', player.beat === null ? 'hidden' : 'visible');
    container.querySelectorAll<SVGRectElement>('.piano-roll-note').forEach(note => {
      const start = Number(note.dataset.start);
      note.classList.toggle('is-sounding', player.beat !== null && player.beat >= start && player.beat < start + Number(note.dataset.duration));
    });
    if (player.beat !== null) {
      const scale = (container.querySelector('svg')?.getBoundingClientRect().width ?? layout.width) / layout.width;
      const x = position * scale;
      if (x > container.scrollLeft + container.clientWidth - 45 || x < container.scrollLeft + 20) {
        container.scrollLeft = Math.max(0, x - container.clientWidth * .45);
      }
    }
  }, [player.beat, events, bars]);
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
    <PlaybackControls player={player} title={title} testId={testId} bars={bars} disabled={!events.length} />
    <p className="roll-sound-note">Soft, felt-style piano modeled in your browser. Plays this roll only, including its rests; starting another roll or the combined arrangement stops this one. BPM means beats per minute.</p>
    <div ref={region} className="viz viz-scroll piano-roll-region" role="region" aria-label={`${title} — scrollable piano roll`} tabIndex={0} data-testid={testId} dangerouslySetInnerHTML={{ __html: svg }} />
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
