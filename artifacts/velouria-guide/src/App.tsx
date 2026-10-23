import { useState } from 'react';
import {
  KEYS, VARIATIONS, dyadPairs, expandedProgression, keyRootMidi, melodyEvents,
  mixMatrixSvg, pianoRollSvg, pitchName, staffSvg, variationEvents,
} from './music';

const BASE = import.meta.env.BASE_URL;
const heroImage = `${BASE}images/velouria-hero.webp`;
const definitionImage = `${BASE}images/velouria-definition.webp`;
const tabs = ['Foundation', 'Sincere Fragment', 'Transformations', 'Sound Design', 'Environment'];

function Heading({ number, title, children }: { number: string; title: string; children: string }) {
  return <header className="section-heading"><span className="section-index">{number}</span><div><h2>{title}</h2><p>{children}</p></div></header>;
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
  const dyadEvents = pairs.flatMap((pair, index) => [
    ...pair.start.map(pitch => ({ start: index * 4, duration: 1.7, pitch, label: pair.label })),
    ...pair.rest.map(pitch => ({ start: index * 4 + 2, duration: 1.7, pitch, label: 'semitone release' })),
  ]);
  const progressionEvents = progressive.flatMap(chord => chord.notes.map(pitch => ({
    start: chord.start, duration: chord.duration, pitch, label: `${chord.label} · bars ${chord.bars}`,
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
      <p className="hero-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
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
        <h3>Definition</h3><p>A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
        <h3>Etymology</h3><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p>
        <h3>Inflections &amp; Related Forms</h3>
        <ul><li><strong>Velouric</strong> /vəˈlʊər.ɪk/ <em>adjective</em>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</li>
          <li><strong>Velourian</strong> /vəˈlʊər.i.ən/ <em>adjective &amp; noun</em>:<ol><li><em>adj.</em> Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>).</li><li><em>n.</em> A composer, producer, or listener dedicated to the genre.</li></ol></li></ul>
        <h3>Core Characteristics</h3>
        <ul><li><strong>Harmonic Suspension:</strong> Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences.</li>
          <li><strong>The Sincere Fragment:</strong> Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity.</li>
          <li><strong>Mediated Distance:</strong> The use of degraded tape loops, granular residue, soft filtering, and room tone to give foreground instruments (such as felt piano or vintage polysynths) the impression of a half-remembered transmission.</li>
          <li><strong>Environmental Setting:</strong> Subtle integration of field recordings, sub-bass drones, and quiet room acoustics that establish an ambiguous physical space beneath the music.</li></ul>
        <h3>Example in Context</h3><blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <strong>Velouria</strong>.”</blockquote>
      </article>}
    </div>

    <main className="guide-wrap">
      <div className="keyline">
        <label htmlFor="tonal-center">Choose a tonal center</label>
        <select id="tonal-center" className="key-select" value={key} onChange={event => setKey(event.target.value)} data-testid="select-tonal-center">
          {KEYS.map(choice => <option key={choice} value={choice}>{choice}</option>)}
        </select>
        <span className="caption-mono" data-testid="text-tonal-center">TONAL CENTER · {key} MINOR&nbsp; / &nbsp;ROOT VOICING · {pitchName(root)}</span>
      </div>
      <div className="tabs" role="tablist" aria-label="Composition learning modules" data-testid="module-tabs">
        {tabs.map((name, i) => <button type="button" role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={tab === i} className="tab-button" key={name} onClick={() => setTab(i)} data-testid={`tab-module-${i + 1}`}>
          <span className="tab-num">0{i + 1}</span>{name}
        </button>)}
      </div>
      <section className="tab-content" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={`${tab}-${key}`} data-testid={`content-module-${tab + 1}`}>
        {tab === 0 && <>
          <Heading number="01" title="Harmonic movement & dyads">A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.</Heading>
          <div className="grid-two">
            {pairs.map((pair, i) => <div className="surface" key={pair.label} data-testid={`card-dyad-pair-${i + 1}`}><div className="stat-label">PAIR {i + 1} · {i === 0 ? 'ROOT OVER FIFTH' : 'STEP-UP ROOT'}</div><div className="stat-value">{pitchName(pair.start[0])} + {pitchName(pair.start[1])} &nbsp;→&nbsp; {pitchName(pair.rest[0])} + {pitchName(pair.rest[1])}</div><p>{i === 0 ? `P4 settles to M3 while ${pitchName(pair.start[1])} remains in place.` : 'The same sigh shifts upward by a whole step; its bass remains fixed.'}</p></div>)}
          </div>
          <Viz svg={staffSvg(pairs)} label="diagram-dyad-staff" />
          <Viz svg={pianoRollSvg(dyadEvents, 2, 'Two parallel sighs · two bars')} label="diagram-dyad-piano-roll" />
          <h3>Eight-bar expanded progression</h3>
          <div className="chord-ribbon" aria-label="Eight-bar chord progression" data-testid="progression-chord-ribbon">
            {['i(add9)', '♭VImaj7', '♭IImaj7', 'ivm9 / V7sus4'].map((chord, i) => <div className="chord-step" key={chord}><strong>{chord}</strong><span>{['BARS 1–2', 'BARS 3–4', 'BARS 5–6', 'BARS 7–8'][i]}</span></div>).flatMap((el, i) => i < 3 ? [el, <span className="arrow" key={`arrow-${i}`} aria-hidden="true">→</span>] : [el])}
          </div>
          <Viz svg={pianoRollSvg(progressionEvents, 8, `Eight-bar harmonic map · ${key} minor`)} label="diagram-eight-bar-progression" />
          <div className="note" data-testid="note-progression-ending">The final two bars briefly divide the closing color: <b>ivm9</b> opens the room, then <b>V7sus4</b> suspends the ending rather than forcing a resolution.</div>
        </>}
        {tab === 1 && <>
          <Heading number="02" title="The sincere fragment">A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.</Heading>
          <div className="grid-three">
            {[
              ['01', 'The Longing', 'Open with the ninth above the minor root. It asks a question without spelling out the answer.'],
              ['02', 'The Ache', 'Move down one semitone. Keep the touch and timing restrained; this is a small change with a large emotional effect.'],
              ['03', 'The Consolation', `Land on ${pitchName(root + 24)}, the major third of ♭VI in this example. Let the new chord carry the warmth.`],
            ].map(([n, title, copy]) => <div className="surface" key={n} data-testid={`card-melody-step-${n}`}><span className="step-number">{n}</span><h3 style={{ display: 'inline' }}>{title}</h3><p>{copy}</p></div>)}
          </div>
          <Viz svg={pianoRollSvg(melodyEvents(key), 8, `Right hand · fragment and breathing room · ${key}`, [2, 3, 4, 5])} label="diagram-sincere-fragment" />
          <div className="note" data-testid="note-melody-rest"><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</div>
        </>}
        {tab === 2 && <>
          <Heading number="03" title="Variations & transformations">Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.</Heading>
          <div className="keyline"><label htmlFor="variation-choice">Choose a transformation to inspect</label><select className="variation-select" id="variation-choice" value={variation} onChange={e => setVariation(Number(e.target.value))} data-testid="select-transformation">{VARIATIONS.map((v, i) => <option value={i} key={v.kind}>{v.name}</option>)}</select></div>
          <div className="surface" data-testid="selected-transformation"><div className="kicker">{currentVariation.name}</div><h3>{currentVariation.summary}</h3><p>{currentVariation.detail}</p></div>
          <Viz svg={pianoRollSvg(variationEvents(key, currentVariation.kind), 8, `${currentVariation.name} · ${key} minor`)} label="diagram-selected-transformation" />
          <h3>The full transformation catalog</h3>
          <div className="grid-two">{VARIATIONS.map(v => <article className="variation-card" key={v.kind} data-testid={`card-transformation-${v.kind}`}><strong>{v.name}</strong><span>{v.summary}</span></article>)}</div>
        </>}
        {tab === 3 && <>
          <Heading number="04" title="Mediated distance & sound design">The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.</Heading>
          <div className="grid-two">
            <div className="surface" data-testid="recipe-piano"><div className="kicker">Piano layer</div><h3>Soft felt tone</h3><p>Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).</p><ul><li>Velocity: 40–60</li><li>Warm, close mic perspective</li><li>Dark room decay; avoid a bright transient</li></ul></div>
            <div className="surface" data-testid="recipe-strings"><div className="kicker">String / pad swell</div><h3>Slow arrival</h3><p>Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).</p><ul><li>Attack: 600–900 ms</li><li>24 dB low-pass filter</li><li>Subtle chorus / ensemble</li></ul></div>
            <div className="surface" data-testid="recipe-granular"><div className="kicker">Granular residue</div><h3>Tail-only weather</h3><p>Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.</p><ul><li>Automate send on phrase tails</li><li>Keep the dry note recognizable</li><li>Do not smear the full mix</li></ul></div>
            <div className="surface" data-testid="recipe-bass"><div className="kicker">Bass layer</div><h3>Emotional floor</h3><p>Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.</p><ul><li>Filter below 300–500 Hz</li><li>Long, even sustain</li><li>Keep attacks soft and level low</li></ul></div>
          </div>
          <div className="note" data-testid="note-depth-arrangement">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</div>
        </>}
        {tab === 4 && <>
          <Heading number="05" title="Environmental setting & space">A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.</Heading>
          <Viz svg={mixMatrixSvg} label="diagram-environment-signal-flow" />
          <div className="grid-two">
            <div className="surface" data-testid="environment-listening-layers"><div className="kicker">Listening layers</div><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></div>
            <div className="surface" data-testid="environment-composition-prompt"><div className="kicker">Composition prompt</div><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></div>
          </div>
          <div className="note" data-testid="note-environment">The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>
        </>}
      </section>
      <footer className="footer">A COMPOSITION HANDBOOK · NO AUDIO OR MIDI GENERATION · USE THE DIAGRAMS AS WRITING PROMPTS</footer>
    </main>
  </div>;
}
export default App;
