import { useState } from "react";
import "./_group.css";

const KEYS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const PITCH_NAMES = KEYS;
const MODULES = [
  { title: "Foundation", subtitle: "Harmonic movement & dyads", note: "Suspended fourths, held bass", purpose: "Build the guide’s signature P4-to-M3 sigh." },
  { title: "Sincere Fragment", subtitle: "The sincere fragment", note: "Three notes, then room", purpose: "Shape a short motif with longing, ache, and consolation." },
  { title: "Transformations", subtitle: "Variations & transformations", note: "Eight compositional moves", purpose: "Change one parameter at a time while keeping the emotional grammar." },
  { title: "Sound Design", subtitle: "Mediated distance & sound design", note: "Four layer recipes", purpose: "Separate layers by attack, register, width, and distance." },
  { title: "Environment", subtitle: "Environmental setting & space", note: "Place the listener somewhere", purpose: "Use quiet environmental cues to make harmony feel located." },
];
const VARIATIONS = [
  ["01 · Ghost Note", "Skip the downbeat; let the phrase arrive already in motion.", "Begin on beat 1½ rather than beat 1. The listener hears a fragment of a thought, not a formal entrance. Leave the previous bar’s decay unobstructed."],
  ["02 · Octave Dream", "Move the same phrase and harmony down one octave.", "Lower both hands by twelve semitones and keep the timing unchanged. The closer register feels private and weighted; reduce velocity slightly so the lower notes do not become percussive."],
  ["03 · Ringing Tail / Residue", "Hold one final tone through the bar line and into the space after it.", "Let the phrase end, then keep its last note alive across the next bar. The sustain belongs to the phrase tail; do not wash every note in granular processing."],
  ["04 · Warm Centre", "Land on the major third of ♭VI, then open the chord upward.", "Use the landing note as a stable centre, then outline the ♭VI major-seventh color above it. Keep the arpeggio unhurried and let the high note soften rather than announce a climax."],
  ["05 · Twin Peaks Lift", "Briefly brighten the dream chord, then melt back into minor.", "Let one major sonority rise as a second emotional peak. Return to the minor center without a strong dominant cadence; the lift should feel remembered, not resolved."],
  ["06 · Dorian Sigh", "Resolve downward to the natural sixth or second for wistful ambiguity.", "Borrow the Dorian natural sixth as a gentle alternative to the minor sixth. A downward landing on scale degree 6 or 2 keeps the phrase tender without making it sound fully settled."],
  ["07 · Late Breath", "Delay each melodic attack by half a beat.", "Place the first attack on beat 1½ and preserve the phrase’s gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it."],
  ["08 · Drone Pedal", "Anchor all eight bars with a stationary open fifth.", "Sustain the root and fifth in the bass while the upper harmony moves. Keep the drone very soft and nearly texture-like; it is a floor, not a pulse."],
];
const RECIPES = [
  { name: "Piano layer", tag: "01 / intimate foreground", title: "Soft felt tone", description: "Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).", details: ["Velocity: 40–60", "Warm, close mic perspective", "Dark room decay; avoid a bright transient"], level: "NEAR" },
  { name: "String / pad swell", tag: "02 / mid-ground", title: "Slow arrival", description: "Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).", details: ["Attack: 600–900 ms", "24 dB low-pass filter", "Subtle chorus / ensemble"], level: "MID" },
  { name: "Granular residue", tag: "03 / distant phrase edge", title: "Tail-only weather", description: "Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.", details: ["Automate send on phrase tails", "Keep the dry note recognizable", "Do not smear the full mix"], level: "FAR" },
  { name: "Bass layer", tag: "04 / emotional floor", title: "Quiet foundation", description: "Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.", details: ["Filter below 300–500 Hz", "Long, even sustain", "Keep attacks soft and level low"], level: "LOW" },
];

function midiName(midi: number) {
  return `${PITCH_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

function StaffFigure({ pairs }: { pairs: number[][][] }) {
  const groups = pairs.flatMap(([start, rest]) => [start, rest]);
  const centers = [150, 340, 570, 760];
  return (
    <svg className="ci-staff" viewBox="0 0 900 204" role="img" aria-label="Treble staff showing two fourth-to-third dyad movements">
      <text x="20" y="25" className="ci-svg-label">TREBLE STAFF · P4 SETTLES TO M3</text>
      {[61, 76, 91, 106, 121].map((y) => <line key={y} x1="54" x2="870" y1={y} y2={y} className="ci-staff-line" />)}
      <text x="19" y="121" className="ci-clef">𝄞</text>
      {groups.map((group, i) => {
        const center = centers[i];
        return (
          <g key={i}>
            {group.map((pitch, j) => {
              const x = center + (j === 0 ? 12 : -12);
              const y = 122 - (pitch - 48) * 2.35;
              return <g key={j}><ellipse cx={x} cy={y} rx="8" ry="5.2" transform={`rotate(-18 ${x} ${y})`} className="ci-notehead" /><line x1={x + 7} x2={x + 7} y1={y} y2={y - 28} className="ci-stem" /></g>;
            })}
            <text x={center} y="157" textAnchor="middle" className="ci-pitch-label">{group.map(midiName).join(" + ")}</text>
            <text x={center} y="178" textAnchor="middle" className="ci-relation">{i % 2 === 0 ? "P4 · suspension" : "M3 · release"}</text>
          </g>
        );
      })}
      <text x="245" y="198" textAnchor="middle" className="ci-note-caption">one semitone down · bass remains still</text>
      <text x="665" y="198" textAnchor="middle" className="ci-note-caption">same sigh, shifted up a whole step</text>
    </svg>
  );
}

function RollFigure({ pairs, title = "Two parallel sighs · two bars" }: { pairs: number[][][]; title?: string }) {
  const notes = pairs.flatMap(([a, b], pairIndex) => [
    ...a.map((pitch, i) => ({ pitch, start: pairIndex * 4, length: 1.7, label: i === 0 ? "P4" : "held bass" })),
    ...b.map((pitch, i) => ({ pitch, start: pairIndex * 4 + 2, length: 1.7, label: i === 0 ? "M3" : "held bass" })),
  ]);
  const min = Math.min(...notes.map((n) => n.pitch), 48) - 2;
  const max = Math.max(...notes.map((n) => n.pitch), 72) + 2;
  const top = 44, height = 176, left = 62, width = 794;
  return (
    <svg className="ci-roll" viewBox="0 0 900 258" role="img" aria-label={`${title}; transposed pitches shown in piano-roll notation`}>
      <text x="20" y="26" className="ci-svg-label">{title.toUpperCase()}</text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((bar) => <g key={bar}><line x1={left + bar * width / 8} x2={left + bar * width / 8} y1={top} y2={top + height} className="ci-grid-vert" />{bar < 8 && <text x={left + bar * width / 8 + 5} y="242" className="ci-bar-label">BAR {bar + 1}</text>}</g>)}
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((pitch) => {
        const y = top + (max - pitch) / (max - min) * height;
        return <g key={pitch}><line x1={left} x2={left + width} y1={y} y2={y} className={pitch % 12 === 0 ? "ci-grid-strong" : "ci-grid"} />{pitch % 12 === 0 && <text x="15" y={y + 3} className="ci-bar-label">{midiName(pitch)}</text>}</g>;
      })}
      {notes.map((n, i) => {
        const x = left + n.start / 8 * width + 3;
        const y = top + (max - n.pitch) / (max - min) * height - 3;
        const h = Math.max(7, height / (max - min) - 2);
        return <g key={i}><rect x={x} y={y} width={width * n.length / 8 - 6} height={h} rx="3" className={i % 2 ? "ci-roll-bass" : "ci-roll-note"} /><title>{`${n.label}: ${midiName(n.pitch)}`}</title></g>;
      })}
    </svg>
  );
}

function ChapterContent({ active, keyName, pairs, root }: { active: number; keyName: string; pairs: number[][][]; root: number }) {
  const [variation, setVariation] = useState(0);
  if (active === 0) return (
    <>
      <div className="ci-module-head"><div><div className="ci-kicker">MODULE 01 / FOUNDATION</div><h2>Harmonic movement &amp; dyads</h2><p>A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.</p></div><div className="ci-mark">01</div></div>
      <div className="ci-pair-grid">
        <div className="ci-pair"><div className="ci-label">PAIR 1 · ROOT OVER FIFTH <span>P4 → M3</span></div><strong>{pairs[0][0].map(midiName).join(" + ")} <i>→</i> {pairs[0][1].map(midiName).join(" + ")}</strong><p>P4 settles to M3 while {midiName(pairs[0][0][1])} remains in place.</p></div>
        <div className="ci-pair"><div className="ci-label">PAIR 2 · STEP-UP ROOT <span>P4 → M3</span></div><strong>{pairs[1][0].map(midiName).join(" + ")} <i>→</i> {pairs[1][1].map(midiName).join(" + ")}</strong><p>The same sigh shifts upward by a whole step; its bass remains fixed.</p></div>
      </div>
      <div className="ci-notation"><div className="ci-figure-top"><span>NOTATION STUDY</span><span>01—02 / MOVEMENT</span></div><StaffFigure pairs={pairs} /></div>
      <div className="ci-notation ci-roll-wrap"><div className="ci-figure-top"><span>PIANO ROLL</span><span>Two parallel sighs · two bars</span></div><RollFigure pairs={pairs} /></div>
      <div className="ci-progression-head"><div><div className="ci-kicker">EIGHT-BAR EXPANSION</div><h3>A room that opens, then holds</h3></div><span>TONAL CENTER · {keyName} MINOR</span></div>
      <div className="ci-chord-ribbon">{[["i(add9)", "BARS 1–2"], ["♭VImaj7", "BARS 3–4"], ["♭IImaj7", "BARS 5–6"], ["ivm9 / V7sus4", "BARS 7–8"]].map(([chord, bars], i) => <div className="ci-chord" key={chord}><b>{chord}</b><span>{bars}</span>{i < 3 && <i>→</i>}</div>)}</div>
      <div className="ci-callout"><span className="ci-callout-rule" />The final two bars briefly divide the closing color: <b>ivm9</b> opens the room, then <b>V7sus4</b> suspends the ending rather than forcing a resolution.</div>
    </>
  );
  if (active === 1) return (
    <>
      <div className="ci-module-head"><div><div className="ci-kicker">MODULE 02 / MELODY</div><h2>The sincere fragment</h2><p>A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.</p></div><div className="ci-mark">02</div></div>
      <div className="ci-steps">{[["01", "The Longing", "Open with the ninth above the minor root. It asks a question without spelling out the answer."], ["02", "The Ache", "Move down one semitone. Keep the touch and timing restrained; this is a small change with a large emotional effect."], ["03", "The Consolation", `Land on ${midiName(root + 24)}, the major third of ♭VI in this example. Let the new chord carry the warmth.`]].map(([n, title, copy]) => <article className="ci-step" key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      <div className="ci-notation ci-roll-wrap"><div className="ci-figure-top"><span>RIGHT HAND · FRAGMENT & BREATHING ROOM</span><span>{keyName} MINOR</span></div><RollFigure title="Three notes, then breathing room" pairs={[[[root + 26, root + 25], [root + 24, root + 24]], [[root + 26, root + 25], [root + 24, root + 24]]]} /></div>
      <div className="ci-callout"><span className="ci-callout-rule" /><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</div>
    </>
  );
  if (active === 2) return (
    <>
      <div className="ci-module-head"><div><div className="ci-kicker">MODULE 03 / DEVELOPMENT</div><h2>Variations &amp; transformations</h2><p>Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.</p></div><div className="ci-mark">03</div></div>
      <div className="ci-variation-select"><label htmlFor="ci-variation">INSPECT A TRANSFORMATION</label><select id="ci-variation" value={variation} onChange={(event) => setVariation(Number(event.target.value))}>{VARIATIONS.map(([name], i) => <option key={name} value={i}>{name}</option>)}</select></div>
      <article className="ci-feature-variation"><span>{VARIATIONS[variation][0]}</span><h3>{VARIATIONS[variation][1]}</h3><p>{VARIATIONS[variation][2]}</p></article>
      <div className="ci-kicker ci-catalog-title">THE FULL TRANSFORMATION CATALOG / 08</div><div className="ci-variation-list">{VARIATIONS.map(([name, summary], i) => <button className={`ci-variation-row ${variation === i ? "is-selected" : ""}`} key={name} onClick={() => setVariation(i)}><span>{String(i + 1).padStart(2, "0")}</span><b>{name.replace(/^\d+ · /, "")}</b><small>{summary}</small><span aria-hidden="true">↗</span></button>)}</div>
    </>
  );
  if (active === 3) return (
    <>
      <div className="ci-module-head"><div><div className="ci-kicker">MODULE 04 / TEXTURE</div><h2>Mediated distance &amp; sound design</h2><p>The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.</p></div><div className="ci-mark">04</div></div>
      <div className="ci-recipe-stack">{RECIPES.map((recipe, i) => <article className="ci-recipe" key={recipe.name}><div className="ci-recipe-side"><span>{recipe.tag}</span><strong>{recipe.level}</strong><div className={`ci-distance ci-distance-${i}`} /></div><div className="ci-recipe-body"><h3>{recipe.name} <em>— {recipe.title}</em></h3><p>{recipe.description}</p><ul>{recipe.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div></article>)}</div>
      <div className="ci-callout"><span className="ci-callout-rule" />Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</div>
      <div className="ci-boundary"><span>WORKING BOUNDARY</span><b>No audio or MIDI generation.</b><p>Use the diagrams as writing prompts; build and audition the arrangement in your own studio.</p></div>
    </>
  );
  return (
    <>
      <div className="ci-module-head"><div><div className="ci-kicker">MODULE 05 / PLACE</div><h2>Environmental setting &amp; space</h2><p>A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.</p></div><div className="ci-mark">05</div></div>
      <div className="ci-space-map"><div className="ci-figure-top"><span>DEPTH × FREQUENCY</span><span>SIGNAL-FLOW MAP</span></div><div className="ci-axis"><span>NEAR</span><span>FAR</span></div><div className="ci-map-rows">{[["Piano · foreground", "clear transient · warm mids · close perspective", "near"], ["Strings / pad · mid-ground", "slow swell · softened top · wide but quiet", "mid"], ["Granular residue · far edge", "phrase tails only · diffuse high detail", "far"], ["Room tone / environment", "continuous, very low", "ambient"]].map(([title, desc, kind]) => <div className={`ci-map-row ci-map-${kind}`} key={title}><b>{title}</b><span>{desc}</span></div>)}</div><div className="ci-frequency">LOW ← FREQUENCY → HIGH</div></div>
      <div className="ci-env-grid"><article><div className="ci-kicker">LISTENING LAYERS</div><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></article><article><div className="ci-kicker">COMPOSITION PROMPT</div><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></article></div>
      <div className="ci-callout"><span className="ci-callout-rule" />The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>
    </>
  );
}

export function ChamberIndex() {
  const [keyName, setKeyName] = useState("A♭");
  const [active, setActive] = useState(0);
  const root = 48 + KEYS.indexOf(keyName);
  const pairs = [
    [[root, root - 5], [root - 1, root - 5]],
    [[root + 2, root - 3], [root + 1, root - 3]],
  ];
  return (
    <main className="velouria-preview chamber-index">
      <div className="ci-page">
        <header className="ci-topbar"><a href="#top" className="ci-brand"><span className="ci-emblem">V</span><span>VELOURIA<small>THE COMPOSITIONAL GUIDE</small></span></a><div className="ci-edition"><span>WORKING ATLAS</span><b>EDITION 01</b></div></header>
        <section className="ci-identity" id="top">
          <div className="ci-identity-top"><div><div className="ci-overline">A FIELD GUIDE TO COMPOSITION <i>·</i> 01—05</div><h1>Velouria</h1><div className="ci-pronunciation">Ve·lou·ri·a <span>/vəˈlʊər.i.ə/ · noun</span></div></div><div className="ci-definition-index">DICTIONARY<br />ENTRY <span>01.01</span></div></div>
          <p className="ci-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
          <div className="ci-dictionary-meta"><div><div className="ci-label">ETYMOLOGY</div><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div><div><div className="ci-label">RELATED FORMS</div><p><b>Velouric</b> (adj.): Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria.</p><p><b>Velourian</b> (adj./n.): Directly embodying the aesthetic and compositional principles of Velouria.</p></div></div>
          <details className="ci-disclosure"><summary><span>Read the full Velouria definition</span><span className="ci-disclosure-icon">+</span></summary><div className="ci-full-definition"><h3>Inflections &amp; related forms</h3><p><b>Velouric</b> /vəˈlʊər.ɪk/ <i>adjective</i>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</p><p><b>Velourian</b> /vəˈlʊər.i.ən/ <i>adjective &amp; noun</i>: Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>); or a composer, producer, or listener dedicated to the genre.</p><h3>Core characteristics</h3><ul><li><b>Harmonic Suspension:</b> Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences.</li><li><b>The Sincere Fragment:</b> Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity.</li><li><b>Mediated Distance:</b> Degraded tape loops, granular residue, soft filtering, and room tone lend foreground instruments the impression of a half-remembered transmission.</li><li><b>Environmental Setting:</b> Subtle field recordings, sub-bass drones, and quiet room acoustics establish an ambiguous physical space beneath the music.</li></ul><h3>Example in context</h3><blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <b>Velouria</b>.”</blockquote></div></details>
        </section>
        <section className="ci-controls" aria-label="Composition guide controls"><div className="ci-key-control"><label htmlFor="ci-key">TONAL CENTER</label><div className="ci-select-wrap"><select id="ci-key" value={keyName} onChange={(event) => setKeyName(event.target.value)}>{KEYS.map((key) => <option key={key}>{key}</option>)}</select><span aria-hidden="true">⌄</span></div><small>{keyName} MINOR <i>·</i> ROOT VOICING {midiName(root)}</small></div><div className="ci-control-separator" /><div className="ci-current-lesson"><span>IN THIS STUDY</span><b>{MODULES[active].note}</b><small>Examples transpose with your selection</small></div><div className="ci-no-audio"><span className="ci-no-audio-mark">—</span><div><b>Reference only</b><small>No audio or MIDI output</small></div></div></section>
        <nav className="ci-chapters" aria-label="Guide chapters" role="tablist">{MODULES.map((module, i) => <button key={module.title} type="button" role="tab" aria-selected={active === i} aria-controls="ci-chapter-panel" id={`ci-tab-${i}`} onClick={() => setActive(i)} className={active === i ? "is-active" : ""}><span className="ci-tab-number">0{i + 1}</span><span className="ci-tab-name">{module.title}</span><span className="ci-tab-purpose">{module.purpose}</span></button>)}</nav>
        <section className="ci-chapter-panel" id="ci-chapter-panel" role="tabpanel" aria-labelledby={`ci-tab-${active}`} key={active}><ChapterContent active={active} keyName={keyName} pairs={pairs} root={root} /></section>
        <footer className="ci-footer"><span>A COMPOSITION HANDBOOK</span><span>NO AUDIO OR MIDI GENERATION <i>·</i> USE DIAGRAMS AS WRITING PROMPTS</span><span>V.01</span></footer>
      </div>
      <style>{`
        .chamber-index { --ink:#233332; --ink-soft:#4e5d57; --muted:#778078; --paper:#f2efe6; --paper-light:#f8f6ef; --line:#d7d2c5; --gold:#9c7745; --gold-light:#c4a873; --sage:#76877e; background:#e8e4d9; color:var(--ink); min-height:100vh; padding:28px 34px 54px; }
        .chamber-index * { box-sizing:border-box; }
        .ci-page { width:min(1280px,100%); margin:0 auto; }
        .ci-topbar { height:48px; display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
        .ci-brand { display:flex; align-items:center; gap:11px; color:var(--ink); text-decoration:none; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.14em; }
        .ci-brand small { display:block; margin-top:4px; color:var(--muted); font-size:8px; letter-spacing:.12em; }
        .ci-emblem { width:31px; height:31px; display:grid; place-items:center; border:1px solid var(--gold); border-radius:50%; color:var(--gold); font-family:Georgia,serif; font-size:17px; letter-spacing:0; }
        .ci-edition { display:flex; gap:22px; font:9px 'Space Mono',monospace; letter-spacing:.12em; color:var(--muted); }
        .ci-edition b { font-weight:400; color:var(--gold); }
        .ci-identity { position:relative; overflow:hidden; border:1px solid #c8c0ae; background:linear-gradient(118deg,#f7f4eb 0%,#efebdf 58%,#e4e3d8 100%); padding:27px 34px 18px; box-shadow:0 10px 30px rgba(43,47,39,.06); }
        .ci-identity:after { content:""; position:absolute; pointer-events:none; right:-92px; top:-138px; width:390px; height:390px; border:1px solid rgba(156,119,69,.14); border-radius:50%; box-shadow:0 0 0 26px rgba(156,119,69,.025),0 0 0 54px rgba(156,119,69,.025),0 0 0 84px rgba(156,119,69,.02); }
        .ci-identity-top { display:flex; justify-content:space-between; align-items:flex-start; position:relative; z-index:1; }
        .ci-overline,.ci-label,.ci-kicker,.ci-figure-top,.ci-definition-index,.ci-control-separator,.ci-footer,.ci-key-control label,.ci-current-lesson>span,.ci-no-audio small,.ci-recipe-side>span,.ci-variation-select label { font-family:'Space Mono',monospace; text-transform:uppercase; letter-spacing:.12em; }
        .ci-overline { color:#86785e; font-size:9px; }
        .ci-overline i { color:#ae9a71; font-style:normal; padding:0 5px; }
        .ci-identity h1 { margin:8px 0 1px; font:500 clamp(48px,5.2vw,67px)/.98 Georgia,'Times New Roman',serif; letter-spacing:-.055em; color:#293a37; }
        .ci-pronunciation { font:12px 'Space Mono',monospace; color:#91734c; }
        .ci-pronunciation span { color:#817e73; }
        .ci-definition-index { text-align:right; font-size:9px; line-height:1.8; color:#897b62; position:relative; z-index:1; }
        .ci-definition-index span { color:#263a36; }
        .ci-definition { max-width:870px; margin:15px 0 18px; color:#394944; font-size:15px; line-height:1.56; }
        .ci-dictionary-meta { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1.08fr; gap:36px; border-top:1px solid #d4cbb9; padding-top:12px; }
        .ci-label { color:#967444; font-size:8px; }
        .ci-dictionary-meta p { margin:5px 0 0; color:#676e65; font-size:11px; line-height:1.48; }
        .ci-dictionary-meta p+p { margin-top:3px; }
        .ci-dictionary-meta b { color:#394944; }
        .ci-disclosure { position:relative; z-index:1; margin-top:11px; border-top:1px solid #ddd6c8; }
        .ci-disclosure summary { display:flex; justify-content:space-between; align-items:center; padding:9px 0 0; color:#78694f; font:10px 'Space Mono',monospace; cursor:pointer; list-style:none; }
        .ci-disclosure summary::-webkit-details-marker { display:none; }
        .ci-disclosure summary:focus-visible,.ci-chapters button:focus-visible,.ci-variation-row:focus-visible,.ci-select-wrap select:focus-visible,.ci-variation-select select:focus-visible { outline:2px solid #a37d49; outline-offset:3px; }
        .ci-disclosure-icon { width:19px; height:19px; border:1px solid #c8b99c; border-radius:50%; display:grid; place-items:center; font:14px Georgia,serif; transition:transform .2s; }
        .ci-disclosure[open] .ci-disclosure-icon { transform:rotate(45deg); }
        .ci-full-definition { max-width:920px; padding:11px 0 4px; color:#5d665e; font-size:12px; line-height:1.6; }
        .ci-full-definition h3 { margin:13px 0 4px; color:#354640; font:17px Georgia,serif; }
        .ci-full-definition p { margin:6px 0; }
        .ci-full-definition ul { padding-left:18px; }
        .ci-full-definition li { padding:2px 0; }
        .ci-full-definition blockquote { margin:7px 0; padding-left:14px; border-left:2px solid #b49a6f; font-family:Georgia,serif; font-style:italic; }
        .ci-controls { margin:13px 0 12px; min-height:66px; display:flex; align-items:center; gap:25px; padding:11px 19px; background:#293b38; color:#ece8dc; }
        .ci-key-control { min-width:180px; }
        .ci-key-control label { display:block; font-size:8px; color:#cbb78f; margin-bottom:4px; }
        .ci-select-wrap { display:flex; align-items:center; width:100%; position:relative; }
        .ci-select-wrap select { width:100%; appearance:none; border:0; border-bottom:1px solid #82918a; background:transparent; color:#f1ede1; padding:1px 22px 3px 0; font:19px Georgia,serif; cursor:pointer; }
        .ci-select-wrap select option { color:#283b37; background:#f4f1e8; }
        .ci-select-wrap>span { position:absolute; right:0; color:#cbb78f; pointer-events:none; }
        .ci-key-control small,.ci-current-lesson small { display:block; margin-top:4px; color:#b4bcb1; font:8px 'Space Mono',monospace; letter-spacing:.04em; }
        .ci-key-control small i { color:#d5bb86; font-style:normal; padding:0 3px; }
        .ci-control-separator { height:36px; width:1px; background:#53655f; }
        .ci-current-lesson { flex:1; min-width:180px; }
        .ci-current-lesson>span { display:block; color:#cbb78f; font-size:8px; margin-bottom:5px; }
        .ci-current-lesson b { display:block; font:15px Georgia,serif; font-weight:400; }
        .ci-no-audio { display:flex; align-items:center; gap:9px; border-left:1px solid #53655f; padding-left:20px; }
        .ci-no-audio-mark { width:21px; height:21px; display:grid; place-items:center; border:1px solid #8c998a; border-radius:50%; color:#d0bd97; }
        .ci-no-audio b { font:11px Georgia,serif; font-weight:400; display:block; }
        .ci-no-audio small { display:block; margin-top:3px; color:#b4bcb1; font-size:7px; letter-spacing:.05em; }
        .ci-chapters { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); border-bottom:1px solid #c8c4b8; }
        .ci-chapters button { position:relative; min-height:83px; text-align:left; border:0; border-right:1px solid #d5d1c6; background:transparent; color:#55635c; padding:12px 13px 11px; cursor:pointer; transition:background .2s,color .2s; }
        .ci-chapters button:first-child { border-left:1px solid #d5d1c6; }
        .ci-chapters button:hover { background:rgba(248,246,239,.66); }
        .ci-chapters button.is-active { background:#f5f2e9; color:#263a36; }
        .ci-chapters button.is-active:after { content:""; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:#a5804f; }
        .ci-tab-number { display:block; color:#9a8058; font:9px 'Space Mono',monospace; margin-bottom:6px; }
        .ci-tab-name { display:block; font:14px Georgia,serif; }
        .ci-tab-purpose { display:block; margin-top:5px; color:#7d8278; font-size:9px; line-height:1.3; }
        .ci-chapter-panel { padding:23px 24px 22px; background:#f7f5ee; border:1px solid #d6d1c4; border-top:0; animation:ci-enter .32s ease both; }
        @keyframes ci-enter { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .ci-module-head { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; margin-bottom:19px; }
        .ci-kicker { color:#987746; font-size:8px; }
        .ci-module-head h2 { margin:5px 0 5px; font:400 27px/1.1 Georgia,serif; letter-spacing:-.025em; color:#2d3e39; }
        .ci-module-head p { max-width:810px; margin:0; color:#6d756d; font-size:12px; line-height:1.56; }
        .ci-mark { color:#b5a37e; font:33px Georgia,serif; border-left:1px solid #d4cec0; padding-left:19px; }
        .ci-pair-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:13px; }
        .ci-pair { background:#efede4; border:1px solid #ded9cc; padding:12px 15px 10px; }
        .ci-label { display:flex; justify-content:space-between; font-size:8px; color:#7d806f; }
        .ci-label span { color:#a0804f; }
        .ci-pair strong { display:block; margin:7px 0 4px; color:#293d38; font:20px Georgia,serif; letter-spacing:-.02em; }
        .ci-pair strong i { padding:0 5px; color:#a5844f; font:italic 17px Georgia,serif; }
        .ci-pair p { margin:0; color:#70776e; font-size:10px; }
        .ci-notation { border:1px solid #ded9cc; background:#eeece3; padding:7px 12px 5px; margin-top:12px; }
        .ci-figure-top { display:flex; justify-content:space-between; color:#8f7957; font-size:7px; padding:1px 1px 4px; }
        .ci-staff,.ci-roll { display:block; width:100%; height:auto; }
        .ci-staff-line { stroke:#a9a89d; stroke-width:1; }
        .ci-svg-label { fill:#8d7958; font:9px 'Space Mono',monospace; letter-spacing:1px; }
        .ci-clef { fill:#8b795c; font:57px Georgia,serif; }
        .ci-notehead { fill:#a78550; stroke:#715f43; stroke-width:1; }
        .ci-stem { stroke:#a78550; stroke-width:1.6; }
        .ci-pitch-label { fill:#36443e; font:10px 'Space Mono',monospace; }
        .ci-relation { fill:#9b7745; font:10px Georgia,serif; }
        .ci-note-caption { fill:#7f8379; font:9px Georgia,serif; font-style:italic; }
        .ci-roll-wrap { padding-bottom:2px; }
        .ci-grid-vert { stroke:#c9c6ba; stroke-width:1; }
        .ci-grid { stroke:#d7d4ca; stroke-width:.7; }
        .ci-grid-strong { stroke:#aead9f; stroke-width:1; }
        .ci-bar-label { fill:#7b8179; font:8px 'Space Mono',monospace; }
        .ci-roll-note { fill:#b3945c; }
        .ci-roll-bass { fill:#7e9188; }
        .ci-progression-head { display:flex; justify-content:space-between; align-items:end; margin:17px 0 8px; }
        .ci-progression-head h3 { margin:4px 0 0; font:19px Georgia,serif; color:#34443f; }
        .ci-progression-head>span { color:#888579; font:8px 'Space Mono',monospace; letter-spacing:.08em; }
        .ci-chord-ribbon { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
        .ci-chord { position:relative; padding:9px 11px; border:1px solid #ded9cc; background:#efede5; }
        .ci-chord b { display:block; font:14px Georgia,serif; color:#42534c; }
        .ci-chord span { display:block; margin-top:4px; color:#88877d; font:7px 'Space Mono',monospace; }
        .ci-chord i { position:absolute; right:-10px; top:13px; z-index:1; color:#9f8357; font-style:normal; }
        .ci-callout { display:flex; gap:10px; align-items:flex-start; margin-top:13px; padding:7px 0 0; color:#6e766d; font-size:10px; line-height:1.5; }
        .ci-callout-rule { display:block; flex:0 0 2px; height:27px; background:#ae9060; }
        .ci-callout b { color:#3e5048; }
        .ci-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:5px 0 15px; }
        .ci-step { display:flex; gap:11px; padding:14px; background:#efede5; border:1px solid #ded9cc; }
        .ci-step>span { font:10px 'Space Mono',monospace; color:#9a7b4e; }
        .ci-step h3 { margin:0 0 5px; font:17px Georgia,serif; color:#34463f; }
        .ci-step p { margin:0; color:#72786f; font-size:10px; line-height:1.5; }
        .ci-variation-select { display:flex; align-items:center; gap:18px; background:#eeece3; padding:12px 14px; border:1px solid #ded9cc; }
        .ci-variation-select label { color:#8b744e; font-size:8px; }
        .ci-variation-select select { flex:1; border:0; border-bottom:1px solid #bcb7aa; padding:6px 4px; background:transparent; color:#34463f; font:15px Georgia,serif; }
        .ci-feature-variation { margin:12px 0; padding:18px; border-left:2px solid #a7895a; background:#eeece3; }
        .ci-feature-variation>span { color:#987746; font:8px 'Space Mono',monospace; }
        .ci-feature-variation h3 { margin:6px 0; color:#30423c; font:21px Georgia,serif; }
        .ci-feature-variation p { margin:0; color:#6b746c; font-size:11px; line-height:1.55; }
        .ci-catalog-title { margin:18px 0 7px; }
        .ci-variation-list { border-top:1px solid #dcd7ca; }
        .ci-variation-row { width:100%; display:grid; grid-template-columns:34px 150px 1fr 18px; align-items:center; gap:8px; text-align:left; padding:9px 10px; border:0; border-bottom:1px solid #ded9cc; background:transparent; color:#526057; cursor:pointer; }
        .ci-variation-row:hover,.ci-variation-row.is-selected { background:#eeece3; }
        .ci-variation-row>span:first-child { color:#9a7c50; font:9px 'Space Mono',monospace; }
        .ci-variation-row b { font:14px Georgia,serif; font-weight:400; }
        .ci-variation-row small { color:#777d73; font-size:10px; }
        .ci-variation-row>span:last-child { color:#9b8058; }
        .ci-recipe-stack { display:grid; gap:9px; }
        .ci-recipe { display:grid; grid-template-columns:155px 1fr; border:1px solid #ded9cc; background:#efede5; }
        .ci-recipe-side { display:flex; flex-direction:column; justify-content:space-between; min-height:126px; border-right:1px solid #d8d3c6; padding:12px 13px; }
        .ci-recipe-side>span { color:#8d7958; font-size:7px; line-height:1.45; }
        .ci-recipe-side>strong { color:#607169; font:17px Georgia,serif; font-weight:400; }
        .ci-distance { width:100%; height:4px; background:#d3d0c5; position:relative; overflow:hidden; }
        .ci-distance:after { content:""; height:100%; display:block; background:#a98a58; }
        .ci-distance-0:after { width:82%; }.ci-distance-1:after { width:59%; }.ci-distance-2:after { width:36%; }.ci-distance-3:after { width:21%; }
        .ci-recipe-body { padding:11px 16px; }
        .ci-recipe-body h3 { margin:0; color:#34463f; font:18px Georgia,serif; }
        .ci-recipe-body h3 em { color:#8d7958; font:italic 14px Georgia,serif; }
        .ci-recipe-body p { margin:5px 0 7px; color:#6f766d; font-size:10px; line-height:1.45; }
        .ci-recipe-body ul { display:flex; flex-wrap:wrap; gap:4px 18px; list-style:none; padding:0; margin:0; }
        .ci-recipe-body li { color:#58675f; font-size:9px; }
        .ci-recipe-body li:before { content:"· "; color:#a27f4d; font-weight:bold; }
        .ci-boundary { margin-top:15px; padding:13px 15px; border:1px solid #d8d2c3; background:#ebe9df; }
        .ci-boundary span { display:block; margin-bottom:5px; color:#987746; font:8px 'Space Mono',monospace; letter-spacing:.1em; }
        .ci-boundary b { color:#3b4d45; font:16px Georgia,serif; font-weight:400; }
        .ci-boundary p { margin:4px 0 0; color:#73796f; font-size:10px; }
        .ci-space-map { position:relative; padding:7px 15px 17px 58px; border:1px solid #ded9cc; background:#efede5; }
        .ci-axis { position:absolute; left:14px; top:49px; bottom:41px; display:flex; flex-direction:column; justify-content:space-between; color:#8a795a; font:8px 'Space Mono',monospace; writing-mode:vertical-rl; transform:rotate(180deg); }
        .ci-map-rows { display:grid; gap:5px; margin-top:9px; }
        .ci-map-row { display:flex; flex-direction:column; gap:3px; padding:11px 15px; border:1px solid; }
        .ci-map-row b { font:16px Georgia,serif; font-weight:400; }
        .ci-map-row span { font-size:9px; }
        .ci-map-near { margin-right:44%; background:#e7dfc9; border-color:#c7b990; color:#645943; }
        .ci-map-mid { margin-left:13%; margin-right:24%; background:#e4e7df; border-color:#c2cabe; color:#4e6258; }
        .ci-map-far { margin-left:29%; margin-right:11%; background:#e6e2e8; border-color:#cbc2ce; color:#63596b; }
        .ci-map-ambient { background:#e2e8e1; border-color:#c2cfc2; color:#4f6256; }
        .ci-frequency { text-align:center; margin-top:7px; color:#8a8374; font:8px 'Space Mono',monospace; }
        .ci-env-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; margin-top:12px; }
        .ci-env-grid article { padding:14px 16px; border:1px solid #ded9cc; background:#efede5; }
        .ci-env-grid h3 { margin:5px 0 8px; font:19px Georgia,serif; color:#34463f; }
        .ci-env-grid p { margin:5px 0; color:#6d756c; font-size:10px; line-height:1.48; }
        .ci-env-grid b { color:#41534a; }
        .ci-footer { display:flex; justify-content:space-between; gap:10px; padding:13px 2px 0; color:#817e72; font-size:7px; }
        .ci-footer i { color:#a78b5e; font-style:normal; padding:0 4px; }
        @media(max-width:850px) { .chamber-index{padding:18px 16px 36px}.ci-identity{padding:22px}.ci-chapters{grid-template-columns:repeat(5,minmax(115px,1fr));overflow-x:auto}.ci-chapters button{min-height:80px;padding:10px}.ci-tab-purpose{display:none}.ci-chapter-panel{padding:19px 17px}.ci-controls{gap:15px}.ci-current-lesson{min-width:150px}.ci-recipe{grid-template-columns:125px 1fr} }
        @media(max-width:600px) { .chamber-index{padding:12px 10px 28px}.ci-topbar{margin-bottom:10px}.ci-edition{gap:8px;font-size:7px}.ci-identity{padding:19px 16px 14px}.ci-identity h1{font-size:52px}.ci-definition-index{font-size:7px}.ci-definition{font-size:13px;margin:12px 0}.ci-dictionary-meta{grid-template-columns:1fr;gap:10px}.ci-controls{align-items:stretch;flex-wrap:wrap;padding:12px;gap:11px}.ci-key-control{width:calc(50% - 7px);min-width:0}.ci-control-separator{display:none}.ci-current-lesson{width:calc(50% - 7px);min-width:0;border-left:1px solid #53655f;padding-left:12px}.ci-no-audio{width:100%;border-left:0;border-top:1px solid #53655f;padding:9px 0 0}.ci-chapters{grid-template-columns:repeat(5,105px)}.ci-tab-name{font-size:12px}.ci-module-head h2{font-size:23px}.ci-module-head p{font-size:11px}.ci-mark{font-size:26px;padding-left:11px}.ci-pair-grid,.ci-steps,.ci-env-grid{grid-template-columns:1fr}.ci-pair strong{font-size:17px}.ci-notation{padding:6px}.ci-staff{min-width:620px}.ci-notation:has(.ci-staff){overflow-x:auto}.ci-roll{min-width:590px}.ci-roll-wrap{overflow-x:auto}.ci-progression-head{display:block}.ci-progression-head>span{display:block;margin-top:7px}.ci-chord-ribbon{grid-template-columns:repeat(2,1fr)}.ci-chord i{display:none}.ci-variation-select{display:block}.ci-variation-select select{width:100%;margin-top:6px}.ci-variation-row{grid-template-columns:24px 104px 1fr 12px;padding:8px 5px;gap:5px}.ci-variation-row b{font-size:12px}.ci-variation-row small{font-size:9px}.ci-recipe{grid-template-columns:1fr}.ci-recipe-side{min-height:60px;flex-direction:row;align-items:center;border-right:0;border-bottom:1px solid #d8d3c6}.ci-distance{width:80px}.ci-recipe-body ul{display:block}.ci-recipe-body li{margin:3px 0}.ci-map-near{margin-right:10%}.ci-map-mid{margin-left:8%;margin-right:4%}.ci-map-far{margin-left:17%;margin-right:0}.ci-footer{flex-direction:column}.ci-identity:after{right:-250px} }
        @media(prefers-reduced-motion:reduce){.chamber-index *{animation:none!important;transition:none!important}}
      `}</style>
    </main>
  );
}
