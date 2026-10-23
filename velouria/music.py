"""Pitch arithmetic and notation helpers for the Velouria composition guide."""

from __future__ import annotations

from html import escape
from typing import Any


KEYS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"]
PC_NAMES = KEYS
PC_BY_NAME = {name: index for index, name in enumerate(PC_NAMES)}


def pitch_name(midi: int) -> str:
    """Return a flat-spelled pitch name with octave (C4 is MIDI 60)."""
    return f"{PC_NAMES[midi % 12]}{midi // 12 - 1}"


def key_root_midi(key: str) -> int:
    """Place the selected root in octave three."""
    return 48 + PC_BY_NAME[key]


def dyad_pairs(key: str) -> list[dict[str, Any]]:
    root = key_root_midi(key)
    return [
        {
            "label": "Pair 1 · tonic over the fifth",
            "start": [root, root - 5],
            "rest": [root - 1, root - 5],
            "relation": "P4 → M3",
        },
        {
            "label": "Pair 2 · step-up root over the sixth",
            "start": [root + 2, root - 3],
            "rest": [root + 1, root - 3],
            "relation": "P4 → M3",
        },
    ]


def expanded_progression(key: str) -> list[dict[str, Any]]:
    root = key_root_midi(key)
    return [
        {
            "label": "i(add9)",
            "bars": "1–2",
            "start": 0,
            "duration": 8,
            "notes": [root + interval for interval in (0, 3, 7, 14)],
        },
        {
            "label": "♭VImaj7",
            "bars": "3–4",
            "start": 8,
            "duration": 8,
            "notes": [root + interval for interval in (8, 12, 15, 19)],
        },
        {
            "label": "♭IImaj7",
            "bars": "5–6",
            "start": 16,
            "duration": 8,
            "notes": [root + interval for interval in (1, 5, 8, 12)],
        },
        {
            "label": "ivm9",
            "bars": "7",
            "start": 24,
            "duration": 4,
            "notes": [root + interval for interval in (5, 8, 12, 15, 19)],
        },
        {
            "label": "V7sus4",
            "bars": "8",
            "start": 28,
            "duration": 4,
            "notes": [root + interval for interval in (7, 12, 14, 17)],
        },
    ]


def melody_events(key: str) -> list[dict[str, Any]]:
    """A descending semitone fragment that lands on the ♭VI chord's third."""
    root = key_root_midi(key)
    return [
        {"start": 0.0, "duration": 1.25, "pitch": root + 26, "label": "Longing · 9th"},
        {"start": 2.0, "duration": 1.0, "pitch": root + 25, "label": "Ache · ♭10"},
        {"start": 4.0, "duration": 3.5, "pitch": root + 24, "label": "Consolation · ♭VI's 3rd"},
        {"start": 24.0, "duration": 1.25, "pitch": root + 26, "label": "return"},
        {"start": 26.0, "duration": 1.0, "pitch": root + 25, "label": "ache"},
        {"start": 28.0, "duration": 3.0, "pitch": root + 24, "label": "landing"},
    ]


VARIATIONS = [
    {
        "name": "01 · Ghost Note",
        "summary": "Skip the downbeat; let the phrase arrive already in motion.",
        "detail": "Begin on beat 1½ rather than beat 1. The listener hears a fragment of a thought, not a formal entrance. Leave the previous bar's decay unobstructed.",
        "kind": "ghost",
    },
    {
        "name": "02 · Octave Dream",
        "summary": "Move the same phrase and harmony down one octave.",
        "detail": "Lower both hands by twelve semitones and keep the timing unchanged. The closer register feels private and weighted; reduce velocity slightly so the lower notes do not become percussive.",
        "kind": "octave",
    },
    {
        "name": "03 · Ringing Tail / Residue",
        "summary": "Hold one final tone through the bar line and into the space after it.",
        "detail": "Let the phrase end, then keep its last note alive across the next bar. The sustain belongs to the phrase tail; do not wash every note in granular processing.",
        "kind": "tail",
    },
    {
        "name": "04 · Warm Centre",
        "summary": "Land on the major third of ♭VI, then open the chord upward.",
        "detail": "Use the landing note as a stable centre, then outline the ♭VI major-seventh color above it. Keep the arpeggio unhurried and let the high note soften rather than announce a climax.",
        "kind": "warm",
    },
    {
        "name": "05 · Twin Peaks Lift",
        "summary": "Briefly brighten the dream chord, then melt back into minor.",
        "detail": "Let one major sonority rise as a second emotional peak. Return to the minor center without a strong dominant cadence; the lift should feel remembered, not resolved.",
        "kind": "twin",
    },
    {
        "name": "06 · Dorian Sigh",
        "summary": "Resolve downward to the natural sixth or second for wistful ambiguity.",
        "detail": "Borrow the Dorian natural sixth as a gentle alternative to the minor sixth. A downward landing on scale degree 6 or 2 keeps the phrase tender without making it sound fully settled.",
        "kind": "dorian",
    },
    {
        "name": "07 · Late Breath",
        "summary": "Delay each melodic attack by half a beat.",
        "detail": "Place the first attack on beat 1½ and preserve the phrase's gaps. The slight delay makes the line feel human and hesitant; keep the harmony steady underneath it.",
        "kind": "late",
    },
    {
        "name": "08 · Drone Pedal",
        "summary": "Anchor all eight bars with a stationary open fifth.",
        "detail": "Sustain the root and fifth in the bass while the upper harmony moves. Keep the drone very soft and nearly texture-like; it is a floor, not a pulse.",
        "kind": "drone",
    },
]


def variation_events(key: str, kind: str) -> list[dict[str, Any]]:
    root = key_root_midi(key)
    phrase = melody_events(key)[:3]
    if kind == "ghost":
        return [{**note, "start": note["start"] + 1.0} for note in phrase]
    if kind == "octave":
        return [{**note, "pitch": note["pitch"] - 12} for note in phrase]
    if kind == "tail":
        return [
            {"start": 23.5, "duration": 8.5, "pitch": root + 24, "label": "held tail · crosses bar line"}
        ]
    if kind == "warm":
        return [
            {"start": 8.0 + index * 0.75, "duration": 0.62, "pitch": root + pitch, "label": "warm arpeggio"}
            for index, pitch in enumerate((24, 27, 31, 35))
        ]
    if kind == "twin":
        return [
            {"start": 4.0, "duration": 2.0, "pitch": root + 24, "label": "bright lift"},
            {"start": 5.0, "duration": 2.0, "pitch": root + 28, "label": "major third"},
            {"start": 6.0, "duration": 2.0, "pitch": root + 31, "label": "high point"},
            {"start": 16.0, "duration": 3.0, "pitch": root + 23, "label": "minor return"},
        ]
    if kind == "dorian":
        return [
            {"start": 4.0, "duration": 1.5, "pitch": root + 26, "label": "question"},
            {"start": 6.0, "duration": 1.5, "pitch": root + 24, "label": "sigh"},
            {"start": 8.0, "duration": 3.0, "pitch": root + 21, "label": "Dorian 6th"},
        ]
    if kind == "late":
        return [{**note, "start": note["start"] + 0.5} for note in phrase]
    if kind == "drone":
        return [
            {"start": 0, "duration": 32, "pitch": root - 12, "label": "stationary root"},
            {"start": 0, "duration": 32, "pitch": root - 5, "label": "open fifth"},
            *phrase,
        ]
    return phrase


def piano_roll_svg(
    events: list[dict[str, Any]],
    bars: int = 8,
    title: str = "Piano roll",
    rest_bars: list[int] | None = None,
) -> str:
    """Render a compact, accessible SVG piano-roll diagram."""
    width, left, right = 980, 72, 22
    top, bottom = 42, 286
    chart_width = width - left - right
    beat_width = chart_width / (bars * 4)
    all_pitches = [int(event["pitch"]) for event in events]
    min_pitch = min([36, *all_pitches]) - 2 if all_pitches else 36
    max_pitch = max([84, *all_pitches]) + 2 if all_pitches else 84
    min_pitch = min_pitch // 12 * 12
    max_pitch = (max_pitch + 11) // 12 * 12
    row_height = (bottom - top) / (max_pitch - min_pitch + 1)
    rest_bars = rest_bars or []
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 322" role="img" aria-label="{escape(title)}">',
        "<defs><linearGradient id='velouriaFade' x1='0' x2='1'><stop offset='0' stop-color='#d4b06a' stop-opacity='.95'/><stop offset='1' stop-color='#91a9c7' stop-opacity='.85'/></linearGradient></defs>",
        "<rect width='100%' height='100%' rx='16' fill='#111821'/>",
        f"<text x='22' y='26' fill='#d8c18e' font-family='Figtree, sans-serif' font-size='12' letter-spacing='1.4'>{escape(title.upper())}</text>",
    ]
    for octave in range(min_pitch // 12 - 1, max_pitch // 12):
        pitch = (octave + 1) * 12
        if min_pitch <= pitch <= max_pitch:
            y = top + (max_pitch - pitch) * row_height + row_height / 2
            parts.append(f"<text x='12' y='{y + 4:.1f}' fill='#8c99a8' font-family='Space Mono, monospace' font-size='10'>C{octave + 1}</text>")
    for bar in range(bars):
        x = left + bar * 4 * beat_width
        if bar in rest_bars:
            parts.append(f"<rect x='{x:.1f}' y='{top}' width='{4 * beat_width:.1f}' height='{bottom - top}' fill='#9db2ca' fill-opacity='.055'/>")
            parts.append(f"<text x='{x + 4 * beat_width / 2:.1f}' y='{top + 16}' text-anchor='middle' fill='#94a5b6' font-family='Figtree, sans-serif' font-size='10'>intentional rest</text>")
        parts.append(f"<line x1='{x:.1f}' y1='{top}' x2='{x:.1f}' y2='{bottom}' stroke='#42505d' stroke-opacity='.7' stroke-width='1'/>")
        parts.append(f"<text x='{x + 6:.1f}' y='{bottom + 18}' fill='#82909e' font-family='Space Mono, monospace' font-size='10'>BAR {bar + 1}</text>")
    parts.append(f"<line x1='{left + chart_width:.1f}' y1='{top}' x2='{left + chart_width:.1f}' y2='{bottom}' stroke='#42505d' stroke-width='1'/>")
    for pitch in range(min_pitch, max_pitch + 1):
        y = top + (max_pitch - pitch) * row_height + row_height / 2
        strong = pitch % 12 == 0
        color = "#465361" if strong else "#26323e"
        opacity = ".78" if strong else ".52"
        parts.append(f"<line x1='{left}' y1='{y:.1f}' x2='{left + chart_width}' y2='{y:.1f}' stroke='{color}' stroke-opacity='{opacity}' stroke-width='1'/>")
    for event in events:
        pitch = int(event["pitch"])
        start = max(0, float(event["start"]))
        duration = max(0.25, float(event["duration"]))
        x = left + start * beat_width + 2
        y = top + (max_pitch - pitch) * row_height + 1
        rect_h = max(4, row_height - 2)
        rect_w = max(5, min(duration * beat_width - 4, left + chart_width - x))
        label = escape(str(event.get("label", pitch_name(pitch))))
        fill = str(event.get("color", "url(#velouriaFade)"))
        parts.append(f"<rect x='{x:.1f}' y='{y:.1f}' width='{rect_w:.1f}' height='{rect_h:.1f}' rx='3' fill='{fill}'><title>{label}: {pitch_name(pitch)}</title></rect>")
        if rect_w > 58:
            parts.append(f"<text x='{x + 7:.1f}' y='{y + rect_h - 2:.1f}' fill='#121820' font-family='Figtree, sans-serif' font-size='9' font-weight='700'>{label}</text>")
    parts.append("</svg>")
    return "".join(parts)


def _staff_position(midi: int) -> tuple[int, str]:
    """Return a treble-staff diatonic step from E4 and its accidental."""
    natural = {
        0: ("C", 0), 1: ("D", -1), 2: ("D", 0), 3: ("E", -1),
        4: ("E", 0), 5: ("F", 0), 6: ("G", -1), 7: ("G", 0),
        8: ("A", -1), 9: ("A", 0), 10: ("B", -1), 11: ("B", 0),
    }
    letter, accidental = natural[midi % 12]
    letter_index = "CDEFGAB".index(letter)
    octave = midi // 12 - 1
    steps = octave * 7 + letter_index - (4 * 7 + "CDEFGAB".index("E"))
    return steps, "♭" if accidental == -1 else ""


def staff_svg(pairs: list[dict[str, Any]]) -> str:
    """Draw the dyad sighs on a treble staff with pitch labels."""
    width, height = 940, 300
    left, top, line_gap = 82, 68, 13
    bottom = top + 4 * line_gap
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="Treble staff showing two parallel fourth-to-third dyad sighs">',
        "<rect width='100%' height='100%' rx='16' fill='#111821'/>",
        "<text x='22' y='30' fill='#d8c18e' font-family='Figtree, sans-serif' font-size='12' letter-spacing='1.2'>DYAD STUDY · TREBLE STAFF</text>",
        f"<text x='28' y='{bottom + 8}' fill='#9babc0' font-family='serif' font-size='46'>𝄞</text>",
    ]
    for index in range(5):
        y = top + index * line_gap
        parts.append(f"<line x1='{left}' y1='{y}' x2='{width - 30}' y2='{y}' stroke='#596675' stroke-width='1.2'/>")
    positions = [190, 340, 570, 720]
    captions = [
        ("P4", "suspension"),
        ("M3", "release"),
        ("P4", "suspension"),
        ("M3", "release"),
    ]
    note_groups = []
    for pair in pairs:
        note_groups.extend((pair["start"], pair["rest"]))
    for group_index, notes in enumerate(note_groups):
        x = positions[group_index]
        for note_index, midi in enumerate(notes):
            steps, accidental = _staff_position(midi)
            y = bottom - steps * (line_gap / 2)
            note_x = x + (20 if note_index == 0 else -20)
            if steps < 0:
                for ledger_step in range(-2, steps - 1, -2):
                    ledger_y = bottom - ledger_step * (line_gap / 2)
                    parts.append(f"<line x1='{note_x - 11}' y1='{ledger_y:.1f}' x2='{note_x + 11}' y2='{ledger_y:.1f}' stroke='#9ba7b3' stroke-width='1'/>")
            parts.append(f"<ellipse cx='{note_x}' cy='{y:.1f}' rx='8' ry='5.6' transform='rotate(-18 {note_x} {y:.1f})' fill='#d9bd7b' stroke='#f4dfaa' stroke-width='1'/>")
            parts.append(f"<line x1='{note_x + 7}' y1='{y:.1f}' x2='{note_x + 7}' y2='{y - 35:.1f}' stroke='#d9bd7b' stroke-width='1.5'/>")
            if accidental:
                parts.append(f"<text x='{note_x - 17}' y='{y + 5:.1f}' fill='#d9bd7b' font-family='serif' font-size='17'>{accidental}</text>")
        chord_label = " + ".join(pitch_name(int(note)) for note in notes)
        parts.append(f"<text x='{x}' y='222' text-anchor='middle' fill='#eff1f2' font-family='Space Mono, monospace' font-size='11'>{escape(chord_label)}</text>")
        relation, caption = captions[group_index]
        parts.append(f"<text x='{x}' y='244' text-anchor='middle' fill='#cfb477' font-family='Figtree, sans-serif' font-size='12' font-weight='600'>{relation} · {caption}</text>")
    parts.extend([
        "<text x='265' y='282' text-anchor='middle' fill='#82909e' font-family='Figtree, sans-serif' font-size='11'>one semitone down · bass remains still</text>",
        "<text x='645' y='282' text-anchor='middle' fill='#82909e' font-family='Figtree, sans-serif' font-size='11'>same sigh, shifted up a whole step</text>",
        "</svg>",
    ])
    return "".join(parts)


def mix_matrix_svg() -> str:
    """A simple front-to-back signal-flow and frequency placement diagram."""
    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 330" role="img" aria-label="Signal flow from foreground piano through strings and granular tails to background room tone">
      <defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#ae9a71"/></marker></defs>
      <rect width="950" height="330" rx="18" fill="#111821"/>
      <text x="26" y="32" fill="#d8c18e" font-family="Figtree, sans-serif" font-size="12" letter-spacing="1.3">DEPTH × FREQUENCY · SIGNAL-FLOW MAP</text>
      <text x="34" y="82" fill="#8d9aaa" font-family="Space Mono, monospace" font-size="10">NEAR</text>
      <text x="34" y="283" fill="#8d9aaa" font-family="Space Mono, monospace" font-size="10">FAR</text>
      <line x1="85" y1="65" x2="85" y2="286" stroke="#566270" stroke-width="1.2" marker-end="url(#arrow)"/>
      <text x="435" y="318" fill="#8d9aaa" font-family="Space Mono, monospace" font-size="10">LOW  ←  FREQUENCY  →  HIGH</text>
      <rect x="143" y="68" width="300" height="58" rx="12" fill="#c8a863" fill-opacity=".17" stroke="#c8a863" stroke-opacity=".8"/>
      <text x="164" y="94" fill="#f0dcaa" font-family="Figtree, sans-serif" font-size="16" font-weight="600">Piano · foreground</text>
      <text x="164" y="114" fill="#aab2b9" font-family="Figtree, sans-serif" font-size="11">clear transient · warm mids · close perspective</text>
      <rect x="315" y="137" width="350" height="58" rx="12" fill="#7a8fa9" fill-opacity=".18" stroke="#879cb7" stroke-opacity=".75"/>
      <text x="337" y="163" fill="#d5dfeb" font-family="Figtree, sans-serif" font-size="16" font-weight="600">Strings / pad · mid-ground</text>
      <text x="337" y="183" fill="#aab2b9" font-family="Figtree, sans-serif" font-size="11">slow swell · softened top · wide but quiet</text>
      <rect x="455" y="206" width="330" height="52" rx="12" fill="#8c78a4" fill-opacity=".16" stroke="#a28cb9" stroke-opacity=".7"/>
      <text x="477" y="229" fill="#e0d1ee" font-family="Figtree, sans-serif" font-size="15" font-weight="600">Granular residue · far edge</text>
      <text x="477" y="247" fill="#aab2b9" font-family="Figtree, sans-serif" font-size="11">phrase tails only · diffuse high detail</text>
      <rect x="222" y="267" width="556" height="38" rx="10" fill="#668178" fill-opacity=".14" stroke="#819a8d" stroke-opacity=".7"/>
      <text x="244" y="291" fill="#c8d9cf" font-family="Figtree, sans-serif" font-size="14" font-weight="600">Room tone / environment · continuous, very low</text>
      <path d="M350 126 C390 137 405 132 440 137" fill="none" stroke="#ae9a71" stroke-width="1.5" marker-end="url(#arrow)"/>
      <path d="M565 195 C600 204 610 200 640 206" fill="none" stroke="#ae9a71" stroke-width="1.5" marker-end="url(#arrow)"/>
    </svg>
    """
