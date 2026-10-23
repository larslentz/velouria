import "./_group.css";
import { useMemo, useState } from "react";

const KEYS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const pcByKey: Record<string, number> = Object.fromEntries(KEYS.map((key, i) => [key, i]));
const chapters = [
  { id: "foundation", n: "01", name: "Foundation", hint: "Harmonic movement & dyads" },
  { id: "fragment", n: "02", name: "Sincere Fragment", hint: "A melody with room to breathe" },
  { id: "transformations", n: "03", name: "Transformations", hint: "Eight ways to turn the phrase" },
  { id: "sound", n: "04", name: "Sound Design", hint: "Mediated distance & color" },
  { id: "environment", n: "05", name: "Environment", hint: "A place beneath the music" },
];
const variations = [
  ["01 · Ghost Note", "Skip the downbeat; let the phrase arrive already in motion.", "Begin on beat 1½ rather than beat 1. The listener hears a fragment of a thought, not a formal entrance. Leave the previous bar's decay unobstructed."],
  ["02 · Octave Dream", "Move the same phrase and harmony down one octave.", "Lower both hands by twelve semitones and keep the timing unchanged. The closer register feels private and weighted; reduce velocity slightly so the lower notes do not become percussive."],
  ["03 · Ringing Tail / Residue", "Hold one final tone through the bar line and into the space after it.", "Let the phrase end, then keep its last note alive across the next bar. The sustain belongs to the phrase tail; do not wash every note in granular processing."],
  ["04 · Warm Centre", "Land on the major third of ♭VI, then open the chord upward.", "Use the landing note as a stable centre, then outline the ♭VI major-seventh color above it. Keep the arpeggio unhurried and let the high note soften rather than announce a climax."],
  ["05 · Twin Peaks Lift", "Briefly brighten the dream chord, then melt back into minor.", "Let one major sonority rise as a second emotional peak. Return to the minor center without a strong dominant cadence; the lift should feel remembered, not resolved."],
  ["06 · Dorian Sigh", "Resolve downward to the natural sixth or second for wistful ambiguity.", "Borrow the Dorian natural sixth as a gentle alternative to the minor sixth. A downward landing on scale degree 6 or 2 keeps the phrase tender without making it sound fully settled."],
  ["07 · Late Breath", "Delay each melodic attack by half a beat.", "Place the first attack on beat 1½ and preserve the phrase's gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it."],
  ["08 · Drone Pedal", "Anchor all eight bars with a stationary open fifth.", "Sustain the root and fifth in the bass while the upper harmony moves. Keep the drone very soft and nearly texture-like; it is a floor, not a pulse."],
];
const recipes = [
  ["Piano layer", "Soft felt tone", "Choose a felt piano, muted grand, or softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).", ["Velocity: 40–60", "Warm, close mic perspective", "Dark room decay; avoid a bright transient"]],
  ["String / pad swell", "Slow arrival", "Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).", ["Attack: 600–900 ms", "24 dB low-pass filter", "Subtle chorus / ensemble"]],
  ["Granular residue", "Tail-only weather", "Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.", ["Automate send on phrase tails", "Keep the dry note recognizable", "Do not smear the full mix"]],
  ["Bass layer", "Emotional floor", "Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.", ["Filter below 300–500 Hz", "Long, even sustain", "Keep attacks soft and level low"]],
];

function pitchName(midi: number) {
  return `${KEYS[midi % 12]}${Math.floor(midi / 12) - 1}`;
}
function Staff({ pitches }: { pitches: number[][] }) {
  const ys = pitches.map((group) => group.map((midi) => 160 - (midi - 48) * 5.9));
  return (
    <svg className="vs-staff-svg" viewBox="0 0 1000 280" role="img" aria-label="Staff notation for two fourth-to-third dyad sighs">
      <text x="28" y="34" className="vs-svg-kicker">DYAD STUDY · TREBLE STAFF</text>
      {[76, 92, 108, 124, 140].map((y) => <line key={y} x1="94" y1={y} x2="970" y2={y} className="vs-staff-line" />)}
      <text x="38" y="151" className="vs-clef">𝄞</text>
      {pitches.map((group, gi) => {
        const x = [225, 410, 630, 815][gi];
        return <g key={gi}>
          {group.map((midi, ni) => {
            const y = ys[gi][ni]; const nx = x + (ni === 0 ? 15 : -15);
            return <g key={ni}>
              {y > 142 && <line x1={nx - 15} y1={y} x2={nx + 15} y2={y} className="vs-ledger" />}
              <ellipse cx={nx} cy={y} rx="10" ry="6.5" transform={`rotate(-18 ${nx} ${y})`} className="vs-notehead" />
              <line x1={nx + 8} y1={y} x2={nx + 8} y2={y - 39} className="vs-stem" />
            </g>;
          })}
          <text x={x} y="211" textAnchor="middle" className="vs-pitch-label">{group.map(pitchName).join("  +  ")}</text>
          <text x={x} y="238" textAnchor="middle" className="vs-relation">{gi % 2 === 0 ? "P4  ·  SUSPENSION" : "M3  ·  RELEASE"}</text>
        </g>;
      })}
      <text x="315" y="270" textAnchor="middle" className="vs-svg-note">one semitone down · bass remains still</text>
      <text x="730" y="270" textAnchor="middle" className="vs-svg-note">same sigh, shifted up a whole step</text>
    </svg>
  );
}
function PianoRoll({ selectedKey, base, title }: { selectedKey: string; base: number; title: string }) {
  const lower = Math.floor((base - 8) / 12) * 12;
  const upper = Math.ceil((base + 38) / 12) * 12;
  const rows = upper - lower + 1;
  const notes = [
    { start: 0, duration: 2, pitch: base, label: "P4" }, { start: 0, duration: 2, pitch: base - 5, label: "pedal" },
    { start: 2, duration: 2, pitch: base - 1, label: "M3" }, { start: 2, duration: 2, pitch: base - 5, label: "still" },
    { start: 4, duration: 2, pitch: base + 2, label: "P4" }, { start: 4, duration: 2, pitch: base - 3, label: "pedal" },
    { start: 6, duration: 2, pitch: base + 1, label: "M3" }, { start: 6, duration: 2, pitch: base - 3, label: "still" },
  ];
  const yFor = (pitch: number) => 48 + (upper - pitch) * (204 / rows);
  return <svg className="vs-roll-svg" viewBox="0 0 1000 300" role="img" aria-label={`${title} piano roll in ${selectedKey} minor`}>
    <text x="25" y="27" className="vs-svg-kicker">{title.toUpperCase()} · {selectedKey} MINOR</text>
    {Array.from({ length: rows }, (_, i) => {
      const pitch = upper - i; const y = 48 + i * (204 / rows);
      return <g key={pitch}><line x1="74" y1={y} x2="976" y2={y} className={pitch % 12 === 0 ? "vs-roll-octave" : "vs-roll-line"} />
        {pitch % 12 === 0 && <text x="18" y={y + 4} className="vs-roll-pitch">C{Math.floor(pitch / 12) - 1}</text>}
      </g>;
    })}
    {[0, 1, 2].map((bar) => <g key={bar}><line x1={74 + bar * 300} y1="48" x2={74 + bar * 300} y2="252" className="vs-barline" /><text x={82 + bar * 300} y="278" className="vs-roll-pitch">BAR {bar + 1}</text></g>)}
    <line x1="974" y1="48" x2="974" y2="252" className="vs-barline" />
    {notes.map((note, i) => {
      const x = 78 + note.start * 112.5; const y = yFor(note.pitch) - 5;
      return <g key={i}><rect x={x} y={y} width="216" height="11" rx="2" className={i % 2 === 0 ? "vs-roll-note" : "vs-roll-note-muted"} />
        <text x={x + 8} y={y + 9} className="vs-note-text">{note.label}</text></g>;
    })}
  </svg>;
}

export function VelvetScore() {
  const [selectedKey, setSelectedKey] = useState("A♭");
  const [active, setActive] = useState("foundation");
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [variation, setVariation] = useState(0);
  const root = 48 + pcByKey[selectedKey];
  const pairs = useMemo(() => [[root, root - 5], [root - 1, root - 5], [root + 2, root - 3], [root + 1, root - 3]], [root]);
  const scrollToChapter = (id: string) => {
    setActive(id);
    document.getElementById(`vs-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <main className="velouria-preview vs-page">
    <div className="vs-grain" aria-hidden="true" />
    <div className="vs-shell">
      <header className="vs-masthead"><span>FIELD GUIDE TO COMPOSITION</span><span>FOLIO 01 <i>·</i> EDITION I</span></header>
      <section className="vs-titleleaf" aria-labelledby="vs-title">
        <div className="vs-leaf-rule"><span>THE COMPOSITIONAL GUIDE</span><span>NO. 01 — A STUDY IN DISTANCE</span></div>
        <div className="vs-title-grid">
          <div>
            <p className="vs-eyebrow">A listening vocabulary / an arranging practice</p>
            <h1 id="vs-title">Velouria<span className="vs-title-period">.</span></h1>
            <p className="vs-pronunciation">Ve·lou·ri·a <span>/vəˈlʊər.i.ə/</span> <em>noun</em></p>
          </div>
          <div className="vs-medallion" aria-hidden="true"><span>V</span><small>MMXXIV</small></div>
        </div>
        <div className="vs-definition">
          <span className="vs-margin-index">01 / DEFINITION</span>
          <p>A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
        </div>
        <div className="vs-etymology">
          <div><span className="vs-label">ETYMOLOGY</span><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div>
          <div><span className="vs-label">RELATED FORMS</span><p><b>Velouric</b> /vəˈlʊər.ɪk/ <i>adjective.</i> Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</p><p><b>Velourian</b> /vəˈlʊər.i.ən/ <i>adjective &amp; noun.</i> Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>); a composer, producer, or listener dedicated to the genre.</p></div>
        </div>
        <button className="vs-disclosure" type="button" aria-expanded={dictionaryOpen} onClick={() => setDictionaryOpen(!dictionaryOpen)}>
          <span>{dictionaryOpen ? "−" : "+"}</span>{dictionaryOpen ? "Close the full dictionary entry" : "Read the full Velouria definition"}
        </button>
        {dictionaryOpen && <div className="vs-full-entry">
          <h2>Inflections &amp; related forms</h2>
          <ol><li><b>Velouric</b> /vəˈlʊər.ɪk/ <i>adjective</i>: Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria (e.g., <em>a Velouric undertone in a downtempo track</em>).</li><li><b>Velourian</b> /vəˈlʊər.i.ən/ <i>adjective &amp; noun</i>: Directly embodying the principles, instrumentation, and aesthetic of Velouria (e.g., <em>a Velourian piano arrangement</em>); a composer, producer, or listener dedicated to the genre.</li></ol>
          <h2>Core characteristics</h2>
          <ol><li><b>Harmonic Suspension.</b> Progressions and dyadic intervals (such as repeating fourth-to-third sighs) that hover, question, or console without resolving into conventional pop or classical cadences.</li>
            <li><b>The Sincere Fragment.</b> Short, evocative melodic motifs—often descending step-wise—that convey warmth or yearning rather than virtuosic complexity.</li>
            <li><b>Mediated Distance.</b> Degraded tape loops, granular residue, soft filtering, and room tone give foreground instruments the impression of a half-remembered transmission.</li>
            <li><b>Environmental Setting.</b> Field recordings, sub-bass drones, and quiet room acoustics establish an ambiguous physical space beneath the music.</li></ol>
          <blockquote>“By pairing a soft Kawai piano motif with a distant, degraded synth swell and quiet window rain, the piece firmly establishes itself within <b>Velouria</b>.”</blockquote>
        </div>}
      </section>

      <section className="vs-controls" aria-label="Guide controls">
        <div className="vs-control-copy"><span className="vs-label">TONAL CENTER</span><p>Transpose every example in the folio.</p></div>
        <label className="vs-select-wrap"><span className="vs-control-label">KEY · MINOR</span><select value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)} aria-label="Choose a tonal center">{KEYS.map((key) => <option key={key} value={key}>{key} minor</option>)}</select><span className="vs-select-mark">⌄</span></label>
        <div className="vs-root-note"><span>ROOT VOICING</span><b>{pitchName(root)}</b></div>
      </section>

      <nav className="vs-chapters" aria-label="Guide chapters">
        {chapters.map((chapter) => <button key={chapter.id} className={`vs-chapter ${active === chapter.id ? "is-active" : ""}`} type="button" onClick={() => scrollToChapter(chapter.id)} aria-current={active === chapter.id ? "location" : undefined}>
          <span className="vs-chapter-number">{chapter.n}</span><span className="vs-chapter-label">{chapter.name}</span>
        </button>)}
      </nav>

      <section className="vs-lesson vs-foundation" id="vs-foundation">
        <div className="vs-section-heading"><div><span className="vs-section-kicker">CHAPTER 01 <i>·</i> THE FOUNDATION</span><h2>Harmonic movement <em>&amp; dyads</em></h2></div><span className="vs-section-index">A—01</span></div>
        <p className="vs-lede">A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.</p>
        <div className="vs-pair-summary">
          <article><span className="vs-label">PAIR 1 · TONIC OVER FIFTH</span><b>{pitchName(pairs[0][0])} + {pitchName(pairs[0][1])}<i>→</i>{pitchName(pairs[1][0])} + {pitchName(pairs[1][1])}</b><p>P4 settles to M3 while {pitchName(pairs[0][1])} remains in place.</p></article>
          <article><span className="vs-label">PAIR 2 · STEP-UP ROOT</span><b>{pitchName(pairs[2][0])} + {pitchName(pairs[2][1])}<i>→</i>{pitchName(pairs[3][0])} + {pitchName(pairs[3][1])}</b><p>The same sigh shifts upward by a whole step; its bass remains fixed.</p></article>
        </div>
        <div className="vs-figure-frame"><div className="vs-figure-caption"><span>FIG. 01</span><span>FOURTH DESCENDING TO THIRD</span><span>TRANSPOSED TO {selectedKey.toUpperCase()}</span></div><Staff pitches={pairs} /></div>
        <div className="vs-annotation"><span>EDITOR’S NOTE</span><p>The upper note moves down one semitone. Let the held lower note make that small motion feel consequential.</p></div>
        <div className="vs-figure-frame vs-roll-frame"><div className="vs-figure-caption"><span>FIG. 02</span><span>PIANO-ROLL REALIZATION</span><span>2 BARS · FOUR HOLDS</span></div><PianoRoll selectedKey={selectedKey} base={root} title="Two parallel sighs · two bars" /></div>
        <div className="vs-progression-heading"><span className="vs-label">EIGHT-BAR EXPANDED PROGRESSION</span><h3>A path that does not insist on arrival.</h3></div>
        <div className="vs-progression">{[["i(add9)", "BARS 1–2"], ["♭VImaj7", "BARS 3–4"], ["♭IImaj7", "BARS 5–6"], ["ivm9 / V7sus4", "BARS 7–8"]].map((item, i) => <div className="vs-chord" key={item[0]}><span>{String(i + 1).padStart(2, "0")}</span><b>{item[0]}</b><small>{item[1]}</small></div>)}</div>
        <p className="vs-footnote"><b>Measure 07 → 08.</b> The closing color divides briefly: <i>ivm9</i> opens the room, then <i>V7sus4</i> suspends the ending rather than forcing a resolution.</p>
      </section>

      <section className="vs-lesson" id="vs-fragment">
        <div className="vs-section-heading"><div><span className="vs-section-kicker">CHAPTER 02 <i>·</i> THE MOTIF</span><h2>The sincere <em>fragment</em></h2></div><span className="vs-section-index">A—02</span></div>
        <p className="vs-lede">A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.</p>
        <div className="vs-three-beats">{[["01", "The Longing", "Open with the ninth above the minor root. It asks a question without spelling out the answer."], ["02", "The Ache", "Move down one semitone. Keep the touch and timing restrained; a small change with a large emotional effect."], ["03", "The Consolation", `Land on ${pitchName(root + 24)}, the major third of ♭VI. Let the new chord carry the warmth.`]].map((step) => <article key={step[0]}><span>{step[0]}</span><div><h3>{step[1]}</h3><p>{step[2]}</p></div></article>)}</div>
        <div className="vs-figure-frame"><div className="vs-figure-caption"><span>FIG. 03</span><span>RIGHT HAND · FRAGMENT &amp; BREATHING ROOM</span><span>{selectedKey.toUpperCase()} MINOR</span></div><PianoRoll selectedKey={selectedKey} base={root + 8} title="The sincere fragment · eight bars" /></div>
        <p className="vs-footnote"><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</p>
      </section>

      <section className="vs-lesson" id="vs-transformations">
        <div className="vs-section-heading"><div><span className="vs-section-kicker">CHAPTER 03 <i>·</i> THE VARIATIONS</span><h2>Transformations <em>in eight forms</em></h2></div><span className="vs-section-index">A—03</span></div>
        <p className="vs-lede">Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.</p>
        <label className="vs-variation-select"><span>INSPECT A TRANSFORMATION</span><select value={variation} onChange={(event) => setVariation(Number(event.target.value))}>{variations.map((v, i) => <option value={i} key={v[0]}>{v[0]}</option>)}</select></label>
        <article className="vs-variation-feature"><span className="vs-label">STUDY {variations[variation][0]}</span><h3>{variations[variation][1]}</h3><p>{variations[variation][2]}</p></article>
        <div className="vs-variation-list">{variations.map((v, i) => <button key={v[0]} type="button" className={i === variation ? "selected" : ""} onClick={() => setVariation(i)}><span>{v[0]}</span><small>{v[1]}</small></button>)}</div>
      </section>

      <section className="vs-lesson" id="vs-sound">
        <div className="vs-section-heading"><div><span className="vs-section-kicker">CHAPTER 04 <i>·</i> THE PALETTE</span><h2>Mediated distance <em>&amp; sound design</em></h2></div><span className="vs-section-index">A—04</span></div>
        <p className="vs-lede">The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.</p>
        <div className="vs-recipes">{recipes.map((recipe, i) => <article key={recipe[0] as string}><span className="vs-recipe-index">0{i + 1} / {(recipe[0] as string).toUpperCase()}</span><h3>{recipe[1] as string}</h3><p>{recipe[2] as string}</p><ul>{(recipe[3] as string[]).map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</div>
        <p className="vs-footnote">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</p>
      </section>

      <section className="vs-lesson" id="vs-environment">
        <div className="vs-section-heading"><div><span className="vs-section-kicker">CHAPTER 05 <i>·</i> THE SETTING</span><h2>Environmental <em>space</em></h2></div><span className="vs-section-index">A—05</span></div>
        <p className="vs-lede">A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.</p>
        <div className="vs-depth-map" aria-label="Signal flow from foreground piano to background room tone">
          <div className="vs-map-label">FIG. 04 / DEPTH × FREQUENCY · SIGNAL-FLOW MAP</div>
          <div className="vs-depth-axis"><span>NEAR</span><i /><span>FAR</span></div>
          <div className="vs-depth-layers"><article className="near"><b>Piano · foreground</b><span>clear transient · warm mids · close perspective</span></article><article className="mid"><b>Strings / pad · mid-ground</b><span>slow swell · softened top · wide but quiet</span></article><article className="far"><b>Granular residue · far edge</b><span>phrase tails only · diffuse high detail</span></article><article className="room"><b>Room tone / environment · continuous, very low</b></article></div>
          <div className="vs-frequency">LOW <span>← &nbsp; FREQUENCY &nbsp; →</span> HIGH</div>
        </div>
        <div className="vs-environment-cards"><article><span className="vs-label">LISTENING LAYERS</span><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></article><article><span className="vs-label">COMPOSITION PROMPT</span><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></article></div>
        <p className="vs-footnote">The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</p>
      </section>
      <footer className="vs-colophon"><span>A COMPOSITION HANDBOOK</span><p>NO AUDIO OR MIDI GENERATION <i>·</i> USE THE DIAGRAMS AS WRITING PROMPTS</p><span>END OF FOLIO</span></footer>
    </div>
    <style>{`
      .vs-page{--ink:#e9e6dc;--muted:#a9a69c;--gold:#d5b875;--gold-soft:#ad9562;--line:rgba(206,190,151,.2);--panel:#151b20;--paper:#cbbd9d;position:relative;overflow:hidden;background:#10161b;color:var(--ink);min-height:100vh;padding:28px 0 56px}
      .vs-page *{box-sizing:border-box}.vs-grain{position:fixed;inset:0;pointer-events:none;opacity:.15;z-index:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.17'/%3E%3C/svg%3E")}
      .vs-shell{position:relative;z-index:1;width:min(1140px,calc(100% - 64px));margin:0 auto}.vs-masthead,.vs-leaf-rule,.vs-figure-caption,.vs-colophon{display:flex;justify-content:space-between;align-items:center;font:10px 'Space Mono',monospace;letter-spacing:.13em;color:#9e9d96}.vs-masthead{padding:0 3px 16px;border-bottom:1px solid var(--line)}
      .vs-masthead i,.vs-section-kicker i,.vs-colophon i{color:var(--gold);font-style:normal}.vs-titleleaf{margin:22px 0 38px;border:1px solid rgba(213,184,117,.34);background:linear-gradient(128deg,rgba(116,95,58,.12),rgba(20,27,32,.96) 42%,rgba(28,37,45,.92));box-shadow:0 24px 68px rgba(0,0,0,.24);padding:23px 34px 25px;position:relative}.vs-titleleaf:before,.vs-titleleaf:after{content:"";position:absolute;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,var(--gold-soft),transparent);opacity:.45}.vs-titleleaf:before{top:7px}.vs-titleleaf:after{bottom:7px}.vs-leaf-rule{font-size:9px;color:#b7a87f}.vs-title-grid{display:flex;justify-content:space-between;align-items:center;padding:28px 0 15px}.vs-eyebrow,.vs-label,.vs-section-kicker,.vs-recipe-index{font:10px 'Space Mono',monospace;letter-spacing:.14em;color:var(--gold);text-transform:uppercase}.vs-eyebrow{margin:0 0 8px;color:#b8a36f}.vs-title-grid h1{font:500 clamp(54px,8vw,91px)/.92 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#f0ece0;margin:0}.vs-title-period{color:var(--gold)}.vs-pronunciation{font:13px 'Space Mono',monospace;color:#ddc68e;margin:14px 0 0}.vs-pronunciation span{color:#a8a99f}.vs-pronunciation em{font-family:Georgia,serif;font-size:15px;color:#bbb6a9;margin-left:7px}.vs-medallion{width:90px;height:90px;border:1px solid rgba(213,184,117,.52);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;color:#d9c58f;transform:rotate(-8deg)}.vs-medallion:before{content:"";position:absolute;inset:5px;border:1px solid rgba(213,184,117,.25);border-radius:50%}.vs-medallion span{font:italic 43px Georgia,serif}.vs-medallion small{font:8px 'Space Mono',monospace;letter-spacing:.1em}.vs-definition{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:17px 0 18px;display:grid;grid-template-columns:160px 1fr;gap:22px}.vs-margin-index{font:9px 'Space Mono',monospace;letter-spacing:.13em;color:#c1a66d;padding-top:4px}.vs-definition p{font:18px/1.58 Georgia,serif;color:#dedbd1;max-width:810px;margin:0}.vs-etymology{display:grid;grid-template-columns:.85fr 1.15fr;gap:34px;padding:17px 0 4px}.vs-etymology p{font:13px/1.55 'Figtree',sans-serif;color:#b9b9b0;margin:8px 0}.vs-etymology b{color:#e5d8b8}.vs-etymology i{font-family:Georgia,serif;color:#bca877}.vs-disclosure{display:flex;align-items:center;gap:10px;background:none;border:0;color:#d5c18f;padding:11px 0 0;font:12px 'Space Mono',monospace;cursor:pointer}.vs-disclosure span{font-size:18px}.vs-disclosure:focus-visible,.vs-chapter:focus-visible,.vs-variation-list button:focus-visible{outline:2px solid var(--gold);outline-offset:4px}.vs-full-entry{border-top:1px solid var(--line);margin-top:17px;padding:17px 0 2px;color:#c2c0b6}.vs-full-entry h2{font:italic 25px Georgia,serif;color:#e5ddc8;margin:0 0 10px}.vs-full-entry ol{padding-left:19px;display:grid;gap:8px;font:13px/1.55 'Figtree',sans-serif}.vs-full-entry li::marker{color:var(--gold)}.vs-full-entry b{color:#e7d6ae}.vs-full-entry blockquote{border-left:2px solid var(--gold-soft);margin:17px 0 0;padding:6px 0 6px 16px;color:#c7c0b0;font:italic 16px/1.5 Georgia,serif}
      .vs-controls{display:flex;align-items:center;gap:25px;padding:0 4px 20px}.vs-control-copy{margin-right:auto}.vs-control-copy p{font:13px Georgia,serif;color:#a9aaa3;margin:5px 0 0}.vs-select-wrap{width:220px;position:relative}.vs-control-label,.vs-root-note span{display:block;font:9px 'Space Mono',monospace;letter-spacing:.14em;color:#a69a7b;margin-bottom:7px}.vs-select-wrap select,.vs-variation-select select{appearance:none;width:100%;border:1px solid rgba(213,184,117,.42);background:#171e23;color:#e8debf;border-radius:0;padding:11px 38px 11px 13px;font:13px 'Space Mono',monospace;cursor:pointer}.vs-select-wrap select:focus,.vs-variation-select select:focus{outline:2px solid var(--gold);outline-offset:2px}.vs-select-mark{position:absolute;right:14px;bottom:10px;color:var(--gold);pointer-events:none}.vs-root-note{border-left:1px solid var(--line);padding-left:20px}.vs-root-note b{font:19px Georgia,serif;color:#eee3c3}.vs-chapters{display:flex;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:0 0 34px;overflow-x:auto}.vs-chapter{position:relative;flex:1;min-width:145px;background:transparent;border:0;text-align:left;padding:15px 14px 14px;cursor:pointer;color:#a9aaa4;transition:color .2s ease,background .2s ease}.vs-chapter:after{content:"";position:absolute;left:14px;right:14px;bottom:-1px;height:2px;background:transparent}.vs-chapter.is-active{color:#e8d9b1;background:rgba(213,184,117,.045)}.vs-chapter.is-active:after{background:var(--gold)}.vs-chapter-number{display:block;font:9px 'Space Mono',monospace;color:#9d8c61;margin-bottom:6px}.vs-chapter-label{font:13px Georgia,serif;white-space:nowrap}
      .vs-lesson{scroll-margin-top:22px;padding:0 0 60px;margin-bottom:48px;border-bottom:1px solid var(--line)}.vs-section-heading{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid rgba(206,190,151,.13);padding-bottom:15px}.vs-section-kicker{font-size:9px;color:#c5a966}.vs-section-heading h2{font:500 clamp(32px,4.2vw,48px)/1.05 Georgia,serif;letter-spacing:-.035em;color:#f0ece0;margin:8px 0 0}.vs-section-heading h2 em{font-weight:400;color:#c9bb98}.vs-section-index{font:11px 'Space Mono',monospace;color:#897d60;padding-bottom:5px}.vs-lede{max-width:790px;color:#b8b9b2;font:16px/1.65 Georgia,serif;margin:18px 0 23px}.vs-pair-summary{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}.vs-pair-summary article{border:1px solid rgba(206,190,151,.19);border-top:2px solid #887346;background:linear-gradient(135deg,rgba(213,184,117,.055),rgba(19,26,31,.7));padding:16px 18px}.vs-pair-summary b{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font:19px Georgia,serif;color:#eadbb8;margin:11px 0}.vs-pair-summary b i{font:normal 14px 'Space Mono',monospace;color:#b49759}.vs-pair-summary p{color:#a5a9a5;font-size:12px;margin:0}.vs-figure-frame{border:1px solid rgba(206,190,151,.2);background:#12191e;padding:0 18px 12px;position:relative}.vs-figure-frame:before{content:"";position:absolute;inset:7px;border:1px solid rgba(206,190,151,.07);pointer-events:none}.vs-figure-caption{position:relative;z-index:1;font-size:9px;color:#b9a875;border-bottom:1px solid rgba(206,190,151,.13);padding:12px 3px 10px}.vs-staff-svg,.vs-roll-svg{display:block;width:100%;height:auto;position:relative;z-index:1}.vs-svg-kicker{font:10px 'Space Mono',monospace;letter-spacing:1.4px;fill:#c6ad70}.vs-staff-line{stroke:#72766e;stroke-width:1.1;opacity:.75}.vs-clef{font:56px Georgia,serif;fill:#c7b17b}.vs-notehead{fill:#d9bd7b;stroke:#f4dfaa;stroke-width:1}.vs-stem{stroke:#c9ad6b;stroke-width:1.6}.vs-ledger{stroke:#b4a477;stroke-width:1}.vs-pitch-label{font:11px 'Space Mono',monospace;fill:#e7e5dc}.vs-relation{font:10px 'Figtree',sans-serif;letter-spacing:.1em;fill:#c5ad76}.vs-svg-note{font:11px Georgia,serif;fill:#8f9692;font-style:italic}.vs-annotation{display:flex;gap:16px;align-items:baseline;margin:15px 8px 18px;padding-left:13px;border-left:2px solid #9b8351}.vs-annotation span{font:9px 'Space Mono',monospace;color:#c4a965;white-space:nowrap}.vs-annotation p{font:italic 14px Georgia,serif;color:#b7b7ad;margin:0}.vs-roll-frame{padding-bottom:8px}.vs-roll-line{stroke:#344149;stroke-width:1;opacity:.65}.vs-roll-octave{stroke:#65716d;stroke-width:1.2;opacity:.8}.vs-roll-pitch{font:9px 'Space Mono',monospace;fill:#9da49e}.vs-barline{stroke:#8a7951;stroke-width:1;opacity:.76}.vs-roll-note{fill:#cdb16c;stroke:#ead59d;stroke-width:.5}.vs-roll-note-muted{fill:#91a0a2;stroke:#c5ccbf;stroke-width:.5}.vs-note-text{font:9px 'Space Mono',monospace;fill:#182026}
      .vs-progression-heading{margin:26px 0 13px}.vs-progression-heading h3{font:italic 22px Georgia,serif;color:#e5dcc6;margin:6px 0}.vs-progression{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #786744;border-bottom:1px solid #786744}.vs-chord{padding:13px 14px;border-right:1px solid var(--line);display:grid;grid-template-columns:23px 1fr;gap:2px 8px}.vs-chord:last-child{border-right:0}.vs-chord>span{grid-row:span 2;font:9px 'Space Mono',monospace;color:#9e8956;padding-top:3px}.vs-chord b{font:17px Georgia,serif;color:#e0d3b2}.vs-chord small{font:8px 'Space Mono',monospace;color:#999990;letter-spacing:.06em}.vs-footnote{font:13px/1.65 Georgia,serif;color:#aeb0a9;margin:17px 5px 0;padding-left:13px;border-left:1px solid #a18750}.vs-footnote b{color:#d6c392}
      .vs-three-beats{display:grid;grid-template-columns:repeat(3,1fr);margin:22px 0;gap:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.vs-three-beats article{display:flex;gap:13px;padding:17px 15px;border-right:1px solid var(--line)}.vs-three-beats article:last-child{border:0}.vs-three-beats article>span{font:11px 'Space Mono',monospace;color:#bba162}.vs-three-beats h3,.vs-environment-cards h3{font:italic 19px Georgia,serif;color:#e7deca;margin:0 0 7px}.vs-three-beats p,.vs-environment-cards p{font-size:12px;line-height:1.55;color:#aeb0aa;margin:0}.vs-variation-select{display:flex;align-items:center;gap:17px;max-width:530px;margin:22px 0;font:9px 'Space Mono',monospace;color:#c5a966;letter-spacing:.1em}.vs-variation-select select{max-width:310px}.vs-variation-feature{border:1px solid var(--line);border-left:3px solid var(--gold-soft);padding:20px 24px;background:rgba(213,184,117,.045)}.vs-variation-feature h3{font:italic 26px Georgia,serif;color:#e9e0cb;margin:10px 0}.vs-variation-feature p{font:14px/1.6 'Figtree',sans-serif;color:#b3b5ad;max-width:780px;margin:0}.vs-variation-list{display:grid;grid-template-columns:1fr 1fr;margin-top:14px;border-top:1px solid var(--line)}.vs-variation-list button{display:flex;gap:16px;text-align:left;padding:13px 10px;background:none;border:0;border-bottom:1px solid var(--line);color:#d7d1c0;cursor:pointer}.vs-variation-list button:nth-child(odd){border-right:1px solid var(--line)}.vs-variation-list button.selected{background:rgba(213,184,117,.08)}.vs-variation-list span{font:10px 'Space Mono',monospace;color:#c2a764;min-width:174px}.vs-variation-list small{font:12px/1.4 'Figtree',sans-serif;color:#a9aaa2}
      .vs-recipes{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line);border-left:1px solid var(--line)}.vs-recipes article{padding:19px 20px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.vs-recipes h3{font:italic 23px Georgia,serif;color:#e5ddc8;margin:8px 0}.vs-recipes p{font-size:13px;line-height:1.55;color:#b1b2aa}.vs-recipes ul{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-wrap:wrap;gap:7px}.vs-recipes li{font:10px 'Space Mono',monospace;color:#d0c19a;border:1px solid rgba(213,184,117,.2);padding:6px 8px}.vs-depth-map{position:relative;border:1px solid var(--line);background:#12191e;padding:20px 25px 16px;margin:25px 0}.vs-map-label{font:9px 'Space Mono',monospace;letter-spacing:.13em;color:#c3a766;padding-bottom:16px;border-bottom:1px solid var(--line)}.vs-depth-axis{position:absolute;left:25px;top:80px;bottom:54px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;font:8px 'Space Mono',monospace;color:#89928f}.vs-depth-axis i{height:130px;width:1px;background:linear-gradient(#b69a59,#48565a);position:relative}.vs-depth-axis i:after{content:"";position:absolute;bottom:-1px;left:-3px;border:4px solid transparent;border-top-color:#65716d}.vs-depth-layers{padding:15px 5% 0 16%;display:flex;flex-direction:column;gap:9px}.vs-depth-layers article{padding:11px 15px;border:1px solid;display:flex;flex-direction:column;gap:4px}.vs-depth-layers b{font:15px Georgia,serif}.vs-depth-layers span{font:10px 'Figtree',sans-serif;color:#b0b5b0}.vs-depth-layers .near{margin-right:42%;background:rgba(198,162,88,.12);border-color:#9f864d;color:#e0cc9b}.vs-depth-layers .mid{margin-left:18%;margin-right:23%;background:rgba(135,157,175,.11);border-color:#687d8a;color:#d3d9d9}.vs-depth-layers .far{margin-left:34%;margin-right:10%;background:rgba(137,119,151,.13);border-color:#786b85;color:#ddd2e1}.vs-depth-layers .room{margin-left:15%;background:rgba(120,148,132,.11);border-color:#6b8579;color:#ced9ce}.vs-frequency{text-align:center;font:9px 'Space Mono',monospace;color:#939b96;margin-top:11px}.vs-frequency span{color:#bdad82}.vs-environment-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.vs-environment-cards article{border:1px solid var(--line);padding:19px;background:rgba(213,184,117,.025)}.vs-environment-cards h3{margin:9px 0 12px}.vs-environment-cards p+p{margin-top:7px}.vs-colophon{border-top:1px solid var(--line);padding:20px 3px 0;color:#968e7a;font-size:9px}.vs-colophon p{margin:0;text-align:center;color:#aaa799}.vs-colophon span:last-child{color:#b39a63}
      @media(max-width:760px){.vs-shell{width:min(100% - 30px,600px)}.vs-page{padding-top:17px}.vs-titleleaf{padding:21px 18px;margin:17px 0 29px}.vs-leaf-rule{font-size:7px;gap:10px}.vs-leaf-rule span:last-child{text-align:right}.vs-title-grid{padding:24px 0 16px}.vs-medallion{width:62px;height:62px;flex:none}.vs-medallion span{font-size:31px}.vs-medallion small{font-size:6px}.vs-definition{grid-template-columns:1fr;gap:8px}.vs-definition p{font-size:16px}.vs-etymology{grid-template-columns:1fr;gap:9px}.vs-controls{display:grid;grid-template-columns:1fr 1fr;gap:14px}.vs-control-copy{grid-column:span 2}.vs-select-wrap{width:100%}.vs-root-note{align-self:end}.vs-chapters{margin-bottom:28px}.vs-chapter{min-width:132px;padding:12px 10px}.vs-chapter-label{font-size:12px}.vs-section-heading h2{font-size:35px}.vs-pair-summary{grid-template-columns:1fr}.vs-pair-summary b{font-size:17px}.vs-figure-frame{padding:0 9px 9px}.vs-figure-caption{font-size:7px;letter-spacing:.07em;gap:7px}.vs-staff-svg{min-width:570px}.vs-figure-frame:has(.vs-staff-svg){overflow-x:auto}.vs-roll-svg{min-width:570px}.vs-figure-frame:has(.vs-roll-svg){overflow-x:auto}.vs-progression{grid-template-columns:1fr 1fr}.vs-chord:nth-child(2){border-right:0}.vs-chord:nth-child(-n+2){border-bottom:1px solid var(--line)}.vs-three-beats{grid-template-columns:1fr}.vs-three-beats article{border-right:0;border-bottom:1px solid var(--line)}.vs-three-beats article:last-child{border-bottom:0}.vs-variation-select{align-items:flex-start;flex-direction:column}.vs-variation-select select{max-width:none}.vs-variation-list{grid-template-columns:1fr}.vs-variation-list button:nth-child(odd){border-right:0}.vs-variation-list span{min-width:150px}.vs-recipes{grid-template-columns:1fr}.vs-depth-map{padding:15px 12px}.vs-map-label{font-size:7px}.vs-depth-axis{left:12px}.vs-depth-layers{padding-left:12%;padding-right:0}.vs-depth-layers .near{margin-right:22%}.vs-depth-layers .mid{margin-left:10%;margin-right:12%}.vs-depth-layers .far{margin-left:20%;margin-right:4%}.vs-depth-layers .room{margin-left:7%}.vs-depth-layers b{font-size:13px}.vs-depth-layers span{font-size:9px}.vs-environment-cards{grid-template-columns:1fr}.vs-colophon{align-items:flex-start;gap:12px;flex-direction:column}.vs-colophon p{text-align:left}.vs-lesson{padding-bottom:38px;margin-bottom:36px}}
      @media(prefers-reduced-motion:reduce){.vs-page *{scroll-behavior:auto!important;transition:none!important}}
    `}</style>
  </main>;
}
