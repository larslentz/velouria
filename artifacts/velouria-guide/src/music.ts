export const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const PC = Object.fromEntries(KEYS.map((key, i) => [key, i])) as Record<string, number>;
export type Event = {
  start: number;
  duration: number;
  pitch: number;
  label: string;
  color?: string;
  interval?: { abbreviation: string; name: string };
  chordName?: string;
};
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
export function dyadSighEvents(key: string): Event[] {
  return dyadPairs(key).flatMap((pair, index) => [
    { start: index * 4, duration: 4, pitch: pair.start[1], label: 'Keep the lower note held for the whole bar' },
    { start: index * 4, duration: 2, pitch: pair.start[0], label: 'Play the upper note on beat 1', interval: { abbreviation: 'P4', name: 'perfect fourth' } },
    { start: index * 4 + 2, duration: 2, pitch: pair.rest[0], label: 'On beat 3, move only the upper note one piano key lower', interval: { abbreviation: 'M3', name: 'major third' } },
  ]);
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
    { start: 2, duration: 1, pitch: r + 25, label: 'Ache · lowered ninth' },
    { start: 4, duration: 3.5, pitch: r + 24, label: "Consolation · ♭VI's 3rd" },
    { start: 24, duration: 1.25, pitch: r + 26, label: 'return' },
    { start: 26, duration: 1, pitch: r + 25, label: 'ache' },
    { start: 28, duration: 3, pitch: r + 24, label: 'landing' },
  ];
}
// Both parts share the same section beats: no introduction or repeated attacks.
export function combinedArrangementEvents(
  key: string,
  melody: Event[] = melodyEvents(key),
  melodyLabel = 'Sincere Fragment',
): Event[] {
  return [
    ...expandedProgression(key).flatMap(chord => chord.notes.map(pitch => ({
      start: chord.start, duration: chord.duration, pitch,
      label: `Foundation · ${chord.label}`, chordName: chord.label,
    }))),
    ...melody.map(note => ({ ...note, label: `${melodyLabel} · ${note.label}` })),
  ];
}
export function arrangementPlan(key: string) {
  const chords = expandedProgression(key);
  const melody = melodyEvents(key);
  return Array.from({ length: 8 }, (_, index) => {
    const start = index * 4;
    const chord = chords.find(item => start >= item.start && start < item.start + item.duration);
    if (!chord) throw new Error(`Missing accompaniment for bar ${index + 1}`);
    return {
      bar: index + 1,
      chord,
      strikeChord: start === chord.start,
      melody: melody.filter(note => note.start >= start && note.start < start + 4),
    };
  });
}
export const VARIATIONS = [
  { name: '01 · Ghost Note', summary: 'Leave beat 1 empty; begin the melody on beat 2.', detail: "Move each melody note one beat later. The first beat of the bar is often called the downbeat. Skipping it makes the phrase sound as though it arrives mid-thought.", kind: 'ghost' },
  { name: '02 · Octave Dream', summary: 'Play the same melody in a lower part of the keyboard.', detail: 'Move every melody note twelve adjacent piano keys to the left, counting both black and white keys. This is one octave: the note letters stay the same, but their number drops by one. Keep the timing unchanged and play softly.', kind: 'octave' },
  { name: '03 · Ringing Tail / Residue', summary: 'Keep the final note sounding into the next bar.', detail: 'A phrase is a short musical thought; its tail is its fading ending. This roll isolates a held ending note, rather than showing the whole melody. Keep it sounding as you cross the next bar line, and apply any echo or granular effect only to that ending.', kind: 'tail' },
  { name: '04 · Warm Centre', summary: 'Start on a warm landing note, then climb through the chord.', detail: 'Begin on the same landing note as the original melody, then play higher notes from the ♭VI major-seventh chord. Playing a chord’s notes one at a time is called an arpeggio. Keep the notes soft; the exact pitches and timings are in the roll and note list.', kind: 'warm' },
  { name: '05 · Twin Peaks Lift', summary: 'Add a brighter rising shape, then return to a lower note.', detail: 'The first three notes overlap to make a major chord, a brighter contrast to the minor-key setting. After a gap, play the lower note shown in bar 5. This creates a small lift without finishing with a strong return to the home chord.', kind: 'twin' },
  { name: '06 · Dorian Sigh', summary: 'Let the melody fall to a slightly brighter ending note.', detail: 'Dorian is a minor-like set of notes with a raised sixth note. Here the last note sits nine semitone steps above the starting key, plus an octave. A semitone is a move to the very next piano key, black or white. Compare this ending with the original melody.', kind: 'dorian' },
  { name: '07 · Late Breath', summary: 'Delay each melodic attack by half a beat.', detail: "Place the first attack on beat 1½ and preserve the phrase's gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it.", kind: 'late' },
  { name: '08 · Drone Pedal', summary: 'Hold two low notes steadily under the melody for all eight bars.', detail: 'A drone is a note or pair of notes that stays in place. Here the low home note and a note seven semitone steps above it form an open fifth. Keep both held quietly while the melody moves above them, rather than repeatedly striking them like a beat.', kind: 'drone' },
];
export function variationEvents(key: string, kind: string): Event[] {
  const r = keyRootMidi(key), phrase = melodyEvents(key).slice(0, 3);
  if (kind === 'ghost') return phrase.map(e => ({ ...e, start: e.start + 1 }));
  if (kind === 'octave') return phrase.map(e => ({ ...e, pitch: e.pitch - 12 }));
  if (kind === 'tail') return [{ start: 23.5, duration: 8.5, pitch: r + 24, label: 'held tail · crosses bar line' }];
  if (kind === 'warm') return [24, 27, 31, 36].map((p, i) => ({ start: 8 + i * .75, duration: .62, pitch: r + p, label: 'warm arpeggio · chord notes played one at a time' }));
  if (kind === 'twin') return [
    { start: 4, duration: 2, pitch: r + 24, label: 'bright lift' }, { start: 5, duration: 2, pitch: r + 28, label: 'major third' },
    { start: 6, duration: 2, pitch: r + 31, label: 'high point' }, { start: 16, duration: 3, pitch: r + 23, label: 'minor return' },
  ];
  if (kind === 'dorian') return [
    { start: 4, duration: 1.5, pitch: r + 26, label: 'question' }, { start: 6, duration: 1.5, pitch: r + 24, label: 'sigh' },
    { start: 8, duration: 3, pitch: r + 21, label: 'Dorian 6th' },
  ];
  if (kind === 'late') return melodyEvents(key).map(e => ({ ...e, start: e.start + .5 }));
  if (kind === 'drone') return [
    { start: 0, duration: 32, pitch: r - 12, label: 'stationary root' }, { start: 0, duration: 32, pitch: r - 5, label: 'open fifth' }, ...phrase,
  ];
  return phrase;
}
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export function pianoRollLayout(events: Event[], bars: number) {
  const pitches = events.map(event => event.pitch);
  const min = Math.max(0, (pitches.length ? Math.min(...pitches) : 60) - 2);
  const max = Math.min(127, (pitches.length ? Math.max(...pitches) : 72) + 2);
  const left = 80, right = 20, top = events.some(event => event.chordName) ? 88 : 64, rowHeight = 28;
  const width = Math.max(920, left + right + bars * 4 * 40);
  const gridHeight = (max - min + 1) * rowHeight;
  return { min, max, left, top, rowHeight, width, gridHeight,
    beatWidth: (width - left - right) / (bars * 4), bottom: top + gridHeight,
    height: top + gridHeight + 38 };
}
export function pianoRollSvg(events: Event[], bars = 8, title = 'Piano roll', restBars: number[] = []) {
  const { min, max, left, top, rowHeight, width, height, bottom, gridHeight, beatWidth } = pianoRollLayout(events, bars);
  const end = left + bars * 4 * beatWidth;
  const usedPitches = new Set(events.map(event => event.pitch));
  const hasIntervals = events.some(event => event.interval);
  const chordLabels = [...new Map(events.filter(event => event.chordName).map(event => [
    `${event.start}-${event.duration}-${event.chordName}`,
    { start: event.start, duration: event.duration, name: event.chordName! },
  ])).values()];
  const hasChordLabels = chordLabels.length > 0;
  const beatLabelY = top - 14;
  const intervalDescription = hasIntervals ? ' Interval tags beside note names: P4 means perfect fourth; M3 means major third.' : '';
  const chordDescription = hasChordLabels ? ' Chord names appear above the notes they describe.' : '';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" class="piano-roll-svg" style="min-width:${width}px" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><desc>Time moves left to right. Each bar has four beats. Each labeled row is one piano key; higher notes are above lower notes. Gold blocks show the exact start and duration of each note. A text note list is available below the diagram.${intervalDescription}${chordDescription}</desc><rect width="100%" height="100%" rx="12" fill="#111821"/><text x="12" y="${beatLabelY}" fill="#aebbc8" font-family="Space Mono,monospace" font-size="12">NOTE</text>`;
  if (hasChordLabels) s += `<text x="12" y="${top - 38}" fill="#aebbc8" font-family="Space Mono,monospace" font-size="11">CHORD</text>`;
  for (const chord of chordLabels) {
    const x = left + chord.start * beatWidth;
    const chordWidth = chord.duration * beatWidth;
    const tagY = top - 58;
    const firstBar = Math.floor(chord.start / 4) + 1;
    const lastBar = Math.ceil((chord.start + chord.duration) / 4);
    const barLabel = firstBar === lastBar ? `bar ${firstBar}` : `bars ${firstBar}–${lastBar}`;
    s += `<g class="piano-roll-chord-label"><title>${esc(chord.name)} · ${barLabel}</title><rect x="${x + 4}" y="${tagY}" width="${chordWidth - 8}" height="22" rx="4" fill="#26333e" stroke="#71808b" stroke-width=".8"/><text x="${x + chordWidth / 2}" y="${tagY + 11}" text-anchor="middle" dominant-baseline="middle" fill="#f1d79e" font-family="Space Mono,monospace" font-size="12" font-weight="700">${esc(chord.name)}</text></g>`;
  }
  for (let pitch = max; pitch >= min; pitch--) {
    const y = top + (max - pitch) * rowHeight;
    const blackKey = [1, 3, 6, 8, 10].includes(pitch % 12);
    s += `<rect x="0" y="${y}" width="${end}" height="${rowHeight}" fill="${blackKey ? '#111821' : '#18232d'}"/><rect x="0" y="${y}" width="${left - 4}" height="${rowHeight - 1}" fill="${blackKey ? '#0b1016' : '#273641'}"/><text x="${left - 14}" y="${y + rowHeight / 2}" dominant-baseline="middle" text-anchor="end" fill="${usedPitches.has(pitch) ? '#f4dca7' : '#aab7c2'}" font-family="Space Mono,monospace" font-size="13" font-weight="${usedPitches.has(pitch) ? 700 : 400}">${pitchName(pitch)}</text><line x1="${left}" y1="${y}" x2="${end}" y2="${y}" stroke="#34424e" stroke-width=".6"/>`;
  }
  for (let bar = 0; bar < bars; bar++) {
    const x = left + bar * 4 * beatWidth;
    s += `<text x="${x + 8}" y="22" fill="#ead7a8" font-family="Space Mono,monospace" font-size="14">BAR ${bar + 1}</text>`;
    if (restBars.includes(bar)) s += `<rect x="${x}" y="${top}" width="${4 * beatWidth}" height="${gridHeight}" fill="#a9c4ce" fill-opacity=".07"/><text x="${x + 2 * beatWidth}" y="${bottom + 24}" text-anchor="middle" fill="#b8c9cd" font-family="Figtree,sans-serif" font-size="13">Rest — no notes</text>`;
    for (let beat = 0; beat < 4; beat++) {
      const beatX = x + beat * beatWidth;
      s += `<text x="${beatX + 8}" y="${beatLabelY}" fill="#b7c4d0" font-family="Space Mono,monospace" font-size="12">${beat + 1}</text><line x1="${beatX}" y1="${top}" x2="${beatX}" y2="${bottom}" stroke="${beat === 0 ? '#7f909f' : '#3e4d5b'}" stroke-width="${beat === 0 ? 1.5 : .7}"/>`;
    }
  }
  s += `<line x1="${end}" y1="${top}" x2="${end}" y2="${bottom}" stroke="#7f909f"/>`;
  for (const event of events) {
    const start = Math.max(0, event.start), stop = Math.min(bars * 4, event.start + event.duration);
    if (stop <= start) continue;
    const x = left + start * beatWidth, y = top + (max - event.pitch) * rowHeight + 3;
    const w = (stop - start) * beatWidth, h = rowHeight - 6;
    const name = pitchName(event.pitch);
    const intervalText = event.interval ? ` Interval: ${event.interval.name} (${event.interval.abbreviation}).` : '';
    const description = `${name}: bar ${Math.floor(start / 4) + 1}, beat ${start % 4 + 1}; hold ${event.duration} beats.${intervalText} ${event.label}`;
    s += `<g><title>${esc(description)}</title><rect class="piano-roll-note" data-pitch="${event.pitch}" data-start="${event.start}" data-duration="${event.duration}" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#dfbf7d" stroke="#f5d99f" stroke-width=".75"/>`;
    if (w >= 48) s += `<text x="${x + 7}" y="${y + h / 2}" dominant-baseline="middle" fill="#10151c" font-family="Space Mono,monospace" font-size="12" font-weight="700" pointer-events="none">${name}</text>`;
    if (event.interval && w >= 86) s += `<text x="${x + 51}" y="${y + h / 2}" dominant-baseline="middle" fill="#594824" font-family="Space Mono,monospace" font-size="11" font-weight="700" pointer-events="none">${esc(event.interval.abbreviation)}</text>`;
    s += '</g>';
  }
  return s+`<line data-playhead="true" x1="${left}" x2="${left}" y1="${top - 28}" y2="${bottom}" stroke="#fff0cc" stroke-width="2" visibility="hidden" pointer-events="none" aria-hidden="true"/></svg>`;
}
function staffPos(midi:number):[number,string]{const nat:[string,number][]=[['C',0],['D',-1],['D',0],['E',-1],['E',0],['F',0],['G',-1],['G',0],['A',-1],['A',0],['B',-1],['B',0]];const [letter,acc]=nat[((midi%12)+12)%12],li='CDEFGAB'.indexOf(letter),oct=Math.floor(midi/12)-1;return [oct*7+li-(4*7+2),acc===-1?'♭':''];}
export function staffSvg(pairs:Dyad[]){
  const width=940,height=320,left=82,top=68,gap=13,bottom=top+4*gap,positions=[190,340,570,720],captions=[['Perfect fourth','5 semitone steps'],['Major third','4 semitone steps'],['Perfect fourth','5 semitone steps'],['Major third','4 semitone steps']];
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Treble staff showing two parallel fourth-to-third dyad sighs"><rect width="100%" height="100%" rx="16" fill="#111821"/><text x="22" y="30" fill="#d8c18e" font-family="Figtree,sans-serif" font-size="12" letter-spacing="1.2">DYAD STUDY · TREBLE STAFF</text><text x="28" y="${bottom+8}" fill="#9babc0" font-family="serif" font-size="46">𝄞</text>`;
  for(let i=0;i<5;i++)s+=`<line x1="${left}" y1="${top+i*gap}" x2="${width-30}" y2="${top+i*gap}" stroke="#596675" stroke-width="1.2"/>`;
  const groups=pairs.flatMap(p=>[p.start,p.rest]); groups.forEach((notes,gi)=>{const x=positions[gi];notes.forEach(midi=>{const [steps,acc]=staffPos(midi),y=bottom-steps*gap/2,nx=x;if(steps<0)for(let k=-2;k>=steps;k-=2){const ly=bottom-k*gap/2;s+=`<line x1="${nx-11}" y1="${ly}" x2="${nx+11}" y2="${ly}" stroke="#9ba7b3"/>`;}s+=`<ellipse cx="${nx}" cy="${y}" rx="8" ry="5.6" transform="rotate(-18 ${nx} ${y})" fill="#d9bd7b" stroke="#f4dfaa"/><line x1="${nx+7}" y1="${y}" x2="${nx+7}" y2="${y-35}" stroke="#d9bd7b" stroke-width="1.5"/>`;if(acc)s+=`<text x="${nx-17}" y="${y+5}" fill="#d9bd7b" font-family="serif" font-size="17">${acc}</text>`;});s+=`<text x="${x}" y="222" text-anchor="middle" fill="#eff1f2" font-family="Space Mono,monospace" font-size="12">${notes.map(pitchName).join(' + ')}</text><text x="${x}" y="246" text-anchor="middle" fill="#cfb477" font-family="Figtree,sans-serif" font-size="14" font-weight="600">${captions[gi][0]}</text><text x="${x}" y="266" text-anchor="middle" fill="#b1bdc6" font-family="Figtree,sans-serif" font-size="12">${captions[gi][1]}</text>`;});
  return s+`<text x="265" y="302" text-anchor="middle" fill="#aab7c3" font-family="Figtree,sans-serif" font-size="12">upper note moves one key left · lower note stays held</text><text x="645" y="302" text-anchor="middle" fill="#aab7c3" font-family="Figtree,sans-serif" font-size="12">repeat the movement two keys higher</text></svg>`;
}
export const mixMatrixSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 330" role="img" aria-label="Example of separate layers at different distances: foreground piano, mid-ground strings, and quieter background textures">
<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#ae9a71"/></marker></defs>
<rect width="950" height="330" rx="18" fill="#111821"/>
<text x="26" y="32" fill="#d8c18e" font-family="Figtree,sans-serif" font-size="12" letter-spacing="1.3">EXAMPLE LAYERS · DEPTH × FREQUENCY</text>
<text x="34" y="82" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">NEAR</text>
<text x="34" y="283" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">FAR</text>
<line x1="85" y1="65" x2="85" y2="286" stroke="#566270" marker-end="url(#arrow)"/>
<text x="435" y="318" fill="#8d9aaa" font-family="Space Mono,monospace" font-size="10">LOW ← FREQUENCY → HIGH</text>
<rect x="143" y="68" width="300" height="58" rx="12" fill="#c8a863" fill-opacity=".17" stroke="#c8a863" stroke-opacity=".8"/>
<text x="164" y="94" fill="#f0dcaa" font-family="Figtree,sans-serif" font-size="16" font-weight="600">Piano · foreground</text>
<text x="164" y="114" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">clear attack · warm mids · close perspective</text>
<rect x="315" y="137" width="350" height="58" rx="12" fill="#7a8fa9" fill-opacity=".18" stroke="#879cb7" stroke-opacity=".75"/>
<text x="337" y="163" fill="#d5dfeb" font-family="Figtree,sans-serif" font-size="16" font-weight="600">Strings / pad · mid-ground</text>
<text x="337" y="183" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">slow swell · softened top · wide but quiet</text>
<rect x="455" y="206" width="330" height="52" rx="12" fill="#8c78a4" fill-opacity=".16" stroke="#a28cb9" stroke-opacity=".7"/>
<text x="477" y="229" fill="#e0d1ee" font-family="Figtree,sans-serif" font-size="15" font-weight="600">Texture · far edge</text>
<text x="477" y="247" fill="#aab2b9" font-family="Figtree,sans-serif" font-size="11">Field recordings · loops · soft effects</text>
<rect x="222" y="267" width="556" height="38" rx="10" fill="#668178" fill-opacity=".14" stroke="#819a8d" stroke-opacity=".7"/>
<text x="244" y="291" fill="#c8d9cf" font-family="Figtree,sans-serif" font-size="14" font-weight="600">Ambient texture · continuous, very low</text>
</svg>`;
