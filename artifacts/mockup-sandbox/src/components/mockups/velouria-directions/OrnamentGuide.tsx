import "./_group.css";
import { useMemo, useState } from "react";

type OrnamentKind = "staff" | "rain" | "tape";
const KEYS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const TABS = [["01", "Foundation"], ["02", "Sincere Fragment"], ["03", "Transformations"], ["04", "Sound Design"], ["05", "Environment"]];
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
const RECIPES = [
  ["Piano layer", "Soft felt tone", "Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).", ["Velocity: 40–60", "Warm, close mic perspective", "Dark room decay; avoid a bright transient"]],
  ["String / pad swell", "Slow arrival", "Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).", ["Attack: 600–900 ms", "24 dB low-pass filter", "Subtle chorus / ensemble"]],
  ["Granular residue", "Tail-only weather", "Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.", ["Automate send on phrase tails", "Keep the dry note recognizable", "Do not smear the full mix"]],
  ["Bass layer", "Emotional floor", "Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.", ["Filter below 300–500 Hz", "Long, even sustain", "Keep attacks soft and level low"]],
];
const pitchName = (midi: number) => `${KEYS[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

function Ornament({ kind }: { kind: OrnamentKind }) {
  if (kind === "staff") return <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    {[37, 47, 57, 67, 77].map((y) => <line key={y} x1="16" y1={y} x2="284" y2={y} />)}
    <ellipse cx="88" cy="67" rx="9" ry="5.8" transform="rotate(-18 88 67)" />
    <ellipse cx="131" cy="47" rx="9" ry="5.8" transform="rotate(-18 131 47)" />
    <ellipse cx="205" cy="77" rx="9" ry="5.8" transform="rotate(-18 205 77)" />
    <path d="M97 67V18 M140 47V14 M214 77V29" />
    <path d="M151 105h112" className="og-ornament-hairline" />
  </svg>;
  if (kind === "rain") return <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><linearGradient id="og-window-glow" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#9db7c7" stopOpacity=".2" /><stop offset="1" stopColor="#9db7c7" stopOpacity="0" /></linearGradient></defs>
    <path d="M42 17h211v114H42z" className="og-window-pane" />
    <path d="M148 18v112M43 74h208" className="og-window-frame" />
    <path d="M50 20h193v50H50z" fill="url(#og-window-glow)" stroke="none" />
    <path d="M78 24l-8 23m34-29-8 28m40-23-7 25m42-20-8 25m41-28-8 29m25 7-8 22m-40-13-8 27m-39-24-8 27m-38-19-8 25m-26-7-8 20" className="og-rain-streak" />
    <path d="M71 58c-5 7-6 10-2 13 4 3 9 0 7-5-1-3-3-5-5-8zm84-21c-5 7-6 10-2 13 4 3 9 0 7-5-1-3-3-5-5-8zm52 57c-5 7-6 10-2 13 4 3 9 0 7-5-1-3-3-5-5-8z" className="og-rain-drops" />
  </svg>;
  return <svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path d="M55 29c25-18 70-18 92 0 23 19 24 49 4 69-18 18-54 20-76 3-20-16-18-42 2-55 15-10 37-8 49 2 11 9 11 23 2 31-7 7-20 8-29 2" className="og-tape-loop" />
    <path d="M150 36c12-13 32-17 48-9 17 8 23 24 16 38-7 14-26 19-40 12" className="og-tape-loop-secondary" />
    <path d="M30 111h19l8-12 10 26 11-19 9 9h17l8-6 8 2h13l9-10 8 18 10-13 11 5h17l9-9 10 13 10-8h18" className="og-echo-wave" />
    <path d="M48 20l3-4m15 1 2-5m155 29 4 2m-8 12 5 3m-181 67 3 1m181-1 4 2m-34-94 2-3" className="og-granular" />
  </svg>;
}

function StaffStudy({ pitches }: { pitches: number[][] }) {
  const groups = pitches.map((group) => group.map((pitch) => 177 - (pitch - 48) * 5));
  return <div className="og-diagram">
    <div className="og-diagram-title">DYAD STUDY · TREBLE STAFF</div>
    <svg viewBox="0 0 940 260" role="img" aria-label="Treble staff showing two parallel fourth-to-third dyad sighs">
      {[66, 80, 94, 108, 122].map((y) => <line key={y} x1="82" y1={y} x2="916" y2={y} className="og-staff-rule" />)}
      <text x="25" y="132" className="og-clef">𝄞</text>
      {pitches.map((group, groupIndex) => {
        const x = [177, 365, 575, 763][groupIndex];
        return <g key={groupIndex}>
          {group.map((pitch, noteIndex) => {
            const nx = x + (noteIndex === 0 ? 16 : -16);
            const y = groups[groupIndex][noteIndex];
            return <g key={noteIndex}>{y > 127 && <line x1={nx - 12} y1={y} x2={nx + 12} y2={y} className="og-ledger-rule" />}
              <ellipse cx={nx} cy={y} rx="8" ry="5.5" transform={`rotate(-18 ${nx} ${y})`} className="og-notehead" />
              <line x1={nx + 7} y1={y} x2={nx + 7} y2={y - 34} className="og-stem" />
            </g>;
          })}
          <text x={x} y="204" textAnchor="middle" className="og-pitch">{group.map(pitchName).join(" + ")}</text>
          <text x={x} y="226" textAnchor="middle" className="og-relation">{groupIndex % 2 === 0 ? "P4 · suspension" : "M3 · release"}</text>
        </g>;
      })}
      <text x="270" y="250" textAnchor="middle" className="og-diagram-caption">one semitone down · bass remains still</text>
      <text x="670" y="250" textAnchor="middle" className="og-diagram-caption">same sigh, shifted up a whole step</text>
    </svg>
  </div>;
}

function PianoRoll({ selectedKey, root, title, long = false }: { selectedKey: string; root: number; title: string; long?: boolean }) {
  const notes = long
    ? [[0, 2, root + 26], [2, 1.5, root + 25], [4, 3, root + 24], [24, 2, root + 26], [26, 1.5, root + 25], [28, 3, root + 24]]
    : [[0, 2, root], [0, 2, root - 5], [2, 2, root - 1], [2, 2, root - 5], [4, 2, root + 2], [4, 2, root - 3], [6, 2, root + 1], [6, 2, root - 3]];
  const minPitch = long ? root + 14 : root - 8;
  const maxPitch = long ? root + 38 : root + 15;
  const rowCount = maxPitch - minPitch + 1;
  const yFor = (pitch: number) => 43 + ((maxPitch - pitch) / rowCount) * 180;
  const barCount = long ? 8 : 2;
  return <div className="og-diagram og-roll">
    <div className="og-diagram-title">{title.toUpperCase()} · {selectedKey} MINOR</div>
    <svg viewBox="0 0 980 255" role="img" aria-label={`${title}, piano roll in ${selectedKey} minor`}>
      {Array.from({ length: rowCount }, (_, i) => {
        const pitch = maxPitch - i; const y = 43 + (i / rowCount) * 180;
        return <g key={pitch}><line x1="66" y1={y} x2="966" y2={y} className={pitch % 12 === 0 ? "og-octave-line" : "og-grid-line"} />
          {pitch % 12 === 0 && <text x="10" y={y + 4} className="og-row-label">C{Math.floor(pitch / 12) - 1}</text>}
        </g>;
      })}
      {Array.from({ length: barCount + 1 }, (_, i) => {
        const x = 66 + i * (900 / barCount);
        return <g key={i}><line x1={x} y1="43" x2={x} y2="223" className="og-bar-line" />{i < barCount && <text x={x + 6} y="244" className="og-row-label">BAR {i + 1}</text>}</g>;
      })}
      {notes.map(([start, duration, pitch], index) => {
        const x = 69 + Number(start) * (900 / (barCount * 4));
        const width = Math.max(12, Number(duration) * (900 / (barCount * 4)) - 5);
        const y = yFor(Number(pitch)) - 4;
        return <rect key={index} x={x} y={y} width={width} height="9" rx="2" className={index % 2 ? "og-roll-note-muted" : "og-roll-note"}><title>{pitchName(Number(pitch))}</title></rect>;
      })}
    </svg>
  </div>;
}

export function OrnamentGuide({ ornament }: { ornament: OrnamentKind }) {
  const [selectedKey, setSelectedKey] = useState("A♭");
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const root = 48 + KEYS.indexOf(selectedKey);
  const pairs = useMemo(() => [[root, root - 5], [root - 1, root - 5], [root + 2, root - 3], [root + 1, root - 3]], [root]);

  return <main className="velouria-preview og-page">
    <div className="og-shell">
      <header className="og-hero">
        <div className={`og-ornament og-ornament-${ornament}`} aria-hidden="true"><Ornament kind={ornament} /></div>
        <div className="og-hero-top"><div><div className="og-wordmark">A FIELD GUIDE TO COMPOSITION</div><h1>Velouria</h1><div className="og-pronunciation">Ve·lou·ri·a /vəˈlʊər.i.ə/ · noun</div></div><div className="og-edition">THE COMPOSITIONAL GUIDE<br />EDITION 01</div></div>
        <p className="og-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
        <div className="og-hero-meta">
          <div><div className="og-label">ETYMOLOGY</div><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div>
          <div><div className="og-label">RELATED FORMS</div><p><b>Velouric</b> /vəˈlʊər.ɪk/ <i>adjective</i>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</p><p><b>Velourian</b> /vəˈlʊər.i.ən/ <i>adjective &amp; noun</i>: Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>); a composer, producer, or listener dedicated to the genre.</p></div>
        </div>
        <button className="og-disclosure" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "− Hide" : "+ Read"} the full Velouria definition</button>
        {expanded && <div className="og-full-entry">
          <h3>Velouria</h3><p><b>Ve·lou·ri·a</b> /vəˈlʊər.i.ə/ <i>noun</i></p>
          <h4>Definition</h4><p>A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
          <h4>Etymology</h4><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p>
          <h4>Inflections &amp; Related Forms</h4><p><b>Velouric</b> /vəˈlʊər.ɪk/ <i>adjective</i>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</p>
          <p><b>Velourian</b> /vəˈlʊər.i.ən/ <i>adjective &amp; noun</i>: <i>adj.</i> Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>). <i>n.</i> A composer, producer, or listener dedicated to the genre.</p>
          <h4>Core Characteristics</h4><ul>
            <li><b>Harmonic Suspension:</b> Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences.</li>
            <li><b>The Sincere Fragment:</b> Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity.</li>
            <li><b>Mediated Distance:</b> The use of degraded tape loops, granular residue, soft filtering, and room tone to give foreground instruments (such as felt piano or vintage polysynths) the impression of a half-remembered transmission.</li>
            <li><b>Environmental Setting:</b> Subtle integration of field recordings, sub-bass drones, and quiet room acoustics that establish an ambiguous physical space beneath the music.</li>
          </ul>
          <h4>Example in Context</h4><blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <b>Velouria</b>.”</blockquote>
        </div>}
      </header>
      <section className="og-key-controls"><label htmlFor="og-key">Choose a tonal center</label><select id="og-key" value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)}>{KEYS.map((key) => <option key={key} value={key}>{key}</option>)}</select></section>
      <div className="og-caption-mono">TONAL CENTER · {selectedKey} MINOR &nbsp; / &nbsp; ROOT VOICING · {pitchName(root)}</div>
      <nav className="og-tabs" aria-label="Composition guide chapters" role="tablist">
        {TABS.map(([number, label], index) => <button key={number} type="button" role="tab" aria-selected={activeTab === index} className={activeTab === index ? "active" : ""} onClick={() => setActiveTab(index)}><span>{number}</span>{label}</button>)}
      </nav>
      {activeTab === 0 && <section className="og-content" role="tabpanel">
        <div className="og-module-kicker">MODULE 01</div><h2>Harmonic movement &amp; dyads</h2>
        <p className="og-section-lede">A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.</p>
        <div className="og-pair-cards">
          <article><div className="og-stat-label">PAIR 1 · ROOT OVER FIFTH</div><strong>{pitchName(pairs[0][0])} + {pitchName(pairs[0][1])} <i>→</i> {pitchName(pairs[1][0])} + {pitchName(pairs[1][1])}</strong><p>P4 settles to M3 while {pitchName(pairs[0][1])} remains in place.</p></article>
          <article><div className="og-stat-label">PAIR 2 · STEP-UP ROOT</div><strong>{pitchName(pairs[2][0])} + {pitchName(pairs[2][1])} <i>→</i> {pitchName(pairs[3][0])} + {pitchName(pairs[3][1])}</strong><p>The same sigh shifts upward by a whole step; its bass remains fixed.</p></article>
        </div>
        <StaffStudy pitches={pairs} />
        <PianoRoll selectedKey={selectedKey} root={root} title="Two parallel sighs · two bars" />
        <h3 className="og-subheading">Eight-bar expanded progression</h3>
        <div className="og-progression">{[["i(add9)", "BARS 1–2"], ["♭VImaj7", "BARS 3–4"], ["♭IImaj7", "BARS 5–6"], ["ivm9 / V7sus4", "BARS 7–8"]].map(([chord, bars]) => <div key={chord}><strong>{chord}</strong><span>{bars}</span></div>)}</div>
        <PianoRoll selectedKey={selectedKey} root={root} title={`Eight-bar harmonic map · ${selectedKey} minor`} long />
        <div className="og-note">The final two bars briefly divide the closing color: <b>ivm9</b> opens the room, then <b>V7sus4</b> suspends the ending rather than forcing a resolution.</div>
      </section>}
      {activeTab === 1 && <section className="og-content" role="tabpanel">
        <div className="og-module-kicker">MODULE 02</div><h2>The sincere fragment</h2>
        <p className="og-section-lede">A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.</p>
        <div className="og-step-grid">{[["01", "The Longing", "Open with the ninth above the minor root. It asks a question without spelling out the answer."], ["02", "The Ache", "Move down one semitone. Keep the touch and timing restrained; this is a small change with a large emotional effect."], ["03", "The Consolation", `Land on ${pitchName(root + 24)}, the major third of ♭VI in this example. Let the new chord carry the warmth.`]].map(([n, title, body]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        <PianoRoll selectedKey={selectedKey} root={root} title={`Right hand · fragment and breathing room · ${selectedKey}`} long />
        <div className="og-note"><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</div>
      </section>}
      {activeTab === 2 && <section className="og-content" role="tabpanel">
        <div className="og-module-kicker">MODULE 03</div><h2>Variations &amp; transformations</h2>
        <p className="og-section-lede">Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.</p>
        <label className="og-variation-control">Choose a transformation to inspect<select value={selectedVariation} onChange={(event) => setSelectedVariation(Number(event.target.value))}>{VARIATIONS.map(([name], index) => <option value={index} key={name}>{name}</option>)}</select></label>
        <article className="og-variation-feature"><div className="og-module-kicker">{VARIATIONS[selectedVariation][0]}</div><h3>{VARIATIONS[selectedVariation][1]}</h3><p>{VARIATIONS[selectedVariation][2]}</p></article>
        <h3 className="og-subheading">The full transformation catalog</h3>
        <div className="og-variation-grid">{VARIATIONS.map(([name, summary], index) => <button key={name} type="button" className={selectedVariation === index ? "selected" : ""} onClick={() => setSelectedVariation(index)}><strong>{name}</strong><span>{summary}</span></button>)}</div>
      </section>}
      {activeTab === 3 && <section className="og-content" role="tabpanel">
        <div className="og-module-kicker">MODULE 04</div><h2>Mediated distance &amp; sound design</h2>
        <p className="og-section-lede">The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.</p>
        <div className="og-recipe-grid">{RECIPES.map(([name, subtitle, description, details]) => <article key={name as string}><div className="og-module-kicker">{name as string}</div><h3>{subtitle as string}</h3><p>{description as string}</p><ul>{(details as string[]).map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</div>
        <div className="og-note">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</div>
      </section>}
      {activeTab === 4 && <section className="og-content" role="tabpanel">
        <div className="og-module-kicker">MODULE 05</div><h2>Environmental setting &amp; space</h2>
        <p className="og-section-lede">A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.</p>
        <div className="og-mix-map"><div className="og-stat-label">DEPTH × FREQUENCY · SIGNAL-FLOW MAP</div><div className="og-layer"><b>Piano · foreground</b><span>clear transient · warm mids · close perspective</span></div><div className="og-layer"><b>Strings / pad · mid-ground</b><span>slow swell · softened top · wide but quiet</span></div><div className="og-layer"><b>Granular residue · far edge</b><span>phrase tails only · diffuse high detail</span></div><div className="og-layer"><b>Room tone / environment · continuous, very low</b></div><div className="og-frequency">LOW &nbsp; ← &nbsp; FREQUENCY &nbsp; → &nbsp; HIGH</div></div>
        <div className="og-environment-grid"><article><div className="og-module-kicker">LISTENING LAYERS</div><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></article><article><div className="og-module-kicker">COMPOSITION PROMPT</div><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></article></div>
        <div className="og-note">The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>
      </section>}
      <footer className="og-footer">A COMPOSITION HANDBOOK · NO AUDIO OR MIDI GENERATION · USE THE DIAGRAMS AS WRITING PROMPTS</footer>
    </div>
    <style>{`
      .og-page{--bg:#0b1118;--line:rgba(175,190,205,.13);--gold:#d5b875;--text:#e9e8e4;min-height:100vh;background:radial-gradient(ellipse at 84% 0%,rgba(43,66,91,.35),transparent 38%),radial-gradient(ellipse at 4% 22%,rgba(112,88,57,.12),transparent 32%),var(--bg);color:var(--text);font-family:'Figtree',sans-serif;position:relative;isolation:isolate;overflow:hidden;padding:1px 0 54px;-webkit-font-smoothing:antialiased}
      .og-page *{box-sizing:border-box}.og-ornament{position:absolute;z-index:0;pointer-events:none;top:108px;right:26px;width:292px;height:146px;display:flex;align-items:center;justify-content:center}.og-ornament svg{width:100%;height:100%;overflow:visible}.og-ornament line,.og-ornament path{stroke:#d5b875;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}.og-ornament ellipse{fill:#d5b875;stroke:#f0d99d;stroke-width:1}.og-ornament-hairline{stroke:#c6ab6a!important;stroke-width:1.2!important;opacity:.65}.og-ornament-staff{opacity:.72}.og-ornament-rain{opacity:.88}.og-ornament-rain .og-window-pane{fill:rgba(102,139,159,.07);stroke:rgba(153,185,202,.52);stroke-width:1.5}.og-ornament-rain .og-window-frame{stroke:rgba(167,194,208,.48);stroke-width:1.5}.og-ornament-rain .og-rain-streak{stroke:#9eb8c8;stroke-width:1.8;opacity:.72}.og-ornament-rain .og-rain-drops{fill:#9eb8c8;stroke:#c3d3db;stroke-width:.8;opacity:.78}.og-ornament-tape{opacity:.82}.og-ornament-tape .og-tape-loop{stroke:#c2b27f;stroke-width:2.1;stroke-dasharray:112 5 72 9;opacity:.85}.og-ornament-tape .og-tape-loop-secondary{stroke:#9eb1bd;stroke-width:1.8;stroke-dasharray:82 7 43 9;opacity:.78}.og-ornament-tape .og-echo-wave{stroke:#d5b875;stroke-width:2;opacity:.82}.og-ornament-tape .og-granular{stroke:#aab9c2;stroke-width:1.8;stroke-dasharray:1 3;opacity:.75}.og-hero>.og-ornament{top:108px;right:26px}.og-hero>:not(.og-ornament){position:relative;z-index:1}
      .og-shell{position:relative;z-index:1;width:min(1240px,calc(100% - 48px));margin:32px auto 0}.og-hero{border:1px solid rgba(213,184,117,.3);border-radius:22px;padding:30px 34px 26px;margin:14px 0 26px;background:linear-gradient(120deg,rgba(213,184,117,.11),rgba(18,27,37,.95) 47%,rgba(30,45,62,.72));box-shadow:0 24px 60px rgba(0,0,0,.16);position:relative}.og-hero-top{display:flex;justify-content:space-between;align-items:flex-start;gap:28px}.og-wordmark{font:11px 'Space Mono',monospace;letter-spacing:.2em;color:#aab5bf}.og-hero h1{font:600 clamp(2.1rem,4vw,3.7rem)/1.04 'Figtree',sans-serif;letter-spacing:-.025em;color:#f0eee8;margin:.32rem 0 .35rem}.og-pronunciation{font:14px 'Space Mono',monospace;color:#d9c38f}.og-edition{font:10px/1.65 'Space Mono',monospace;color:#d8c18e;letter-spacing:.13em;text-align:right}.og-definition{font-size:16px;line-height:1.62;max-width:800px;color:#d4d7d8;margin:.95rem 0 1.1rem}.og-hero-meta{display:grid;grid-template-columns:1.4fr 1fr;gap:16px;border-top:1px solid var(--line);padding-top:16px}.og-label{font:10px 'Space Mono',monospace;color:#d8c18e;text-transform:uppercase;letter-spacing:.13em}.og-hero-meta p{font-size:14px;line-height:1.62;margin:.35rem 0;color:#aeb8c1}.og-hero-meta b{color:#d4d9da}.og-disclosure{display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:13px;padding:11px 0 0;border:0;border-top:1px solid var(--line);color:#d8c18e;background:transparent;text-align:left;font:11px 'Space Mono',monospace;cursor:pointer}.og-disclosure:hover{color:#f0dfb7}.og-disclosure:focus-visible,.og-tabs button:focus-visible,.og-key-controls select:focus-visible,.og-variation-control select:focus-visible,.og-variation-grid button:focus-visible{outline:2px solid #d5b875;outline-offset:3px}.og-full-entry{padding-top:14px;color:#c8ced4;font-size:14px;line-height:1.62}.og-full-entry h3{color:#f0eee8;font:600 19px 'Figtree',sans-serif}.og-full-entry h4{color:#d8c18e;font:600 13px 'Figtree',sans-serif;margin:14px 0 4px}.og-full-entry ul{padding-left:21px}.og-full-entry li{padding:3px 0}.og-full-entry b{color:#e8d8b1}.og-full-entry blockquote{margin:15px 0;padding-left:13px;border-left:2px solid #b79c63;color:#c8ced4;font:italic 14px/1.62 'Figtree',sans-serif}
      .og-key-controls{display:flex;align-items:center;gap:12px;margin:0 0 7px}.og-key-controls label{color:#d9dadd;font-size:14px}.og-key-controls select,.og-variation-control select{min-width:110px;border:1px solid rgba(175,190,205,.22);border-radius:5px;padding:9px 32px 9px 11px;color:#e9e8e4;background:#17222e;font:14px 'Figtree',sans-serif;cursor:pointer}.og-key-controls option,.og-variation-control option{background:#17222e;color:#e9e8e4}.og-caption-mono{color:#8e9ba9;font:10px 'Space Mono',monospace;letter-spacing:.04em;margin:9px 0 17px}.og-tabs{display:flex;gap:6px;overflow-x:auto;border-bottom:1px solid rgba(175,190,205,.16);scrollbar-width:thin}.og-tabs button{flex:1;min-width:max-content;position:relative;border:0;border-bottom:2px solid transparent;background:transparent;padding:11px 15px 10px;color:#9eabb7;font:14px 'Figtree',sans-serif;cursor:pointer}.og-tabs button span{margin-right:6px;color:inherit;font:inherit}.og-tabs button:hover{color:#ded6c3;background:rgba(255,255,255,.015)}.og-tabs button.active{color:#e6d2a1;border-bottom-color:#c6a864}.og-content{padding:22px 0 18px}.og-module-kicker{color:var(--gold);font:10px 'Space Mono',monospace;letter-spacing:.16em;text-transform:uppercase}.og-content h2{margin:4px 0 5px;color:#f0eee8;font:600 1.65rem/1.2 'Figtree',sans-serif;letter-spacing:-.025em}.og-section-lede{max-width:790px;margin:0 0 17px;color:#aab5bf;font-size:14px;line-height:1.62}
      .og-pair-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 0 14px}.og-pair-cards article,.og-step-grid article,.og-variation-feature,.og-recipe-grid article,.og-environment-grid article{padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,rgba(25,37,50,.92),rgba(17,25,35,.92))}.og-stat-label{color:#91a0ae;font:10px 'Space Mono',monospace;letter-spacing:.1em;text-transform:uppercase}.og-pair-cards strong{display:block;margin:7px 0 5px;color:#f0e8d7;font-size:20px;font-weight:600}.og-pair-cards strong i{color:#b89c62;font-style:normal;padding:0 4px}.og-pair-cards p,.og-recipe-grid p,.og-environment-grid p{margin:4px 0;color:#aeb8c1;font-size:13px;line-height:1.55}.og-diagram{margin:14px 0;padding:16px 19px;overflow:hidden;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,rgba(25,37,50,.92),rgba(17,25,35,.92))}.og-diagram-title{display:flex;justify-content:space-between;gap:12px;color:#d8c18e;font:9px 'Space Mono',monospace;letter-spacing:.1em}.og-diagram svg{display:block;width:100%;height:auto;margin-top:7px}.og-staff-rule{stroke:#596675;stroke-width:1.2}.og-clef{fill:#9babc0;font:46px 'Figtree',sans-serif}.og-notehead{fill:#d9bd7b;stroke:#f4dfaa;stroke-width:1}.og-stem,.og-ledger-rule{stroke:#d9bd7b;stroke-width:1.3}.og-pitch{fill:#eff1f2;font:11px 'Space Mono',monospace}.og-relation{fill:#cfb477;font:12px 'Figtree',sans-serif;font-weight:600}.og-diagram-caption{fill:#82909e;font:11px 'Figtree',sans-serif}.og-grid-line{stroke:#26323e;stroke-width:1;opacity:.72}.og-octave-line{stroke:#465361;stroke-width:1;opacity:.85}.og-row-label{fill:#8c99a8;font:9px 'Space Mono',monospace}.og-bar-line{stroke:#42505d;stroke-width:1;opacity:.8}.og-roll-note{fill:#d4b06a}.og-roll-note-muted{fill:#91a9c7}.og-subheading{margin:18px 0 8px;color:#f0eee8;font-size:17px;font-weight:600}.og-progression{display:flex;align-items:stretch;gap:8px;margin:10px 0 12px}.og-progression>div{position:relative;flex:1;min-width:110px;padding:10px 12px;border:1px solid rgba(170,187,204,.14);border-radius:11px;background:#16212d}.og-progression strong{display:block;color:#e8d8b1;font-size:13px}.og-progression span{display:block;margin-top:4px;color:#8f9dab;font:9px 'Space Mono',monospace}.og-note{margin-top:13px;border-left:2px solid #b79c63;padding:4px 0 4px 13px;color:#b5c0c8;font-size:13px;line-height:1.55}.og-note b{color:#e8d8b1}
      .og-step-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:8px 0 14px}.og-step-grid article{padding:18px 20px}.og-step-grid article>span{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;margin-right:8px;border:1px solid rgba(213,184,117,.45);border-radius:50%;color:#d8c18e;font:10px 'Space Mono',monospace}.og-step-grid h3{display:inline;color:#f0eee8;font:600 15px 'Figtree',sans-serif}.og-step-grid p{margin:10px 0 0;color:#aeb8c1;font-size:13px;line-height:1.6}.og-variation-control{display:block;margin:10px 0 6px;color:#d9dadd;font:10px 'Space Mono',monospace;letter-spacing:.1em}.og-variation-control select{display:block;width:min(430px,100%);margin:8px 0 12px}.og-variation-feature{margin:0 0 13px}.og-variation-feature h3{margin:5px 0;color:#e8d8b1;font-size:16px}.og-variation-feature p{margin:0;color:#aeb8c1;font-size:13px;line-height:1.62}.og-variation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.og-variation-grid button{min-height:90px;padding:14px 16px;border:1px solid var(--line);border-radius:13px;background:rgba(22,32,44,.8);color:#a4b0bb;text-align:left;cursor:pointer}.og-variation-grid button:hover,.og-variation-grid button.selected{background:rgba(213,184,117,.06);border-color:rgba(213,184,117,.48)}.og-variation-grid strong{display:block;margin-bottom:6px;color:#e8d8b1;font-size:.9rem}.og-variation-grid span{font-size:.82rem;line-height:1.45}.og-recipe-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.og-recipe-grid h3,.og-environment-grid h3{margin:6px 0;color:#f0eee8;font:600 16px 'Figtree',sans-serif}.og-recipe-grid ul{display:flex;flex-wrap:wrap;gap:7px;padding:0;margin:13px 0 0;list-style:none}.og-recipe-grid li{padding:5px 9px;border:1px solid rgba(170,187,204,.15);border-radius:99px;color:#c8ced4;font-size:11px}
      .og-mix-map{margin:18px 0;padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,rgba(25,37,50,.92),rgba(17,25,35,.92))}.og-layer{display:flex;flex-direction:column;gap:6px;margin:11px 5% 0;padding:10px 14px;border:1px solid rgba(175,190,205,.24);border-radius:10px;background:rgba(145,164,178,.08)}.og-layer:nth-of-type(2){margin-left:5%;margin-right:59%;border-color:rgba(200,168,99,.55);background:rgba(200,168,99,.13);color:#f0e8d7}.og-layer:nth-of-type(3){margin-left:27%;margin-right:30%;border-color:rgba(135,156,183,.5);background:rgba(122,143,169,.14);color:#d5dfeb}.og-layer:nth-of-type(4){margin-left:48%;margin-right:14%;border-color:rgba(162,140,185,.48);background:rgba(140,120,164,.13);color:#e0d1ee}.og-layer:nth-of-type(5){margin-left:11%;margin-right:17%;padding:8px 14px;border-color:rgba(129,154,141,.48);background:rgba(102,129,120,.13);color:#c8d9cf;font-size:12px}.og-layer b{font-size:13px}.og-layer span{color:#aeb8c1;font-size:11px}.og-frequency{text-align:center;color:#8e9ba9;font:9px 'Space Mono',monospace;letter-spacing:.05em}.og-environment-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.og-environment-grid article{padding:18px 20px}.og-environment-grid h3{margin:6px 0}.og-environment-grid p{margin:8px 0}.og-environment-grid p b{color:#e8d8b1}.og-footer{display:flex;align-items:center;justify-content:center;gap:15px;margin-top:20px;padding-top:14px;border-top:1px solid var(--line);color:#8e9ba9;font:9px 'Space Mono',monospace;letter-spacing:.04em;text-align:center}
      @media(max-width:1100px){.og-ornament{display:none}}
      @media(max-width:700px){.og-shell{width:calc(100% - 32px);margin:1.1rem auto 0}.og-hero{padding:22px 20px}.og-hero-top{display:block}.og-edition{margin-top:12px;text-align:left}.og-hero-meta{grid-template-columns:1fr;gap:12px}.og-definition{font-size:15px}.og-key-controls{align-items:flex-start;flex-direction:column;gap:7px}.og-caption-mono{line-height:1.6}.og-tabs{gap:4px}.og-tabs button{flex:0 0 auto;padding:11px 12px}.og-pair-cards,.og-recipe-grid,.og-environment-grid{grid-template-columns:1fr}.og-step-grid{grid-template-columns:1fr}.og-diagram{overflow-x:auto}.og-diagram svg{min-width:620px}.og-progression{overflow-x:auto}.og-progression>div{min-width:130px}.og-variation-grid{grid-template-columns:1fr}.og-layer:nth-of-type(2){margin-right:12%;margin-left:5%}.og-layer:nth-of-type(3){margin-left:12%;margin-right:8%}.og-layer:nth-of-type(4){margin-left:20%;margin-right:4%}.og-layer:nth-of-type(5){margin-left:7%;margin-right:5%}.og-footer{align-items:flex-start;flex-direction:column;text-align:left}}
      @media(prefers-reduced-motion:reduce){.og-page *{scroll-behavior:auto!important}}
    `}</style>
  </main>;
}
