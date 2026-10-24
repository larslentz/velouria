import { useState } from 'react';
import {
  KEYS, VARIATIONS, combinedArrangementEvents, dyadPairs, dyadSighEvents, expandedProgression, keyRootMidi, melodyEvents,
  mixMatrixSvg, pitchName, staffSvg, variationEvents,
} from './music';
import { PianoRoll } from './PianoRoll';
import { ArrangementGuide } from './ArrangementGuide';
import { CombinedArrangementPlayer } from './CombinedArrangementPlayer';
import { LayerExamples } from './EnvironmentTextures';

const BASE = import.meta.env.BASE_URL;
const heroImage = `${BASE}images/velouria-hero.webp`;
const definitionImage = `${BASE}images/velouria-definition.webp`;
const tabs = ['Foundation', 'Sincere Fragment', 'Transformations', 'Sound Design', 'Layers', 'Music to Study'];
const progressionPhases = [
  { name: 'ACHE', chords: 'i(add9)', bars: 'BARS 1–2' },
  { name: 'CONSOLATION', chords: '♭VImaj7', bars: 'BARS 3–4' },
  { name: 'MIRAGE', chords: '♭IImaj7', bars: 'BARS 5–6' },
  { name: 'RETURN', chords: 'ivm9 / V7sus4', bars: 'BARS 7–8' },
];

function Heading({ number, title, children, headingId }: { number: string; title: string; children: string; headingId?: string }) {
  return <header className="section-heading"><span className="section-index">{number}</span><div><h2 id={headingId}>{title}</h2><p>{children}</p></div></header>;
}
function Viz({ svg, label }: { svg: string; label: string }) {
  return <div className="viz viz-scroll" data-testid={label} dangerouslySetInnerHTML={{ __html: svg }} />;
}
function App() {
  const [key, setKey] = useState('A♭');
  const [tab, setTab] = useState(0);
  const [variation, setVariation] = useState(0);
  const [definitionOpen, setDefinitionOpen] = useState(false);
  const root = keyRootMidi(key);
  const pairs = dyadPairs(key);
  const progressive = expandedProgression(key);
  const currentVariation = VARIATIONS[variation];
  const dyadEvents = dyadSighEvents(key);
  const lateBreathArrangement = combinedArrangementEvents(key, variationEvents(key, 'late'), 'Late Breath');
  const progressionEvents = progressive.flatMap(chord => chord.notes.map(pitch => ({
    start: chord.start, duration: chord.duration, pitch, label: `${chord.label} · bars ${chord.bars}`, chordName: chord.label,
  })));

  return <div className="site-shell">
    <section className="hero" style={{ backgroundImage: `url("${heroImage}")` }} aria-labelledby="brand-title">
      <div className="hero-top">
        <div>
          <div className="wordmark">A FIELD GUIDE TO COMPOSITION</div>
          <h1 id="brand-title">Velouria</h1>
          <div className="pronunciation">Ve·lou·ri·a /vəˈlʊər.i.ə/ · noun</div>
        </div>
        <div className="dict-label">THE COMPOSITIONAL GUIDE</div>
      </div>
      <p className="hero-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space, often evoking a feeling described as "<a href="https://larslentz.github.io/beautiful_unease/" target="_blank" rel="noopener noreferrer">beautiful unease</a>."</p>
      <div className="dictionary-meta">
        <div><div className="dict-label">ETYMOLOGY</div><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div>
        <div><div className="dict-label">RELATED FORMS</div><p><b>Velouric</b> (adj.): Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria.</p><p><b>Velourian</b> (adj./n.): Directly embodying the aesthetic and compositional principles of Velouria.</p></div>
      </div>
    </section>

    <div className="definition-wrap">
      <button className="definition-toggle" type="button" onClick={() => setDefinitionOpen(open => !open)} aria-expanded={definitionOpen} aria-controls="definition-panel" data-testid="button-toggle-definition">
        {definitionOpen ? 'Close the full Velouria definition' : 'Read the full Velouria definition'}
      </button>
      {definitionOpen && <article id="definition-panel" className="definition-panel" style={{ backgroundImage: `linear-gradient(90deg,rgba(12,16,20,.94),rgba(12,16,20,.74)),url("${definitionImage}")` }} data-testid="panel-full-definition">
        <h2>Velouria</h2><p><strong><em>Ve·lou·ri·a</em> /vəˈlʊər.i.ə/ · noun</strong></p>
        <h3>Definition</h3><p>A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space, often evoking a feeling described as "<a href="https://larslentz.github.io/beautiful_unease/" target="_blank" rel="noopener noreferrer">beautiful unease</a>."</p>
        <h3>Etymology</h3><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p>
        <h3>Inflections &amp; Related Forms</h3>
        <ul><li><strong>Velouric</strong> /vəˈlʊər.ɪk/ <em>adjective</em>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</li>
          <li><strong>Velourian</strong> /vəˈlʊər.i.ən/ <em>adjective &amp; noun</em>:<ol><li><em>adj.</em> Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>).</li><li><em>n.</em> A composer, producer, or listener dedicated to the genre.</li></ol></li></ul>
        <h3>Core Characteristics</h3>
        <p>Velouria is defined by four characteristics. <em>Beautiful Unease</em> describes one way to bring several of them together in a composition.</p>
        <ul><li><strong>Harmonic Suspension:</strong> Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences. Explore this in <em>Foundation</em>.</li>
          <li><strong>The Sincere Fragment:</strong> Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity. Build one in <em>Sincere Fragment</em>, then reshape it in <em>Transformations</em>.</li>
          <li><strong>Beautiful Unease (bringing the ideas together):</strong> A compositional approach that combines harmonic suspension, a sincere melodic fragment, and variations through transformation. The hovering harmony forms a foundation, the fragment carries a simple, expressive melody, and later variations reshape that melody while keeping it connected to its original idea. This is the composition built from the characteristics, not a fifth characteristic of Velouria.</li>
          <li><strong>Mediated Distance:</strong> The use of degraded tape loops, granular residue, soft filtering, and room tone to give foreground instruments (such as felt piano or vintage polysynths) the impression of a half-remembered transmission. Explore this in <em>Sound Design</em>.</li>
          <li><strong>Environmental Setting:</strong> Subtle integration of field recordings, sub-bass drones, and quiet room acoustics that establish an ambiguous physical space beneath the music. Explore this in <em>Layers</em>.</li></ul>
        <h3>Example in Context</h3><blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <strong>Velouria</strong>.”</blockquote>
      </article>}
    </div>

    <main className="guide-wrap">
      <div className="keyline">
        <label htmlFor="tonal-center">Choose a starting key</label>
        <select id="tonal-center" className="key-select" value={key} onChange={event => setKey(event.target.value)} aria-describedby="key-help" data-testid="select-tonal-center">
          {KEYS.map(choice => <option key={choice} value={choice}>{choice}</option>)}
        </select>
        <span className="caption-mono" data-testid="text-tonal-center">KEY · {key} MINOR&nbsp; / &nbsp;HOME NOTE · {pitchName(root)}</span>
      </div>
      <p className="beginner-intro" id="key-help">The key sets which note the music treats as “home.” That home note is the <strong>tonal center</strong>. Changing this moves every example higher or lower while keeping its pattern. You can leave it on A♭ to start. The numbered modules are a suggested learning order; you do not need to read sheet music.</p>
      <aside className="note" aria-label="Companion app: Beautiful Unease" data-testid="beautiful-unease-reference">
        <strong>Companion app: <a href="https://larslentz.github.io/beautiful_unease/" target="_blank" rel="noopener noreferrer">Beautiful Unease</a>.</strong> It creates melodies and harmonies that you can use as starting material for Velouria-type music. A melody is a sequence of notes; harmony is the supporting notes played together. Try using a short passage from a Beautiful Unease melody as your Sincere Fragment, or its harmonies as an alternative to Foundation’s example chords. Keep the melody and backing in the same key, leave space between phrases, then explore Transformations, Sound Design, and Layers to shape the piece.
      </aside>
      <p className="beginner-intro" data-testid="characteristic-learning-map"><strong>How the four characteristics appear in this guide:</strong> Foundation explores Harmonic Suspension; Sincere Fragment and Transformations develop the melody; Sound Design explores Mediated Distance; and Layers explores Environmental Setting.</p>
      <div className="module-navigation">
        <div className="module-navigation-track">
          <div className="module-family-row">
            <p className="module-family" id="beautiful-unease-modules" data-testid="beautiful-unease-module-group">
              Beautiful Unease<span className="sr-only"> includes Foundation, Sincere Fragment, and Transformations.</span>
            </p>
          </div>
          <div className="tabs" role="tablist" aria-label="Composition learning modules" data-testid="module-tabs">
            {tabs.map((name, i) => <button type="button" role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-describedby={i < 3 ? 'beautiful-unease-modules' : undefined} aria-selected={tab === i} className="tab-button" key={name} onClick={() => setTab(i)} data-testid={`tab-module-${i + 1}`}>
              <span className="tab-num">0{i + 1}</span>{name}
            </button>)}
          </div>
        </div>
      </div>
      <section className="tab-content" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={`${tab}-${key}`} data-testid={`content-module-${tab + 1}`}>
        {tab === 0 && <>
          <Heading number="01" title="Start with two notes">Play two notes together, keep the lower one held, and move the upper one to the very next piano key on its left. In this guide, that gentle downward settling is called a “sigh.” Two notes played together are called a dyad. This small sigh is Harmonic Suspension in miniature: it eases some tension without making the whole piece feel finished.</Heading>
          <div className="note" data-testid="foundation-exercise-role"><strong>Start with this as a short practice exercise, not a pattern you must play throughout the piece.</strong> Repeat the two bars a few times by themselves. Later in this tab, the eight-bar chord sequence becomes your accompaniment, with the Sincere Fragment melody played above it. <a href="#arrangement-plan">See the complete playing order and bar-by-bar plan below.</a></div>
          <details className="learning-note" data-testid="foundation-interval-explanation">
            <summary>The music theory behind the sigh</summary>
            <p>Musicians call this movement a <strong>perfect fourth settling to a major third</strong>, sometimes shortened to <strong>P4 → M3</strong>. Here is what those names mean.</p>
            <p>An <strong>interval</strong> is the distance between two notes. A <strong>semitone</strong> is one step to the next piano key, counting both black and white keys. A whole step is two semitone steps.</p>
            <ul>
              <li><strong>P4 = perfect fourth:</strong> the upper note is 5 semitone steps above the lower note.</li>
              <li><strong>M3 = major third:</strong> the upper note is 4 semitone steps above the lower note.</li>
              <li><strong>“Settles” describes the effect:</strong> lower the upper note by one semitone while holding the lower note still. The gap narrows from 5 steps to 4. In this musical setting, it can sound like a small release of tension.</li>
            </ul>
            <p>You do not need to memorize those names to try it. Use the exact notes below, and count four steady beats per bar (one group of 1–2–3–4).</p>
          </details>
          <div className="grid-two">
            {pairs.map((pair, i) => <div className="surface" key={pair.label} data-testid={`card-dyad-pair-${i + 1}`}>
              <div className="stat-label">BAR {i + 1} · {i === 0 ? 'TRY THE FIRST SIGH' : 'REPEAT TWO KEYS HIGHER'}</div>
              <h3>Hold {pitchName(pair.start[1])}; move {pitchName(pair.start[0])} to {pitchName(pair.rest[0])}</h3>
              <ol className="playing-steps">
                <li><strong>Beat 1:</strong> play {pitchName(pair.start[1])} and {pitchName(pair.start[0])} together.</li>
                <li><strong>Beat 2:</strong> keep both notes held.</li>
                <li><strong>Beat 3:</strong> keep {pitchName(pair.start[1])} held. Release {pitchName(pair.start[0])} and play {pitchName(pair.rest[0])}, the next key to its left.</li>
                <li><strong>Beat 4:</strong> keep both notes held, then release at the end of the bar.</li>
              </ol>
              <p>The lower note is the <strong>bass</strong>. The gap above it changes from a perfect fourth (5 steps) to a major third (4 steps).</p>
            </div>)}
          </div>
          <details className="learning-note staff-explanation"><summary>See the same two-note movement as sheet music</summary>
          <p>The five horizontal lines are a staff. Notes higher on the staff sound higher. This is the same example as the piano roll below, not an extra exercise; you can skip it if you do not read music.</p>
          <Viz svg={staffSvg(pairs)} label="diagram-dyad-staff" />
          </details>
          <PianoRoll events={dyadEvents} bars={2} title={`Two gentle sighs · one in each bar · ${key} minor`} testId="diagram-dyad-piano-roll" />
          <h3>Next: turn the idea into an eight-bar chord sequence</h3>
          <p className="beginner-intro">A <strong>chord</strong> is a group of notes played together. A <strong>progression</strong> is a sequence of chords. For the suggested arrangement, use this sequence <strong>instead of continuously repeating the two-bar sigh exercise</strong>. Play each vertical stack together and hold it for the length of its blocks. The first three chords each last two bars; the final two each last one bar.</p>
          <div className="chord-ribbon" aria-label="Eight-bar chord progression with suggested emotional phases" data-testid="progression-chord-ribbon">
            {progressionPhases.map((phase, i) => <div className="chord-step" key={phase.name} data-testid={`progression-phase-${i + 1}`}>
              <div className="stat-label">{phase.name}</div><strong>{phase.chords}</strong><span>{phase.bars}</span>
            </div>).flatMap((el, i) => i < 3 ? [el, <span className="arrow" key={`arrow-${i}`} aria-hidden="true">→</span>] : [el])}
          </div>
          <div className="note" data-testid="note-progression-phases"><strong>These are mood cues, not rules.</strong> Ache begins with an open minor chord; Consolation brings a warmer major sound; Mirage shifts to a less expected chord; Return moves through a familiar minor color and ends on an open, suspended chord. The final chord does not strongly resolve to “home,” so the loop can begin again or the sound can be left hanging.</div>
          <details className="learning-note" data-testid="foundation-chord-symbol-help">
            <summary>What do those chord symbols mean?</summary>
            <p>Roman numerals identify a chord’s starting note relative to “home.” Lowercase means minor; uppercase means major. ♭ means the starting note is lowered by one semitone.</p>
            <dl className="chord-glossary">
              <div><dt>i(add9)</dt><dd>The home minor chord, plus an extra note called the ninth for a gentle, open sound.</dd></div>
              <div><dt>♭VImaj7</dt><dd>A major chord built on the lowered sixth step of the major scale of your chosen key, with a major-seventh color note added.</dd></div>
              <div><dt>♭IImaj7</dt><dd>A major-seventh chord starting just one semitone above the home note.</dd></div>
              <div><dt>ivm9</dt><dd>A minor chord starting five semitones above home, with a seventh and ninth added.</dd></div>
              <div><dt>V7sus4</dt><dd>A chord starting seven semitones above home. “sus4” replaces its usual third with a fourth; “7” adds a seventh. This leaves an open, unfinished feeling.</dd></div>
            </dl>
            <p>No need to work out those notes yourself: the piano roll and its note list show the exact keys to play.</p>
          </details>
          <PianoRoll events={progressionEvents} bars={8} title={`Eight-bar chord sequence · ${key} minor`} testId="diagram-eight-bar-progression" />
          <div className="note" data-testid="note-progression-ending">In bar 7, play the notes of <b>ivm9</b> together. In bar 8, switch to <b>V7sus4</b>. To continue, return to bar 1 after bar 8. To finish instead, stop on that open sound and let it fade; this can leave an unfinished feeling.</div>
          <div className="note" data-testid="note-pedal-point"><strong>Optional: add a held bass note.</strong> Try holding the low home note, {pitchName(root - 12)}, quietly underneath all eight bars while the higher chords change. Musicians call this a <em>pedal point</em>: one steady note that helps the changing harmony keep a sense of home. It is an extra layer, not a note in the chord roll; leave it out if it muddies the chords.</div>
          <div className="note" data-testid="foundation-recorded-sources"><strong>The backing does not have to be piano.</strong> A recording of sustained orchestral strings, or a tape loop (a recorded passage that repeats), can carry Foundation’s chords instead. Choose recordings whose notes match each chord in the roll, and arrange the clips for the shown lengths: two bars for each of the first three chords, then one bar for each of the last two. Use short fades at edits to avoid clicks. This recording is the accompaniment itself, not an extra atmosphere layer; one unchanged chord loop would not reproduce this whole sequence.</div>
          <ArrangementGuide tonalKey={key} />
        </>}
        {tab === 1 && <>
          <Heading number="02" title="The sincere fragment">A melody is a sequence of single notes; a motif is a short, recognizable pattern within it. This three-note descent is the Sincere Fragment: simple, unhurried, and expressive. Its quiet bars are intentional breathing room, not missing notes. On a later repeat, try Late Breath: move each melody note half a beat later while Foundation keeps its original timing. A playable example appears at the end of this section.</Heading>
          <div className="learning-note" data-testid="melody-accompaniment-guidance">
            <h3>When does this melody come in?</h3>
            <p><strong>Play it over Foundation’s eight-bar chord sequence, not after the chords stop.</strong> For a simple start, play the chords alone for eight bars. Then restart the chord sequence and begin this melody at the same instant: beat 1 of the new cycle (bar 9 of the piece).</p>
            <p>The melody roll below starts its own count at <strong>bar 1</strong>. That bar lines up with bar 1 of the repeated chord sequence. Play the first phrase in bars 1–2, leave the melody silent in bars 3–6, and play its return in bars 7–8. <strong>The chords keep sounding through all eight bars, including the melody’s rests.</strong></p>
            <p>At the end, repeat the whole eight-bar cycle to continue, or stop both parts and let them fade. Do not repeat just the first two melody bars over and over. Foundation’s playing plan lists what both parts do in every bar.</p>
          </div>
          <div className="grid-three">
            {[
              ['01', 'The Longing', `Start on ${pitchName(root + 26)}. This is the “ninth” color: two semitone steps above the home note, played in a higher octave. Play it softly on beat 1 of bar 1.`],
              ['02', 'The Ache', `On beat 3 of bar 1, play ${pitchName(root + 25)} — the very next piano key to the left. That small move is one semitone.`],
              ['03', 'The Consolation', `On beat 1 of bar 2, play ${pitchName(root + 24)}, one more key to the left. Hold it for 3.5 beats. It is also a note in the warm major chord used in the progression.`],
            ].map(([n, title, copy]) => <div className="surface" key={n} data-testid={`card-melody-step-${n}`}><span className="step-number">{n}</span><h3 style={{ display: 'inline' }}>{title}</h3><p>{copy}</p></div>)}
          </div>
          <PianoRoll events={melodyEvents(key)} bars={8} title={`Three-note melody and breathing room · ${key}`} restBars={[2, 3, 4, 5]} testId="diagram-sincere-fragment" />
          <CombinedArrangementPlayer tonalKey={key} />
          <div className="note" data-testid="note-melody-rest"><b>Bars 3–6 are intentionally empty for the melody only.</b> Keep Foundation’s accompaniment going: hold the ♭VImaj7 chord through bars 3–4, then the ♭IImaj7 chord through bars 5–6. Play no new melody notes in those bars. The three-note melody returns in bars 7–8 while the accompaniment changes underneath it.</div>
          <div className="note" data-testid="melody-recorded-sources"><strong>A recorded phrase can be the sincere fragment.</strong> Instead of playing piano, use a short cello, violin, other orchestral, or tape-recorded phrase. To follow this example, select or edit recorded notes to match the three descending pitches and timing in the roll. Place them in bars 1–2 and 7–8, leaving bars 3–6 without new melody notes. Because the recording carries the recognizable melody, it is the fragment itself—not just background texture.</div>
          <section className="learning-note" data-testid="late-breath-example">
            <h3>Late Breath: let the melody arrive halfway between beats</h3>
            <p>Count “1-and-2-and-3-and-4-and” evenly; each “and” falls halfway between numbered beats. In the original phrase, the melody starts on beats 1 and 3 of bar 1, then beat 1 of bar 2. For Late Breath, play each note on the “and” after that beat. Repeat the same shift in bars 7–8.</p>
            <p><strong>Keep Foundation unchanged.</strong> Its chord stacks still begin on their original beats. In the combined piano roll below, those lower stacks are the accompaniment and the higher notes are the delayed melody. Press <strong>Play together</strong> to hear the difference.</p>
          </section>
          <PianoRoll events={lateBreathArrangement} bars={8} title={`Foundation + Late Breath · ${key} minor`} testId="diagram-late-breath-with-foundation" together />
        </>}
        {tab === 2 && <>
          <Heading number="03" title="Variations & transformations">Transformations let the Sincere Fragment change while remaining recognizable. Keep Foundation’s eight-bar harmony underneath, then try moving the melody’s start time, playing it higher or lower, or holding a note longer. Choose one example below and compare its note list with the original three-note melody.</Heading>
          <div className="note" data-testid="variation-arrangement-guidance">
            <p><strong>Start by playing Foundation and Sincere Fragment together.</strong> Use Foundation’s <strong>eight-bar chord sequence</strong> as the accompaniment (the backing), with the <strong>Sincere Fragment melody</strong> above it. Both parts start at bar 1 of the same eight-bar cycle. The chords continue while the melody rests in bars 3–6, and the melody returns in bars 7–8. After bar 8, return both parts to bar 1 and repeat. That complete eight-bar pattern is the <strong>accompaniment-and-melody loop</strong>; it does not mean repeating Foundation’s two-bar sigh exercise.</p>
            <p>Once that combined pattern feels comfortable, choose <strong>one variation for a later eight-bar repeat</strong>, rather than stacking all eight examples at once. The rolls show the changed notes; they are not eight new sections you must perform in order. Keep Foundation’s chord sequence running beneath the melody; Drone Pedal also adds a quiet, held bass layer.</p>
          </div>
          <div className="keyline"><label htmlFor="variation-choice">Choose a transformation to inspect</label><select className="variation-select" id="variation-choice" value={variation} onChange={e => setVariation(Number(e.target.value))} data-testid="select-transformation">{VARIATIONS.map((v, i) => <option value={i} key={v.kind}>{v.name}</option>)}</select></div>
          <div className="surface" data-testid="selected-transformation"><div className="kicker">{currentVariation.name}</div><h3>{currentVariation.summary}</h3><p>{currentVariation.detail}</p></div>
          <div className="note" data-testid="transformation-recorded-sources"><strong>You can transform recordings, too.</strong> If an orchestral phrase or tape loop carries your Sincere Fragment melody, edit that recording in your music software rather than adding a new instrument. For Ghost Note, move its clips one beat later; for Octave Dream, lower their pitch by one octave (12 semitones). Preserve the eight-bar cycle and its breathing room. Changing playback speed on a tape-style recording can change both pitch and length; use separate pitch or time controls when you want to change only one. The edited recording now performs the variation, while Foundation’s chord sequence remains underneath it.</div>
          <PianoRoll events={variationEvents(key, currentVariation.kind)} bars={8} title={`${currentVariation.name} · ${key} minor`} testId="diagram-selected-transformation" />
          <h3>The full transformation catalog</h3>
          <div className="grid-two">{VARIATIONS.map(v => <article className="variation-card" key={v.kind} data-testid={`card-transformation-${v.kind}`}><strong>{v.name}</strong><span>{v.summary}</span></article>)}</div>
        </>}
        {tab === 3 && <>
          <Heading number="04" title="Mediated distance & sound design">Sound design means shaping a sound’s tone. Keep one clear musical part close to the listener—a piano or recorded orchestral phrase, for example—then add a softer, altered version or another slow sound behind it. “Mediated distance” means making that layer feel filtered or half-remembered, not simply louder or quieter.</Heading>
          <div className="note">These are sound choices for the parts you are already playing, not a separate section that starts after the melody. Add quiet layers gradually once the chord-and-melody pattern is clear. Pads and fading effects can continue through the melody’s empty bars.</div>
          <div className="grid-two">
            <div className="surface" data-testid="recipe-piano"><div className="kicker">Piano layer</div><h3>Soft felt tone</h3><p>Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).</p><ul><li>Velocity: 40–60. Velocity is how firmly a MIDI note is played, on a 1–127 scale.</li><li>Choose a close microphone sound for intimate detail.</li><li>Use dark reverb: a soft room-like echo. Avoid a sharp, bright initial hit (the transient).</li></ul></div>
            <div className="surface" data-testid="recipe-strings"><div className="kicker">String / pad swell</div><h3>Slow arrival</h3><p>A pad is a soft, sustained background sound. Use slow strings or a warm synthesizer preset beneath the piano.</p><ul><li>Attack: 600–900 ms. Let the sound fade in over 0.6–0.9 seconds rather than start abruptly.</li><li>Use a low-pass filter to remove bright high frequencies. A 24 dB/octave setting makes that reduction fairly steep.</li><li>Add a little chorus or ensemble effect for gently moving, wider sound.</li></ul></div>
            <div className="surface" data-testid="recipe-phrase-effects">
              <div className="kicker">Phrase effects</div>
              <h3>Experiment to find the feeling</h3>
              <p>A phrase is a short musical idea. Try changing its space, echo, tone, or texture with effects such as delay (repeating echo), reverb (a sense of room), filtering, or granular processing (breaking sound into tiny pieces and stretching or scattering them). Listen for the feeling each choice adds; there is no single right effect or amount.</p>
              <p>Examples to try include u-he Colour Copy, SoundBetter Halo Effect, and SoundBetter Butterfly Effect. Experiment with one at a time, compare it with the unprocessed sound, and adjust or remove it if it distracts from the music. A send routes some of a part to a separate effects track so you can blend its effect back in.</p>
              <p>One approach is to briefly increase an effect send on the ending of a melodic phrase, then lower it so the effect fades before the next idea. You can also apply an effect across more of the phrase, or to a whole layer, if that better suits the piece. Keep the original musical idea recognizable.</p>
            </div>
            <div className="surface" data-testid="recipe-bass"><div className="kicker">Bass layer</div><h3>A soft low foundation</h3><p>Use a rounded sine or triangle synthesizer tone: a simple, smooth sound rather than a bright or buzzy one.</p><ul><li>Try a low-pass filter with its cutoff near or below 300 Hz to keep the sound low and reduce higher frequencies.</li><li>Sustain means holding the note. Keep it long and even.</li><li>Let the sound start softly and stay quiet, supporting the higher notes rather than creating a beat.</li></ul></div>
          </div>
          <section className="learning-note" data-testid="mediated-distance-practice">
            <h3>One clear part, one softened reflection</h3>
            <p>Try this optional experiment with a piano phrase or recording: keep the original close and clear, then put a copy on a separate track and turn it down. Make the copy darker by reducing some high frequencies, and add a little room-like echo if it helps. The first version stays easy to hear; the softer copy can feel like the same idea remembered from farther away.</p>
            <p>Compare the original alone with both versions playing. Keep the copy subtle, or remove it if it blurs the melody. You can create distance with a separate pad or recording instead; there is no need to process every sound.</p>
          </section>
          <div className="note" data-testid="note-depth-arrangement">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it. Try echo or granular processing on one short phrase or fading note first, rather than washing the whole mix; phrase endings are one option, not the only one.</div>
        </>}
        {tab === 4 && <>
          <Heading number="05" title="Layers">Build the composition from distinct parts. Foundation’s chords and the Sincere Fragment melody carry the main musical ideas; pads, recordings, and independent textures can add other layers. Add them one at a time, and decide whether each layer carries music or sits behind it as texture.</Heading>
          <Viz svg={mixMatrixSvg} label="diagram-layer-depth" />
          <p className="beginner-intro" data-testid="layer-diagram-intro">This diagram shows parts at different listening distances, not an effects chain. Each instrument or recording has its own track; the piano is not routed through the strings or Dust.</p>
          <div className="grid-two">
            <div className="surface" data-testid="layer-listening-roles"><div className="kicker">Listening roles</div><h3>Foreground → background</h3><p><b>Foreground:</b> the clearest musical idea, such as the melody or a chord played by piano or another source.</p><p><b>Mid-ground:</b> sustained parts, such as soft strings or a pad, that support the music without taking over.</p><p><b>Background:</b> a quieter recording, loop, or independent texture that adds depth behind the main parts.</p></div>
            <div className="surface" data-testid="layer-composition-prompt"><div className="kicker">Build by listening</div><h3>Add one layer at a time</h3><p>Start with Foundation’s chords and the Sincere Fragment melody. Together, these make a clear musical arrangement before you add extra layers.</p><p>Then bring in one soft pad, recording, or texture on its own track. A background layer can continue during the melody’s rests; lower or remove it if it hides the chords or melody.</p></div>
          </div>
          <LayerExamples />
          <section className="environment-setting-section" aria-labelledby="environment-setting-title" data-testid="environment-setting-space">
            <section className="learning-note environment-setting-item" aria-labelledby="environment-setting-title" data-testid="environment-setting-item">
              <h3 id="environment-setting-title">Environmental setting & space</h3>
              <p>Some background layers can suggest a place or a memory. Field recordings—such as rain, wind, distant traffic, or a quiet room—are common in most Velouria compositions and can sit beneath the musical layers without becoming another lead part.</p>
            </section>
            <section className="learning-note field-recording-guide" aria-labelledby="field-recordings-title" data-testid="environment-field-recordings">
              <h3 id="field-recordings-title">Field recordings: a quiet sense of place</h3>
              <ol>
                <li><strong>Choose a sound that leaves room for the music.</strong> A steady, distant texture usually sits more easily behind the chords and melody than a loud, busy sound or one with prominent musical notes.</li>
                <li><strong>Put it on its own track behind the musical parts.</strong> Keep it quieter than Foundation’s chords and the Sincere Fragment melody, so it supports rather than replaces or obscures them.</li>
                <li><strong>Fade it in and out gently.</strong> If you repeat a recording, use a clean edit or a short crossfade between repeats to avoid an abrupt seam or click.</li>
                <li><strong>Listen through the whole cycle.</strong> A recording can continue through the melody’s rests in bars 3–6. Adjust its level or timing if it masks the chords, melody, or the quiet between phrases.</li>
              </ol>
              <p>Try muting and unmuting the recording to compare the piece with and without it. Keep it only if it adds the feeling of space or place you want.</p>
              <p><strong>Set the listening distance.</strong> Keep the felt piano or main melody clear and close; make the field recording quieter and softer behind it. A little room sound or gentle stereo width can help it suggest a surrounding place without taking attention from the notes.</p>
            </section>
            <section className="learning-note" aria-labelledby="environment-low-floor-title" data-testid="environment-low-floor">
              <h3 id="environment-low-floor-title">Optional: a quiet physical floor</h3>
              <p>A sub-bass is a very low, sustained note. A soft note below the changing chords can make the arrangement feel grounded, like a floor beneath the other sounds, without adding a beat.</p>
              <p>Try the low home note described in Foundation, keep it barely audible, and compare the piece with and without it. The Bass layer in Sound Design has a suggested low-pass setting. Skip this layer if it makes the harmony muddy or if you prefer a lighter sound.</p>
            </section>
            <div className="note" data-testid="note-environment">The aim is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>
          </section>
        </>}
        {tab === 5 && <>
          <Heading number="06" title="Music to Study">Use this playlist as a listening companion while exploring the guide. Notice one quality at a time: suspended harmony, a memorable melodic fragment, space between phrases, or textures sitting behind the main musical idea. You do not need to identify every note; listen for the feeling and how the layers work together.</Heading>
          <article className="surface music-study-card" data-testid="music-study-playlist">
            <div className="kicker">Curated listening</div>
            <h3>Velouria on Spotify</h3>
            <p>The playlist is a reference for exploration, not a required sequence or set of rules. Choose a track, listen for one detail, then return to the guide and try your own version.</p>
            <iframe
              data-testid="embed-iframe"
              title="Velouria playlist on Spotify"
              style={{ borderRadius: '12px', display: 'block' }}
              src="https://open.spotify.com/embed/playlist/5xjEx6AgGrcJPSMzZmnx5B?utm_source=generator&amp;theme=0&amp;si=9ea7aab455d3465a"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <p className="music-study-link"><a href="https://open.spotify.com/playlist/5xjEx6AgGrcJPSMzZmnx5B?si=jcDzYDDxTeupxhXb7HAacQ" target="_blank" rel="noopener noreferrer">Open the Velouria playlist in Spotify</a> if you prefer listening there.</p>
            <div className="music-study-youtube">
              <h3>Velouria on YouTube</h3>
              <p>Explore the Velouria playlist on YouTube as another listening companion.</p>
              <iframe
                title="Velouria playlist on YouTube"
                style={{ borderRadius: '12px', display: 'block', width: '100%', aspectRatio: '16 / 9' }}
                src="https://www.youtube.com/embed/videoseries?si=wOSCczuWkxSmreGK&amp;list=PLEv8rUxoqBOU"
                height="315"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
              <p className="music-study-link"><a href="https://youtube.com/playlist?list=PLEv8rUxoqBOU&amp;si=nNRT2AAPx3vDZHCN" target="_blank" rel="noopener noreferrer">Open the Velouria playlist on YouTube</a> if you prefer listening there.</p>
            </div>
          </article>
        </>}
      </section>
      <footer className="footer">A COMPOSITION HANDBOOK · FELT-STYLE PIANO PREVIEWS + MIDI DOWNLOADS · USE THE DIAGRAMS AS WRITING PROMPTS · ARTWORK BY LARS LENTZ</footer>
    </main>
  </div>;
}
export default App;
