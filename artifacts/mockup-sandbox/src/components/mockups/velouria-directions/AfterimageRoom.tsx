import { useMemo, useState } from "react";
import "./_group.css";
import "./AfterimageRoom.css";

const KEYS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const VARIATIONS = [
  ["01 · Ghost Note", "Skip the downbeat; let the phrase arrive already in motion.", "Begin on beat 1½ rather than beat 1. The listener hears a fragment of a thought, not a formal entrance. Leave the previous bar's decay unobstructed."],
  ["02 · Octave Dream", "Move the same phrase and harmony down one octave.", "Lower both hands by twelve semitones and keep the timing unchanged. The closer register feels private and weighted; reduce velocity slightly so the lower notes do not become percussive."],
  ["03 · Ringing Tail / Residue", "Hold one final tone through the bar line and into the space after it.", "Let the phrase end, then keep its last note alive across the next bar. The sustain belongs to the phrase tail; do not wash every note in granular processing."],
  ["04 · Warm Centre", "Land on the major third of ♭VI, then open the chord upward.", "Use the landing note as a stable centre, then outline the ♭VI major-seventh color above it. Keep the arpeggio unhurried and let the high note soften rather than announce a climax."],
  ["05 · Twin Peaks Lift", "Briefly brighten the dream chord, then melt back into minor.", "Let one major sonority rise as a second emotional peak. Return to the minor center without a strong dominant cadence; the lift should feel remembered, not resolved."],
  ["06 · Dorian Sigh", "Resolve downward to the natural sixth or second for wistful ambiguity.", "Borrow the Dorian natural sixth as a gentle alternative to the minor sixth. A downward landing on scale degree 6 or 2 keeps the phrase tender without making it sound fully settled."],
  ["07 · Late Breath", "Delay each melodic attack by half a beat.", "Place the first attack on beat 1½ and preserve the phrase's gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it."],
  ["08 · Drone Pedal", "Anchor all eight bars with a stationary open fifth.", "Sustain the root and fifth in the bass while the upper harmony moves. Keep the drone very soft and nearly texture-like; it is a floor, not a pulse."],
];
const NOTES = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const pitchName = (midi: number) => `${NOTES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

const recipes = [
  { name: "Piano layer", subtitle: "Soft felt tone", text: "Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).", details: ["Velocity: 40–60", "Warm, close mic perspective", "Dark room decay; avoid a bright transient"] },
  { name: "String / pad swell", subtitle: "Slow arrival", text: "Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).", details: ["Attack: 600–900 ms", "24 dB low-pass filter", "Subtle chorus / ensemble"] },
  { name: "Granular residue", subtitle: "Tail-only weather", text: "Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.", details: ["Automate send on phrase tails", "Keep the dry note recognizable", "Do not smear the full mix"] },
  { name: "Bass layer", subtitle: "Emotional floor", text: "Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.", details: ["Filter below 300–500 Hz", "Long, even sustain", "Keep attacks soft and level low"] },
];
const chapters = ["Foundation", "Sincere Fragment", "Transformations", "Sound Design", "Environment"];

function SectionTitle({ number, title, children }: { number: string; title: string; children: string }) {
  return <header className="ar-section-title"><span>MODULE {number}</span><h2>{title}</h2><p>{children}</p></header>;
}

function Notation({ pairs }: { pairs: { start: number[]; rest: number[] }[] }) {
  const groups = pairs.flatMap((pair) => [pair.start, pair.rest]);
  return (
    <div className="ar-score-wrap">
      <div className="ar-score-meta"><span>DYAD STUDY · TREBLE STAFF</span><span>ONE SEMITONE DOWN · BASS REMAINS STILL</span></div>
      <svg className="ar-score" viewBox="0 0 980 216" role="img" aria-label="Treble staff showing two transposable P4 to M3 dyad sighs">
        {[52, 72, 92, 112, 132].map((y) => <line key={y} x1="60" x2="940" y1={y} y2={y} stroke="#80909a" strokeOpacity=".42" />)}
        <text x="18" y="117" fill="#d8c59d" fontSize="46" fontFamily="Georgia,serif">𝄞</text>
        {groups.map((group, i) => {
          const x = 150 + i * 195;
          const topY = 66 - (group[0] - 60) * 3.35;
          const lowerY = 66 - (group[1] - 60) * 3.35;
          return <g key={`${i}-${group.join("-")}`}>
            <ellipse cx={x} cy={topY} rx="8" ry="5.5" fill="#e6c68f" transform={`rotate(-18 ${x} ${topY})`} />
            <ellipse cx={x + 27} cy={lowerY} rx="8" ry="5.5" fill="#e6c68f" transform={`rotate(-18 ${x + 27} ${lowerY})`} />
            <text x={x + 12} y="165" textAnchor="middle" fill="#eef0e9" fontSize="11" fontFamily="monospace">{group.map(pitchName).join(" + ")}</text>
            <text x={x + 12} y="184" textAnchor="middle" fill="#c7a875" fontSize="10" fontFamily="sans-serif">{i % 2 === 0 ? "P4 · suspension" : "M3 · release"}</text>
          </g>;
        })}
        <text x="400" y="207" textAnchor="middle" fill="#8d9ba1" fontSize="10">A still bass lets the upper voice sigh.</text>
        <text x="790" y="207" textAnchor="middle" fill="#8d9ba1" fontSize="10">Same motion, lifted by a whole step.</text>
      </svg>
    </div>
  );
}

function PianoMap({ keyName, pairs }: { keyName: string; pairs: { start: number[]; rest: number[] }[] }) {
  const notes = pairs.flatMap((pair, pairIndex) => [
    { pitch: pair.start[0], x: pairIndex * 4 + 1, label: "suspension" },
    { pitch: pair.start[1], x: pairIndex * 4 + 1, label: "" },
    { pitch: pair.rest[0], x: pairIndex * 4 + 3, label: "release" },
    { pitch: pair.rest[1], x: pairIndex * 4 + 3, label: "" },
  ]);
  return <div className="ar-roll">
    <div className="ar-roll-head"><span>TWO PARALLEL SIGHS · TWO BARS</span><span>TONAL CENTER · {keyName} MINOR</span></div>
    <div className="ar-roll-grid">
      <div className="ar-roll-labels">{[72, 60, 48].map((pitch) => <span key={pitch}>{pitchName(pitch)}</span>)}</div>
      <div className="ar-roll-chart">
        {Array.from({ length: 8 }, (_, i) => <div className="ar-beat" key={i}><small>{i < 4 ? "BAR 1" : "BAR 2"}</small></div>)}
        {notes.map((note, i) => {
          const y = Math.max(3, Math.min(90, ((72 - note.pitch) / 24) * 100));
          return <div key={i} className={`ar-note ${i % 4 > 1 ? "ar-note-release" : ""}`} style={{ left: `${note.x * 12.5 + 1}%`, top: `${y}%` }} title={`${note.label}: ${pitchName(note.pitch)}`}>
            <span>{pitchName(note.pitch)}</span>
          </div>;
        })}
      </div>
    </div>
    <p className="ar-roll-foot">P4 → M3 · the lower note stays fixed as the upper voice descends</p>
  </div>;
}

export function AfterimageRoom() {
  const [selectedKey, setSelectedKey] = useState("A♭");
  const [activeChapter, setActiveChapter] = useState(0);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const pairs = useMemo(() => {
    const root = 48 + KEYS.indexOf(selectedKey);
    return [
      { start: [root, root - 5], rest: [root - 1, root - 5] },
      { start: [root + 2, root - 3], rest: [root + 1, root - 3] },
    ];
  }, [selectedKey]);
  const rootPitch = pitchName(48 + KEYS.indexOf(selectedKey));

  return (
    <main className="velouria-preview afterimage-room">
      <div className="ar-grain" aria-hidden="true" />
      <div className="ar-haze ar-haze-one" aria-hidden="true" />
      <div className="ar-haze ar-haze-two" aria-hidden="true" />
      <div className="ar-rain" aria-hidden="true" />
      <div className="ar-shell">
        <div className="ar-topline"><span>VEL0URIA / FIELD GUIDE TO COMPOSITION</span><span>EDITION 01 <i>—</i> A LISTENING ROOM</span></div>
        <section className="ar-hero">
          <div className="ar-hero-copy">
            <div className="ar-kicker"><span className="ar-orb" /> A COMPOSITIONAL GUIDE <span className="ar-kicker-line" /></div>
            <h1>Velouria</h1>
            <p className="ar-pronunciation">Ve·lou·ri·a <span>/vəˈlʊər.i.ə/</span> · noun</p>
            <p className="ar-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
          </div>
          <div className="ar-hero-index"><span>01</span><p>THE SOUND<br />OF REMEMBERING</p><div className="ar-index-rule" /><small>AN OPEN GUIDE<br />FOR COMPOSERS</small></div>
          <div className="ar-dictionary-meta">
            <div><span className="ar-label">ETYMOLOGY</span><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div>
            <div><span className="ar-label">RELATED FORMS</span><p><b>Velouric</b> (adj.): Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria.</p><p><b>Velourian</b> (adj./n.): Directly embodying the aesthetic and compositional principles of Velouria.</p></div>
          </div>
          <button className="ar-disclosure" type="button" aria-expanded={dictionaryOpen} onClick={() => setDictionaryOpen(!dictionaryOpen)}>
            <span>{dictionaryOpen ? "Close the full entry" : "Read the full Velouria definition"}</span><span className="ar-disclosure-mark">{dictionaryOpen ? "−" : "+"}</span>
          </button>
          {dictionaryOpen && <div className="ar-full-entry">
            <h3>Core characteristics</h3>
            <ul>
              <li><b>Harmonic Suspension</b> — Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences.</li>
              <li><b>The Sincere Fragment</b> — Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity.</li>
              <li><b>Mediated Distance</b> — The use of degraded tape loops, granular residue, soft filtering, and room tone to give foreground instruments (such as felt piano or vintage polysynths) the impression of a half-remembered transmission.</li>
              <li><b>Environmental Setting</b> — Subtle integration of field recordings, sub-bass drones, and quiet room acoustics that establish an ambiguous physical space beneath the music.</li>
            </ul>
            <blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <b>Velouria</b>.”</blockquote>
            <p><b>Velouric</b> /vəˈlʊər.ɪk/ adjective: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</p>
            <p><b>Velourian</b> /vəˈlʊər.i.ən/ adjective &amp; noun: Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>); a composer, producer, or listener dedicated to the genre.</p>
          </div>}
        </section>

        <section className="ar-control-band" aria-label="Guide controls">
          <div className="ar-key-picker">
            <label htmlFor="ar-key">TONAL CENTER</label>
            <select id="ar-key" value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)}>
              {KEYS.map((key) => <option key={key} value={key}>{key} minor</option>)}
            </select>
            <small>ROOT VOICING · {rootPitch}</small>
          </div>
          <div className="ar-guide-note"><span className="ar-live-dot" /> All examples transpose with your selection.<br /><small>Reference diagrams only · no audio or MIDI generation</small></div>
        </section>

        <nav className="ar-tabs" aria-label="Guide chapters">
          {chapters.map((chapter, index) => <button key={chapter} type="button" aria-selected={activeChapter === index} onClick={() => setActiveChapter(index)}>
            <span>0{index + 1}</span>{chapter}
          </button>)}
        </nav>

        {activeChapter === 0 && <section className="ar-module">
          <SectionTitle number="01" title="Harmonic movement & dyads">A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.</SectionTitle>
          <div className="ar-pair-grid">
            {pairs.map((pair, i) => <article className="ar-pair-card" key={i}>
              <span className="ar-label">PAIR 0{i + 1} · {i === 0 ? "ROOT OVER FIFTH" : "STEP-UP ROOT"}</span>
              <div className="ar-pair-pitches"><strong>{pair.start.map(pitchName).join(" + ")}</strong><i>→</i><strong>{pair.rest.map(pitchName).join(" + ")}</strong></div>
              <p>{i === 0 ? `P4 settles to M3 while ${pitchName(pair.start[1])} remains in place.` : "The same sigh shifts upward by a whole step; its bass remains fixed."}</p>
            </article>)}
          </div>
          <Notation pairs={pairs} />
          <PianoMap keyName={selectedKey} pairs={pairs} />
          <div className="ar-progression">
            <div className="ar-progression-heading"><span>THE LONGER ARC</span><h3>Eight-bar expanded progression</h3><p>Four harmonic rooms; the ending suspends rather than insists.</p></div>
            <div className="ar-chord-flow">{[["i(add9)", "BARS 1–2"], ["♭VImaj7", "BARS 3–4"], ["♭IImaj7", "BARS 5–6"], ["ivm9 / V7sus4", "BARS 7–8"]].map(([chord, bars], i) => <div className="ar-chord" key={chord}><strong>{chord}</strong><small>{bars}</small>{i < 3 && <span>→</span>}</div>)}</div>
            <p className="ar-progression-note">The final two bars briefly divide the closing color: <b>ivm9</b> opens the room, then <b>V7sus4</b> suspends the ending rather than forcing a resolution.</p>
          </div>
        </section>}

        {activeChapter === 1 && <section className="ar-module">
          <SectionTitle number="02" title="The sincere fragment">A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.</SectionTitle>
          <div className="ar-fragment-steps">
            {[["01", "The Longing", `Open with the ninth above ${rootPitch}, the minor root. It asks a question without spelling out the answer.`], ["02", "The Ache", "Move down one semitone. Keep the touch and timing restrained; this is a small change with a large emotional effect."], ["03", "The Consolation", `Land on ${pitchName(48 + KEYS.indexOf(selectedKey) + 24)}, the major third of ♭VI in this example. Let the new chord carry the warmth.`]].map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className="ar-quote-note"><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</div>
          <div className="ar-rest-score"><span>01 · A SMALL THOUGHT</span><div className="ar-melody-line"><i>9th</i><b>—</b><i>♭10</i><b>—</b><i>♭VI · 3rd</i><b className="ar-rest">··················</b></div><small>Bars 1–3 speak. Bars 4–6 let the room answer. Bars 7–8 remember.</small></div>
        </section>}

        {activeChapter === 2 && <section className="ar-module">
          <SectionTitle number="03" title="Variations & transformations">Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.</SectionTitle>
          <div className="ar-variation-focus"><span className="ar-label">INSPECT A TRANSFORMATION</span><select value={selectedVariation} onChange={(e) => setSelectedVariation(Number(e.target.value))}>{VARIATIONS.map((v, i) => <option key={v[0]} value={i}>{v[0]}</option>)}</select><h3>{VARIATIONS[selectedVariation][1]}</h3><p>{VARIATIONS[selectedVariation][2]}</p></div>
          <div className="ar-catalog-heading"><span>THE FULL CATALOG</span><h3>Eight ways to keep the feeling, change the shape</h3></div>
          <div className="ar-variation-list">{VARIATIONS.map((v, i) => <button type="button" key={v[0]} aria-pressed={selectedVariation === i} onClick={() => setSelectedVariation(i)}><span>0{i + 1}</span><strong>{v[0].replace(/^\d+ · /, "")}</strong><small>{v[1]}</small><b>↗</b></button>)}</div>
        </section>}

        {activeChapter === 3 && <section className="ar-module">
          <SectionTitle number="04" title="Mediated distance & sound design">The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.</SectionTitle>
          <div className="ar-recipes">{recipes.map((recipe, i) => <article key={recipe.name}><div className="ar-recipe-count">0{i + 1} / LAYER</div><span className="ar-label">{recipe.name}</span><h3>{recipe.subtitle}</h3><p>{recipe.text}</p><ul>{recipe.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</div>
          <div className="ar-quote-note">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</div>
        </section>}

        {activeChapter === 4 && <section className="ar-module">
          <SectionTitle number="05" title="Environmental setting & space">A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.</SectionTitle>
          <div className="ar-environment-map">
            <div className="ar-env-heading"><span>DEPTH × FREQUENCY</span><small>NEAR ↓ FAR</small></div>
            <div className="ar-env-axis"><div className="ar-layer ar-layer-piano"><b>Piano · foreground</b><small>clear transient · warm mids · close perspective</small></div><div className="ar-layer ar-layer-pad"><b>Strings / pad · mid-ground</b><small>slow swell · softened top · wide but quiet</small></div><div className="ar-layer ar-layer-grain"><b>Granular residue · far edge</b><small>phrase tails only · diffuse high detail</small></div><div className="ar-layer ar-layer-room"><b>Room tone / environment · continuous, very low</b></div></div>
            <div className="ar-env-frequency">LOW ← FREQUENCY → HIGH</div>
          </div>
          <div className="ar-environment-cards"><article><span className="ar-label">LISTENING LAYERS</span><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></article><article><span className="ar-label">COMPOSITION PROMPT</span><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></article></div>
          <div className="ar-quote-note">The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>
        </section>}

        <footer className="ar-footer"><span>A COMPOSITION HANDBOOK</span><p>NO AUDIO OR MIDI GENERATION <i>·</i> USE THE DIAGRAMS AS WRITING PROMPTS</p><span>VELOURIA / 01</span></footer>
      </div>
    </main>
  );
}
