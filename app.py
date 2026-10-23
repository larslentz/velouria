from __future__ import annotations

from base64 import b64encode
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

from velouria.music import (
    KEYS,
    VARIATIONS,
    dyad_pairs,
    expanded_progression,
    key_root_midi,
    melody_events,
    mix_matrix_svg,
    piano_roll_svg,
    pitch_name,
    staff_svg,
    variation_events,
)


st.set_page_config(
    page_title="Velouria · The Compositional Guide",
    page_icon="✦",
    layout="wide",
    initial_sidebar_state="collapsed",
)

hero_image_url = "data:image/webp;base64," + b64encode(
    (Path(__file__).parent / "assets" / "velouria-hero.webp").read_bytes()
).decode("ascii")
definition_image_url = "data:image/webp;base64," + b64encode(
    (Path(__file__).parent / "assets" / "velouria-definition.webp").read_bytes()
).decode("ascii")

st.markdown(
    """
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
      :root {
        --velour-bg: #0b1118;
        --velour-panel: #121b25;
        --velour-panel-soft: #17222e;
        --velour-line: rgba(175, 190, 205, .13);
        --velour-gold: #d5b875;
        --velour-text: #e9e8e4;
        --velour-muted: #9ca9b6;
      }
      html, body, [class*="css"] { font-family: 'Figtree', sans-serif; }
      .stApp {
        background:
          radial-gradient(ellipse at 84% 0%, rgba(43, 66, 91, .35), transparent 38%),
          radial-gradient(ellipse at 4% 22%, rgba(112, 88, 57, .12), transparent 32%),
          var(--velour-bg);
        color: var(--velour-text);
      }
      [data-testid="stHeader"] { background: transparent; }
      .block-container { max-width: 1240px; padding-top: 2.15rem; padding-bottom: 4rem; }
      h1, h2, h3, h4 { color: #f0eee8; letter-spacing: -.025em; }
      p, li { color: #c8ced4; line-height: 1.62; }
      .eyebrow {
        color: var(--velour-gold); font-family: 'Space Mono', monospace;
        font-size: .72rem; letter-spacing: .16em; text-transform: uppercase;
      }
      .hero {
        border: 1px solid rgba(213,184,117,.3); border-radius: 22px;
        padding: 30px 34px 26px; margin: 14px 0 26px;
        background:
          linear-gradient(90deg, rgba(8,13,18,.82) 0%, rgba(8,13,18,.66) 52%, rgba(8,13,18,.48) 100%),
          linear-gradient(0deg, rgba(8,13,18,.70) 0%, rgba(8,13,18,.18) 48%, rgba(8,13,18,.30) 100%),
          url("__VELOURIA_HERO_IMAGE__") center 75% / cover no-repeat;
        box-shadow: 0 24px 60px rgba(0,0,0,.16);
      }
      .hero-top { display:flex; justify-content:space-between; align-items:flex-start; gap:28px; }
      .wordmark { font-family:'Space Mono',monospace; font-size:.7rem; letter-spacing:.2em; color:#aab5bf; }
      .hero h1 { font-size: clamp(2.1rem, 4vw, 3.7rem); margin:.32rem 0 .35rem; line-height:1.04; font-weight:600; }
      .pronunciation { color:#d9c38f; font-family:'Space Mono',monospace; font-size:.88rem; }
      .hero-definition { font-size:1.02rem; max-width:800px; color:#d4d7d8; margin:.95rem 0 1.1rem; }
      .dictionary-meta { display:grid; grid-template-columns:1.4fr 1fr; gap:16px; border-top:1px solid var(--velour-line); padding-top:16px; }
      .dictionary-meta p { font-size:.88rem; margin:.35rem 0; color:#aeb8c1; }
      .dict-label { color:#d8c18e; font-family:'Space Mono',monospace; font-size:.65rem; text-transform:uppercase; letter-spacing:.13em; }
      [data-testid="stExpander"] details[open],
      details[data-testid="stExpander"][open] {
        overflow:hidden;
        border:1px solid rgba(213,184,117,.34);
        border-radius:18px;
        background:
          linear-gradient(90deg, rgba(8,13,18,.86) 0%, rgba(8,13,18,.78) 54%, rgba(8,13,18,.70) 100%),
          linear-gradient(0deg, rgba(8,13,18,.60) 0%, rgba(8,13,18,.25) 48%, rgba(8,13,18,.42) 100%),
          url("__VELOURIA_DEFINITION_IMAGE__") center 52% / cover no-repeat;
      }
      [data-testid="stExpander"] details[open] > div,
      details[data-testid="stExpander"][open] > div {
        background:transparent !important;
      }
      [data-testid="stExpander"] details[open] summary,
      details[data-testid="stExpander"][open] summary {
        background:transparent !important;
      }
      .form-chip { display:inline-block; border:1px solid rgba(213,184,117,.27); border-radius:100px; padding:5px 10px; margin:7px 5px 0 0; color:#ded2b6; font-size:.78rem; }
      .section-heading { font-size:1.65rem; margin:.25rem 0 .35rem; }
      .section-lede { max-width:790px; color:#aab5bf; margin-bottom:1.25rem; }
      .module-kicker { font-family:'Space Mono',monospace; color:var(--velour-gold); font-size:.68rem; letter-spacing:.16em; text-transform:uppercase; }
      .surface {
        background:linear-gradient(145deg, rgba(25,37,50,.92), rgba(17,25,35,.92));
        border:1px solid var(--velour-line); border-radius:16px; padding:18px 20px;
      }
      .surface h3 { font-size:1.08rem; margin:.1rem 0 .5rem; }
      .surface p { color:#aeb8c1; font-size:.9rem; margin:.25rem 0; }
      .stat-label { color:#91a0ae; text-transform:uppercase; font-family:'Space Mono',monospace; font-size:.65rem; letter-spacing:.13em; }
      .stat-value { font-size:1.25rem; color:#f0e8d7; margin-top:5px; font-weight:600; }
      .chord-ribbon { display:flex; gap:8px; align-items:stretch; flex-wrap:wrap; margin:16px 0 6px; }
      .chord-step { background:#16212d; border:1px solid rgba(170,187,204,.14); border-radius:12px; padding:11px 14px; min-width:130px; flex:1; }
      .chord-step strong { display:block; color:#e8d8b1; font-size:.95rem; }
      .chord-step span { color:#8f9dab; font-family:'Space Mono',monospace; font-size:.67rem; }
      .arrow { color:#b89c62; align-self:center; font-size:1.1rem; }
      .variation-card { border:1px solid var(--velour-line); background:rgba(22,32,44,.8); border-radius:13px; padding:14px 16px; height:100%; min-height:112px; }
      .variation-card strong { color:#e8d8b1; font-size:.9rem; display:block; margin-bottom:6px; }
      .variation-card span { color:#a4b0bb; font-size:.82rem; line-height:1.45; }
      .note { border-left:2px solid #b79c63; padding:4px 0 4px 13px; color:#b5c0c8; font-size:.9rem; }
      .step-number { display:inline-flex; width:28px; height:28px; border:1px solid rgba(213,184,117,.45); color:#d8c18e; border-radius:50%; align-items:center; justify-content:center; font-family:'Space Mono',monospace; font-size:.72rem; margin-right:8px; }
      .stTabs [data-baseweb="tab-list"] { gap:6px; border-bottom:1px solid rgba(175,190,205,.16); }
      .stTabs [data-baseweb="tab"] { color:#9eabb7; padding:11px 15px; font-size:.88rem; }
      .stTabs [aria-selected="true"] { color:#e6d2a1 !important; border-bottom-color:#c6a864 !important; }
      .stTabs [data-baseweb="tab-panel"] { padding-top:22px; }
      .stSelectbox label, .stRadio label { color:#d9dadd !important; }
      [data-testid="stMetric"] { background:rgba(23,34,46,.7); border:1px solid var(--velour-line); padding:14px; border-radius:13px; }
      [data-testid="stMetricLabel"] { color:#91a0ae !important; }
      [data-testid="stMetricValue"] { color:#ead9b2 !important; font-family:'Space Mono',monospace; }
      hr { border-color:rgba(175,190,205,.13); }
      .caption-mono { color:#8e9ba9; font-family:'Space Mono',monospace; font-size:.68rem; letter-spacing:.04em; }
      @media (max-width: 700px) {
        .block-container { padding:1.1rem 1rem 3rem; }
        .hero {
          padding:22px 20px;
          background:
            linear-gradient(90deg, rgba(8,13,18,.80), rgba(8,13,18,.52)),
            linear-gradient(0deg, rgba(8,13,18,.72), rgba(8,13,18,.20)),
            url("__VELOURIA_HERO_IMAGE__") center 58% / cover no-repeat;
        }
        [data-testid="stExpander"] details[open],
        details[data-testid="stExpander"][open] {
          background:
            linear-gradient(90deg, rgba(8,13,18,.88), rgba(8,13,18,.76)),
            linear-gradient(0deg, rgba(8,13,18,.65), rgba(8,13,18,.34)),
            url("__VELOURIA_DEFINITION_IMAGE__") center 46% / cover no-repeat;
        }
        .dictionary-meta { grid-template-columns:1fr; }
        .hero-top { display:block; }
        .chord-step { min-width:44%; }
      }
    </style>
    """
    .replace("__VELOURIA_HERO_IMAGE__", hero_image_url)
    .replace("__VELOURIA_DEFINITION_IMAGE__", definition_image_url),
    unsafe_allow_html=True,
)


def section_heading(number: str, title: str, lede: str) -> None:
    st.markdown(
        f'<div class="module-kicker">MODULE {number}</div><h2 class="section-heading">{title}</h2><p class="section-lede">{lede}</p>',
        unsafe_allow_html=True,
    )


def svg_view(svg: str, height: int = 340) -> None:
    components.html(svg, height=height, scrolling=False)


def render_hero() -> None:
    st.markdown(
        """
        <div class="hero">
          <div class="hero-top">
            <div>
              <div class="wordmark">A FIELD GUIDE TO COMPOSITION</div>
              <h1>Velouria</h1>
              <div class="pronunciation">Ve·lou·ri·a /vəˈlʊər.i.ə/ · noun</div>
            </div>
            <div class="dict-label">THE COMPOSITIONAL GUIDE</div>
          </div>
          <p class="hero-definition">A genre of romantic, cinematic ambient and chamber-inspired electronic music characterized by tender melodic fragments, suspended harmonic movement, and textures softened by distance, memory, or environmental space.</p>
          <div class="dictionary-meta">
            <div><div class="dict-label">ETYMOLOGY</div><p>Coined from <em>velour</em> (a plush, soft-woven fabric) and <em>aetheria / -ia</em> (suggesting an atmospheric or dreamlike realm).</p></div>
            <div><div class="dict-label">RELATED FORMS</div>
              <p><b>Velouric</b> (adj.): Exhibiting subtle qualities, traces, or underlying textures characteristic of Velouria.</p>
              <p><b>Velourian</b> (adj./n.): Directly embodying the aesthetic and compositional principles of Velouria.</p>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


render_hero()

with st.expander("Read the full Velouria definition"):
    st.markdown(
        (Path(__file__).parent / "content" / "velouria-definition.md").read_text(
            encoding="utf-8"
        )
    )

selected_key = st.selectbox(
    "Choose a tonal center",
    KEYS,
    index=KEYS.index("A♭"),
    help="All examples below transpose with this selection.",
)
root_pitch = pitch_name(key_root_midi(selected_key))
st.markdown(
    f'<div class="caption-mono">TONAL CENTER · {selected_key} MINOR &nbsp; / &nbsp; ROOT VOICING · {root_pitch}</div>',
    unsafe_allow_html=True,
)

tab1, tab2, tab3, tab4, tab5 = st.tabs(
    [
        "01  Foundation",
        "02  Sincere Fragment",
        "03  Transformations",
        "04  Sound Design",
        "05  Environment",
    ]
)

with tab1:
    section_heading(
        "01",
        "Harmonic movement & dyads",
        "A held bass note gives the upper voice room to sigh. The fourth falls a semitone into a third; the bass stays still, so the motion consoles without announcing a final cadence.",
    )
    dyads = dyad_pairs(selected_key)
    pair1, pair2 = dyads
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(
            f'<div class="surface"><div class="stat-label">PAIR 1 · ROOT OVER FIFTH</div><div class="stat-value">{pitch_name(pair1["start"][0])} + {pitch_name(pair1["start"][1])} &nbsp;→&nbsp; {pitch_name(pair1["rest"][0])} + {pitch_name(pair1["rest"][1])}</div><p>P4 settles to M3 while {pitch_name(pair1["start"][1])} remains in place.</p></div>',
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            f'<div class="surface"><div class="stat-label">PAIR 2 · STEP-UP ROOT</div><div class="stat-value">{pitch_name(pair2["start"][0])} + {pitch_name(pair2["start"][1])} &nbsp;→&nbsp; {pitch_name(pair2["rest"][0])} + {pitch_name(pair2["rest"][1])}</div><p>The same sigh shifts upward by a whole step; its bass remains fixed.</p></div>',
            unsafe_allow_html=True,
        )
    st.markdown("")
    svg_view(staff_svg(dyads), height=306)
    dyad_events = []
    for pair, start in zip(dyads, (0, 4)):
        for pitch in pair["start"]:
            dyad_events.append({"start": start, "duration": 1.7, "pitch": pitch, "label": pair["label"]})
        for pitch in pair["rest"]:
            dyad_events.append({"start": start + 2, "duration": 1.7, "pitch": pitch, "label": "semitone release"})
    svg_view(piano_roll_svg(dyad_events, bars=2, title="Two parallel sighs · two bars"), height=344)

    st.markdown("### Eight-bar expanded progression")
    st.markdown(
        '<div class="chord-ribbon"><div class="chord-step"><strong>i(add9)</strong><span>BARS 1–2</span></div><div class="arrow">→</div><div class="chord-step"><strong>♭VImaj7</strong><span>BARS 3–4</span></div><div class="arrow">→</div><div class="chord-step"><strong>♭IImaj7</strong><span>BARS 5–6</span></div><div class="arrow">→</div><div class="chord-step"><strong>ivm9 / V7sus4</strong><span>BARS 7–8</span></div></div>',
        unsafe_allow_html=True,
    )
    progression = expanded_progression(selected_key)
    for chord in progression:
        chord["events"] = [
            {
                "start": chord["start"],
                "duration": chord["duration"],
                "pitch": pitch,
                "label": f'{chord["label"]} · bars {chord["bars"]}',
            }
            for pitch in chord["notes"]
        ]
    flat_events = [event for chord in progression for event in chord["events"]]
    svg_view(piano_roll_svg(flat_events, bars=8, title=f"Eight-bar harmonic map · {selected_key} minor"), height=354)
    st.markdown(
        '<div class="note">The final two bars briefly divide the closing color: <b>ivm9</b> opens the room, then <b>V7sus4</b> suspends the ending rather than forcing a resolution.</div>',
        unsafe_allow_html=True,
    )

with tab2:
    section_heading(
        "02",
        "The sincere fragment",
        "A short motif can carry more weight than a continuous melody. Let each note change the listener’s expectation, then give the phrase silence in which to remain.",
    )
    root = key_root_midi(selected_key)
    melody = melody_events(selected_key)
    steps = st.columns(3)
    step_copy = [
        ("01", "The Longing", "Open with the ninth above the minor root. It asks a question without spelling out the answer."),
        ("02", "The Ache", "Move down one semitone. Keep the touch and timing restrained; this is a small change with a large emotional effect."),
        ("03", "The Consolation", f"Land on {pitch_name(root + 24)}, the major third of ♭VI in this example. Let the new chord carry the warmth."),
    ]
    for column, (number, title, copy) in zip(steps, step_copy):
        with column:
            st.markdown(
                f'<div class="surface"><span class="step-number">{number}</span><h3 style="display:inline">{title}</h3><p>{copy}</p></div>',
                unsafe_allow_html=True,
            )
    st.markdown("")
    svg_view(
        piano_roll_svg(
            melody,
            bars=8,
            title=f"Right hand · fragment and breathing room · {selected_key}",
            rest_bars=[2, 3, 4, 5],
        ),
        height=354,
    )
    st.markdown(
        '<div class="note"><b>Bars 4–6 are intentionally empty.</b> Avoid filling the gap with a new motif. Let piano decay, pad motion, and room tone carry the memory of the phrase.</div>',
        unsafe_allow_html=True,
    )

with tab3:
    section_heading(
        "03",
        "Variations & transformations",
        "Keep the emotional grammar, then change one compositional parameter at a time: entry, register, sustain, landing, harmonic brightness, timing, or the bass floor.",
    )
    selected_variation = st.selectbox(
        "Choose a transformation to inspect",
        [variation["name"] for variation in VARIATIONS],
        index=0,
    )
    current = next(variation for variation in VARIATIONS if variation["name"] == selected_variation)
    st.markdown(
        f'<div class="surface"><div class="module-kicker">{current["name"]}</div><h3>{current["summary"]}</h3><p>{current["detail"]}</p></div>',
        unsafe_allow_html=True,
    )
    variation_map = variation_events(selected_key, current["kind"])
    svg_view(
        piano_roll_svg(
            variation_map,
            bars=8,
            title=f'{current["name"]} · {selected_key} minor',
        ),
        height=354,
    )
    st.markdown("#### The full transformation catalog")
    for row_start in range(0, len(VARIATIONS), 2):
        cols = st.columns(2)
        for column, variation in zip(cols, VARIATIONS[row_start : row_start + 2]):
            with column:
                st.markdown(
                    f'<div class="variation-card"><strong>{variation["name"]}</strong><span>{variation["summary"]}</span></div>',
                    unsafe_allow_html=True,
                )
        st.markdown("")

with tab4:
    section_heading(
        "04",
        "Mediated distance & sound design",
        "The source should feel remembered rather than merely reverberant. Separate the layers by attack, register, width, and distance; process the endings, not every moment.",
    )
    recipes = [
        (
            "Piano layer",
            "Soft felt tone",
            "Choose a felt piano, muted grand, or a softened sampled instrument (for example, Pianoteq or a Kawai felt-style patch).",
            ["Velocity: 40–60", "Warm, close mic perspective", "Dark room decay; avoid a bright transient"],
        ),
        (
            "String / pad swell",
            "Slow arrival",
            "Build the mid-ground with a slow string layer, detuned saw, or vintage polysynth (such as a Voyetra-style voice or MiniFreak).",
            ["Attack: 600–900 ms", "24 dB low-pass filter", "Subtle chorus / ensemble"],
        ),
        (
            "Granular residue",
            "Tail-only weather",
            "Use a granular emitter such as SoundMorph Dust, or freeze a BBD-style delay such as u-he Colour Copy on the final edge of a phrase.",
            ["Automate send on phrase tails", "Keep the dry note recognizable", "Do not smear the full mix"],
        ),
        (
            "Bass layer",
            "Emotional floor",
            "Use a rounded triangle or sine tone that supports the harmony without becoming a rhythmic groove.",
            ["Filter below 300–500 Hz", "Long, even sustain", "Keep attacks soft and level low"],
        ),
    ]
    for row_start in range(0, len(recipes), 2):
        cols = st.columns(2)
        for column, recipe in zip(cols, recipes[row_start : row_start + 2]):
            name, subtitle, description, details = recipe
            with column:
                detail_html = "".join(f"<li>{detail}</li>" for detail in details)
                st.markdown(
                    f'<div class="surface"><div class="module-kicker">{name}</div><h3>{subtitle}</h3><p>{description}</p><ul>{detail_html}</ul></div>',
                    unsafe_allow_html=True,
                )
        st.markdown("")
    st.markdown(
        '<div class="note">Depth is an arrangement decision as much as an effects decision: keep one close, legible source while the softer layers lose definition behind it.</div>',
        unsafe_allow_html=True,
    )

with tab5:
    section_heading(
        "05",
        "Environmental setting & space",
        "A quiet physical cue can make an abstract harmony feel located. Room tone, ventilation, nighttime rain, or a distant field recording suggest a place without fully describing it.",
    )
    svg_view(mix_matrix_svg(), height=358)
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(
            '<div class="surface"><div class="module-kicker">LISTENING LAYERS</div><h3>Foreground → background</h3><p><b>Foreground:</b> piano attack and intimate detail.</p><p><b>Mid-ground:</b> slow string or pad swell with softened edges.</p><p><b>Background:</b> granular residue restricted to tails.</p><p><b>Environment:</b> room tone or field recording, continuous but very low.</p></div>',
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            '<div class="surface"><div class="module-kicker">COMPOSITION PROMPT</div><h3>Place the listener somewhere</h3><p>Choose one quiet environmental sound and decide how far away it should feel. Keep its level low enough that it is noticed only when the music leaves space.</p><p>Filter or soften it so it does not compete with the piano’s low-mid body or the melody’s upper register. Let it continue through the rests.</p></div>',
            unsafe_allow_html=True,
        )
    st.markdown("")
    st.markdown(
        '<div class="note">The goal is an ambiguous location, not a sound-effects scene. A trace of air, rain, or distant machinery can make silence feel inhabited.</div>',
        unsafe_allow_html=True,
    )

st.markdown("---")
st.markdown(
    '<div class="caption-mono">A COMPOSITION HANDBOOK · NO AUDIO OR MIDI GENERATION · USE THE DIAGRAMS AS WRITING PROMPTS</div>',
    unsafe_allow_html=True,
)
