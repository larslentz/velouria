import { arrangementPlan, pitchName } from './music';
import { CombinedArrangementPlayer } from './CombinedArrangementPlayer';

export function ArrangementGuide({ tonalKey }: { tonalKey: string }) {
  const plan = arrangementPlan(tonalKey);
  return <section className="learning-note arrangement-guide" id="arrangement-plan" aria-labelledby="arrangement-title" data-testid="arrangement-playing-plan">
    <h3 id="arrangement-title">How to put Foundation and Sincere Fragment together</h3>
    <p><strong>Foundation is the accompaniment; Sincere Fragment is the melody above it.</strong> They play at the same time. The tabs teach you the parts separately, not a sequence in which one part finishes before the next can begin.</p>
    <CombinedArrangementPlayer tonalKey={tonalKey} />
    <ol className="playing-steps">
      <li><strong>First, practice the two-bar sigh on its own.</strong> Repeat those two bars a few times until the movement feels comfortable, then stop. This is a technique exercise, not an extra pattern that must keep running underneath everything else.</li>
      <li><strong>For your first arrangement, use the full eight-bar chord sequence as the backing.</strong> Play it once by itself as an introduction. Count 1–2–3–4 steadily in every bar; try 60 beats per minute to start (one beat per second). Strike each chord only at its marked start, then hold it for the length of its blocks. Do not strike it again on every beat.</li>
      <li><strong>Repeat the chord sequence and bring in the melody together with its first chord.</strong> That is beat 1 of the next eight-bar cycle — bar 9 of the piece if you used the suggested introduction. Both piano rolls now count the same section bars, 1–8. In music software, line up the chord and melody parts at the same start point on separate tracks. On a keyboard, learn each part separately before combining them; record or loop the backing if the full chords are too much to play at once.</li>
    </ol>
    <p className="arrangement-key-point"><strong>When the melody is silent, the accompaniment keeps going.</strong> Do not restart the three-note melody every two bars. Its four empty bars are part of the pattern.</p>
    <h4>One eight-bar cycle with the melody</h4>
    <p>This table uses the section’s own bar numbers. After the introduction above, section bar 1 is bar 9 of the piece. The notes change with your chosen key.</p>
    <div className="note-table-scroll" role="region" aria-label="Bar-by-bar accompaniment and melody instructions" tabIndex={0}>
      <table className="arrangement-table" data-testid="arrangement-bar-table">
        <caption>Follow both columns together. “Hold” means let the existing notes keep sounding, without striking them again. Scroll sideways on narrow screens.</caption>
        <thead><tr><th scope="col">Section bar</th><th scope="col">Foundation: accompaniment</th><th scope="col">Sincere Fragment: melody</th></tr></thead>
        <tbody>{plan.map(row => <tr key={row.bar}>
          <th scope="row">{row.bar}</th>
          <td>
            <strong>{row.chord.label}</strong>
            {row.strikeChord
              ? <p>On beat 1, play <span className="note-names">{row.chord.notes.map(pitchName).join(' + ')}</span> together. Hold for {row.chord.duration / 4 === 2 ? 'this bar and the next' : 'this bar'}.</p>
              : <p>Keep the previous bar’s chord held throughout this bar. Do not play it again.</p>}
          </td>
          <td>{row.melody.length
            ? <ul>{row.melody.map(note => <li key={note.start}>Beat {note.start % 4 + 1}: play <span className="note-names">{pitchName(note.pitch)}</span>; hold for {note.duration} {note.duration === 1 ? 'beat' : 'beats'}, then release.</li>)}</ul>
            : <p><strong>No new melody notes.</strong> Let earlier notes fade while the Foundation chord continues.</p>}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <h4>What happens after bar 8?</h4>
    <p><strong>To continue:</strong> return to section bar 1 and repeat the entire eight-bar accompaniment and melody together, including the melody’s rests. Change or add one element on a later pass rather than adding every variation at once.</p>
    <p><strong>To finish:</strong> do not restart the loop. Release the final notes at the end of bar 8 and let their sound and any reverb fade. The eight-bar introduction is a suggested starting arrangement, not a rule for every Velouria piece.</p>
  </section>;
}
