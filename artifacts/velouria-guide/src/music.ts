export const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const PC = Object.fromEntries(KEYS.map((key, i) => [key, i])) as Record<string, number>;
export type Event = { start: number; duration: number; pitch: number; label: string; color?: string };
export type Dyad = { label: string; start: number[]; rest: number[]; relation: string };
export const pitchName = (midi: number) => `${KEYS[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
export const keyRootMidi = (key: string) => 48 + (PC[key] ?? 8);
export function dyadPairs(key: string): Dyad[] {
  const root = keyRootMidi(key);
  return [
    { label: 'Pair 1 · tonic over the fifth', start: [root, root - 5], rest: [root - 1, root - 5], relation: 'P4 → M3' },
    { label: 'Pair 2 · step-up root over the sixth', start: [root + 2, root - 3], rest: [root + 1, root - 3], relation: 'P4 → M3' },
  ];
}
export function expandedProgression(key: string) {
  const root = keyRootMidi(key);
  return [
    { label: 'i(add9)', bars: '1–2', start: 0, duration: 8, notes: [0, 3, 7, 14].map(n => root + n) },
    { label: '♭VImaj7', bars: '3–4', start: 8, duration: 8, notes: [8, 12, 15, 19].map(n => root + n) },
    { label: '♭IImaj7', bars: '5–6', start: 16, duration: 8, notes: [1, 5, 8, 12].map(n => root + n) },
    { label: 'ivm9', bars: '7', start: 24, duration: 4, notes: [5, 8, 12, 15, 19].map(n => root + n) },
    { label: 'V7sus4', bars: '8', start: 28, duration: 4, notes: [7, 12, 14, 17].map(n => root + n) },
  ];
}
export function melodyEvents(key: string): Event[] {
  const r = keyRootMidi(key);
  return [
    { start: 0, duration: 1.25, pitch: r + 26, label: 'Longing · 9th' },
    { start: 2, duration: 1, pitch: r + 25, label: 'Ache · ♭10' },
    { start: 4, duration: 3.5, pitch: r + 24, label: "Consolation · ♭VI's 3rd" },
    { start: 24, duration: 1.25, pitch: r + 26, label: 'return' },
    { start: 26, duration: 1, pitch: r + 25, label: 'ache' },
    { start: 28, duration: 3, pitch: r + 24, label: 'landing' },
  ];
}
export const VARIATIONS = [
  { name: '01 · Ghost Note', summary: 'Skip the downbeat; let the phrase arrive already in motion.', detail: "Begin on beat 1½ rather than beat 1. The listener hears a fragment of a thought, not a formal entrance. Leave the previous bar's decay unobstructed.", kind: 'ghost' },
  { name: '02 · Octave Dream', summary: 'Move the same phrase and harmony down one octave.', detail: 'Lower both hands by twelve semitones and keep the timing unchanged. The closer register feels private and weighted; reduce velocity slightly so the lower notes do not become percussive.', kind: 'octave' },
  { name: '03 · Ringing Tail / Residue', summary: 'Hold one final tone through the bar line and into the space after it.', detail: 'Let the phrase end, then keep its last note alive across the next bar. The sustain belongs to the phrase tail; do not wash every note in granular processing.', kind: 'tail' },
  { name: '04 · Warm Centre', summary: 'Land on the major third of ♭VI, then open the chord upward.', detail: 'Use the landing note as a stable centre, then outline the ♭VI major-seventh color above it. Keep the arpeggio unhurried and let the high note soften rather than announce a climax.', kind: 'warm' },
  { name: '05 · Twin Peaks Lift', summary: 'Briefly brighten the dream chord, then melt back into minor.', detail: 'Let one major sonority rise as a second emotional peak. Return to the minor center without a strong dominant cadence; the lift should feel remembered, not resolved.', kind: 'twin' },
  { name: '06 · Dorian Sigh', summary: 'Resolve downward to the natural sixth or second for wistful ambiguity.', detail: 'Borrow the Dorian natural sixth as a gentle alternative to the minor sixth. A downward landing on scale degree 6 or 2 keeps the phrase tender without making it sound fully settled.', kind: 'dorian' },
  { name: '07 · Late Breath', summary: 'Delay each melodic attack by half a beat.', detail: "Place the first attack on beat 1½ and preserve the phrase's gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it.", kind: 'late' },
  { name: '08 · Drone Pedal', summary: 'Anchor all eight bars with a stationary open fifth.', detail: 'Sustain the root and fifth in the bass while the upper harmony moves. Keep the drone very soft and nearly texture-like; it is a floor, not a pulse.', kind: 'drone' },
];
export function variationEvents(key: string, kind: string): Event[] {
  const r = keyRootMidi(key), phrase = melodyEvents(key).slice(0, 3);
  if (kind === 'ghost') return phrase.map(e => ({ ...e, start: e.start + 1 }));
  if (kind === 'octave') return phrase.map(e => ({ ...e, pitch: e.pitch - 12 }));
  if (kind === 'tail') return [{ start: 23.5, duration: 8.5, pitch: r + 24, label: 'held tail · crosses bar line' }];
  if (kind === 'warm') return [24, 27, 31, 35].map((p, i) => ({ start: 8 + i * .75, duration: .62, pitch: r + p, label: 'warm arpeggio' }));
  if (kind === 'twin') return [
    { start: 4, duration: 2, pitch: r + 24, label: 'bright lift' }, { start: 5, duration: 2, pitch: r + 28, label: 'major third' },
    { start: 6, duration: 2, pitch: r + 31, label: 'high point' }, { start: 16, duration: 3, pitch: r + 23, label: 'minor return' },
  ];
  if (kind === 'dorian') return [
    { start: 4, duration: 1.5, pitch: r + 26, label: 'question' }, { start: 6, duration: 1.5, pitch: r + 24, label: 'sigh' },
    { start: 8, duration: 3, pitch: r + 21, label: 'Dorian 6th' },
  ];
  if (kind === 'late') return phrase.map(e => ({ ...e, start: e.start + .5 }));
  if (kind === 'drone') return [
    { start: 0, duration: 32, pitch: r - 12, label: 'stationary root' }, { start: 0, duration: 32, pitch: r - 5, label: 'open fifth' }, ...phrase,
  ];
  return phrase;
}
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export function pianoRollSvg(events: Event[], bars = 8, title = 'Piano roll', restBars: number[] = []) {
  const width=980,left=72,right=22,top=42,bottom=286,chart=width-left-right,beat=chart/(bars*4);
  const pitches=events.map(e=>Math.trunc(e.pitch));
  let min=Math.min(36,...pitches)-2,max=Math.max(84,...pitches)+2; min=Math.floor(min/12)*12; max=Math.ceil(max/12)*12;
  const row=(bottom-top)/(max-min+1);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 322" role="img" aria-label="${esc(title)}"><defs><linearGradient id="velouriaFade" x1="0" x2="1"><stop offset="0" stop-color="#d4b06a" stop-opacity=".95"/><stop offset="1" stop-color="#91a9c7" stop-opacity=".85"/></linearGradient></defs><rect width="100%" height="100%" rx="16" fill="#111821"/><text x="22" y="26" fill="#d8c18e" font-family="Figtree,sans-serif" font-size="12" letter-spacing="1.4">${esc(title.toUpperCase())}</text>`;
  for(let oct=Math.floor(min/12)-1;oct<Math.floor(max/12);oct++){const p=(oct+1)*12;if(p>=min&&p<=max){const y=top+(max-p)*row+row/2;s+=`<text x="12" y="${y+4}" fill="#8c99a8" font-family="Space Mono,monospace" font-size="10">C${oct}</text>`;}}
  for(let b=0;b<bars;b++){const x=left+b*4*beat;if(restBars.includes(b))s+=`<rect x="${x}" y="${top}" width="${4*beat}" height="${bottom-top}" fill="#9db2ca" fill-opacity=".055"/><text x="${x+2*beat}" y="${top+16}" text-anchor="middle" fill="#94a5b6" font-family="Figtree,sans-serif" font-size="10">intentional rest</text>`;s+=`<line x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" stroke="#42505d" stroke-opacity=".7"/><text x="${x+6}" y="${bottom+18}" fill="#82909e" font-family="Space Mono,monospace" font-size="10">BAR ${b+1}</text>`;}
  s+=`<line x1="${left+chart}" y1="${top}" x2="${left+chart}" y2="${bottom}" stroke="#42505d"/>`;
  for(let p=min;p<=max;p++){const y=top+(max-p)*row+row/2;s+=`<line x1="${left}" y1="${y}" x2="${left+chart}" y2="${y}" stroke="${p%12===0?'#465361':'#26323e'}" stroke-opacity="${p%12===0?'.78':'.52'}"/>`;}
  events.forEach(e=>{const x=left+Math.max(0,e.start)*beat+2,y=top+(max-Math.trunc(e.pitch))*row+1,h=Math.max(4,row-2),w=Math.max(5,Math.min(Math.max(.25,e.duration)*beat-4,left+chart-x)),label=esc(e.label||pitchName(e.pitch));s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${e.color||'url(#velouriaFade)'}"><title>${label}: ${pitchName(e.pitch)}</title></rect>`;if(w>58)s+=`<text x="${x+7}" y="${y+h-2}" fill="#121820" font-family="Figtree,sans-serif" font-size="9" font-weight="700">${label}</text>`;});
  return s+'</svg>';
}
function staffPos(midi:number):[number,string]{const nat:[string,number][]=[['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['G',-1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];const [letter,acc]=nat[((midi%12)+12)%12],li='CDEFGAB'.indexOf(letter),oct=Math.floor(midi/12)-1;return [oct*7+li-(4*7+2),acc===-1?'♭':''];}
export function staffSvg(pairs:Dyad[]){
  const width=940,height=300,left=82,top=68,gap=13,bottom=top+4*gap,positions=[190,340,570,720],captions=[['P4','suspension'],['M3','release'],['P4','suspension'],['M3','release']];
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Treble staff showing two parallel fourth-to-third dyad sighs"><rect width="100%" height="100%" rx="16" fill="#111821"/><text x="22" y="30" fill="#d8c18e" font-family="Figtree,sans-serif" font-size="12" letter-spacing="1.2">DYAD STUDY · TREBLE STAFF</text><text x="28" y="${bottom+8}" fill="#9babc0" font-family="serif" font-size="46">𝄞</text>`;
  for(let i=0;i<5;i++)s+=`<line x1="${left}" y1="${top+i*gap}" x2="${width-30}" y2="${top+i*gap}" stroke="#596675" stroke-width="1.2"/>`;
  const groups=pairs.flatMap(p=>[p.start,p.rest]); groups.forEach((notes,gi)=>{const x=positions[gi];notes.forEach((midi,ni)=>{const [steps,acc]=staffPos(midi),y=bottom-steps*gap/2,nx=x+(ni===0?20:-20);if(steps<0)for(let k=-2;k>=steps;k-=2){const ly=bottom-k*gap/2;s+=`<line x1="${nx-11}" y1="${ly}" x2="${nx+11}" y2="${ly}" stroke="#9ba7b3"/>`;}s+=`<ellipse cx="${nx}" cy="${y}" rx="8" ry="5.6" transform="rotate(-18 ${nx} ${y})" fill="#d9bd7b" stroke="#f4dfaa"/><line x1="${nx+7}" y1="${y}" x2="${nx+7}" y2="${y-35}" stroke="#d9bd7b" stroke-width="1.5"/>`;if(acc)s+=`<text x="${nx-17}" y="${y+5}" fill="#d9bd7b" font-family="serif" font-size="17">${acc}</text>`;});s+=`<text x="${x}" y="222" text-anchor="middle" fill="#eff1f2" font-family="Space Mono,monospace" font-size="11">${notes.map(pitchName).join(' + ')}</text><text x="${x}" y="244" text-anchor="middle" fill="#cfb477" font-family="Figtree,sans-serif" font-size="12" font-weight="600">${captions[gi][0]} · ${captions[gi][1]}</text>`;});
  return s+`<text x="265" y="282" text-anchor="middle" fill="#82909e" font-family="Figtree,sans-serif" font-size="11">one semitone down · bass remains still</text><text x="645" y="282" text-anchor="middle" fill="#82909e" font-family="Figtree,sans-serif" font-size="11">same sigh, shifted up a whole step</text></svg>`;
}
export const mixMatrixSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 330" role="img" aria-label="Signal flow from foreground piano through strings and granular tails to background room tone"><defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#ae9a71"/></marker></defs><rect width="950" height="330" rx="18" fill="#111821"/><text x="26" y="32" fill="#d8c18e" font-family="Figtree,sans-serif" font-size="12" letter-spacing="1.3">DEPTH × FREQUENCY · SIGNAL-FLOW MAP</text><text x="34" y="82" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">NEAR</text><text x="34" y="283" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">FAR</text><line x1="85" y1="65" x2="85" y2="286" stroke="#566270" marker-end="url(#arrow)"/><text x="435" y="318" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">LOW ← FREQUENCY → HIGH</text><rect x="143" y="68" width="300" height="58" rx="12" fill="#c8a863" fill-opacity=".17" stroke="#c8a863" stroke-opacity=".8"/><text x="164" y="94" fill="#f0dcaa" font-family="Figtree,sans-serif" font-size="16" font-weight="600">Piano · foreground</text><text x="164" y="114" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">clear transient · warm mids · close perspective</text><rect x="315" y="137" width="350" height="58" rx="12" fill="#7a8fa9" fill-opacity=".18" stroke="#879cb7" stroke-opacity=".75"/><text x="337" y="163" fill="#d5dfeb" font-family="Figtree,sans-serif" font-size="16" font-weight="600">Strings / pad · mid-ground</text><text x="337" y="183" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">slow swell · softened top · wide but quiet</text><rect x="455" y="206" width="330" height="52" rx="12" fill="#8c78a4" fill-opacity=".16" stroke="#a28cb9" stroke-opacity=".7"/><text x="477" y="229" fill="#e0d1ee" font-family="Figtree,sans-serif" font-size="15" font-weight="600">Granular residue · far edge</text><text x="477" y="247" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">phrase tails only · diffuse high detail</text><rect x="222" y="267" width="556" height="38" rx="10" fill="#668178" fill-opacity=".14" stroke="#819a8d" stroke-opacity=".7"/><text x="244" y="291" fill="#c8d9cf" font-family="Figtree,sans-serif" font-size="14" font-weight="600">Room tone / environment · continuous, very low</text><path d="M350 126 C390 137 405 132 440 137" fill="none" stroke="#ae9a71" stroke-width="1.5" marker-end="url(#arrow)"/><path d="M565 195 C600 204 610 200 640 206" fill="none" stroke="#ae9a71" stroke-width="1.5" marker-end="url(#arrow)"/></svg>`;
