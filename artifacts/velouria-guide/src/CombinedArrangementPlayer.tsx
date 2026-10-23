import { arrangementPlan, combinedArrangementEvents, pitchName } from './music';
import { usePianoPlayback } from './usePianoPlayback';
import { PlaybackControls } from './PlaybackControls';

export function CombinedArrangementPlayer({ tonalKey }: { tonalKey: string }) {
  const player = usePianoPlayback(combinedArrangementEvents(tonalKey), 8);
  const bar = player.beat !== null && player.beat < 32 ? Math.floor(player.beat / 4) + 1 : null;
  const row = bar === null ? null : arrangementPlan(tonalKey)[bar - 1];
  return <div className="learning-note combined-arrangement" data-testid="combined-arrangement">
    <h3>Hear Foundation + Sincere Fragment together</h3>
    <p><strong>One eight-bar cycle in {tonalKey} minor.</strong> The Foundation chords and Sincere Fragment melody begin together on beat 1. This preview skips the optional eight-bar chord-only introduction described in the playing plan. It plays once, then lets the sound fade.</p>
    <PlaybackControls player={player} title="Foundation and Sincere Fragment together" testId="combined-arrangement" bars={8} together />
    <p className="roll-sound-note">Soft, felt-style piano modeled in your browser. Both parts share one clock, tempo and volume. BPM means beats per minute. Changing tempo stops playback; press Play together to restart. Playing a separate roll stops this preview, and vice versa. Changing tabs or keys also stops playback.</p>
    <ol className="arrangement-bar-strip" aria-label="Shared eight-bar playback position">
      {Array.from({ length: 8 }, (_, index) => <li key={index} aria-current={bar === index + 1 ? 'step' : undefined}>Bar {index + 1}</li>)}
    </ol>
    <p className="arrangement-key-point" data-testid="combined-arrangement-parts" aria-live="off">
      {row ? <><strong>Foundation:</strong> {row.chord.label} · {row.chord.notes.map(pitchName).join(' + ')}. <strong>Sincere Fragment:</strong> {row.melody.length ? 'follow the melody above the chord.' : 'rest — no melody notes; the chord continues.'}</> : <>Listen for the melody in bars 1–2 and 7–8. <strong>In bars 3–6, only the Foundation chords continue.</strong> Those melody rests are part of the music.</>}
    </p>
  </div>;
}
