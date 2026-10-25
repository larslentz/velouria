import { useState } from 'react';

const checklistSections = [
  {
    title: 'Emotional Tension & “Beautiful Unease”',
    criteria: [
      { id: 'sincere-tenderness', title: 'Sincere tenderness', description: 'The music feels emotionally warm, romantic, or vulnerable—not sterile, clinical, or emotionally detached.' },
      { id: 'undercurrent-unease', title: 'An undercurrent of unease', description: 'Beneath the beauty is quiet tension, sadness, or mystery: not purely peaceful “spa music,” and not overtly aggressive horror.' },
      { id: 'fragile-memory', title: 'A fragile-memory quality', description: 'The piece feels like a half-remembered transmission or a precious moment that might dissolve at any second.' },
    ],
  },
  {
    title: 'Harmony & Structure',
    criteria: [
      { id: 'harmonic-suspension', title: 'Harmonic suspension', description: 'Chords hover, circle, or linger—using a held home note, suspended chords, or two-note sighs—instead of resolving with a predictable, final-sounding cadence.' },
      { id: 'pacing-breathing-room', title: 'Pacing & breathing room', description: 'The harmony moves slowly, with chords held for several bars so each voicing has time to bloom and fade.' },
      { id: 'consolation-over-resolution', title: 'Consolation over resolution', description: 'Any moment of relief feels like a brief warm landing or sigh, rather than a triumphant ending.' },
    ],
  },
  {
    title: 'Melodic Phrasing',
    criteria: [
      { id: 'sincere-fragment', title: 'The sincere fragment', description: 'Melodic ideas are brief—often two to four notes—and feel human, without virtuosic runs, complex solos, or busy hooks.' },
      { id: 'downward-gravitation', title: 'Downward gravitation', description: 'Melodies often step downward, sometimes by a very small interval, suggesting longing, a sigh, or resignation.' },
      { id: 'intentional-silence', title: 'Intentional silence', description: 'Full bars or long pauses follow phrases, leaving room for the natural room sound and reverb to fade.' },
    ],
  },
  {
    title: 'Timbre, Texture & Distance',
    criteria: [
      { id: 'intimate-foreground', title: 'Intimate foreground', description: 'The lead has a soft, tactile quality, such as felt piano, muted electric keys, or gentle guitar swells.' },
      { id: 'mediated-distance', title: 'Mediated distance', description: 'The sound feels softened by distance or time, perhaps through gentle filtering, vintage-sounding synth strings, or tape warmth.' },
      { id: 'selective-residue', title: 'Selective residue', description: 'Phrase endings fade into subtle echoes, granular textures, or soft reverb instead of stopping abruptly.' },
    ],
  },
  {
    title: 'Rhythm & Environmental Space',
    criteria: [
      { id: 'rhythmic-restraint', title: 'Rhythmic restraint', description: 'The music is beatless or uses only a very quiet brushed sweep, subtle low pulse, or loose, sparse rhythm.' },
      { id: 'living-atmosphere', title: 'Living atmosphere', description: 'Even with the musical instruments muted, you can still hear a sense of place, such as quiet room tone, distant rain, tape hiss, or ventilation.' },
    ],
  },
];

const classifications = [
  { min: 22, max: 28, title: 'Purely Velourian', description: 'Fully embodies the aesthetic: sincere beauty, suspended harmony, mediated distance, and beautiful unease.' },
  { min: 15, max: 21, title: 'Strong Velouric Influence', description: 'Deeply aligned with the mood and textures, though it may use different instruments, lighter unease, or a subtle beat.' },
  { min: 9, max: 14, title: 'Velouric Elements Present', description: 'Contains some traits, such as felt piano or room tone, but leans mainly toward another genre.' },
  { min: 0, max: 8, title: 'Not Velouria', description: 'Conflicting elements dominate, such as heavy drum grooves, bright pop hooks, aggressive dissonance, or a very polished modern sound.' },
];

const allCriteria = checklistSections.flatMap(section => section.criteria);

export function ListeningChecklist() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const ratedCount = Object.keys(scores).length;
  const score = Object.values(scores).reduce((total, value) => total + value, 0);
  const result = ratedCount === allCriteria.length
    ? classifications.find(classification => score >= classification.min && score <= classification.max)
    : undefined;

  return (
    <section id="listening-checklist" className="surface listening-checklist" aria-labelledby="listening-checklist-title" data-testid="listening-checklist">
      <div className="kicker">A listener’s guide</div>
      <h3 id="listening-checklist-title">The Velouria Listening Checklist</h3>
      <p>Rate each quality based on how strongly it appears in the track. This is a listening guide, not a strict pass-or-fail test.</p>

      <div className="listening-score-key" aria-label="Scoring guide">
        <p><strong>2 · Strongly present</strong> and central to the track</p>
        <p><strong>1 · Subtle</strong>, occasional, or partly present</p>
        <p><strong>0 · Absent or contradictory</strong>, such as a heavy trap beat or aggressive distortion</p>
      </div>

      <p className="listening-score-note">
        Score all 14 qualities from 0 to 2. That makes the maximum 28 points; the attached draft’s “out of 26” does not match its 14 listed qualities. The classification ranges below are adjusted to the 28-point total.
      </p>

      <div className="listening-criteria">
        {checklistSections.map(section => (
          <section className="listening-category" key={section.title} aria-labelledby={`checklist-${section.criteria[0].id}`}>
            <h4 id={`checklist-${section.criteria[0].id}`}>{section.title}</h4>
            <div className="listening-category-items">
              {section.criteria.map(criterion => (
                <div className="listening-criterion" key={criterion.id}>
                  <div className="listening-criterion-copy">
                    <h5>{criterion.title}</h5>
                    <p>{criterion.description}</p>
                  </div>
                  <fieldset className="listening-rating">
                    <legend className="sr-only">Score for {criterion.title}</legend>
                    {[0, 1, 2].map(value => (
                      <label className="listening-rating-choice" key={value}>
                        <input
                          type="radio"
                          name={`score-${criterion.id}`}
                          value={value}
                          checked={scores[criterion.id] === value}
                          onChange={() => setScores(current => ({ ...current, [criterion.id]: value }))}
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="listening-result" role="status" aria-live="polite" data-testid="listening-score-result">
        <div className="listening-result-score">
          <span className="kicker">Your score</span>
          <strong>{score} <span>/ 28</span></strong>
          <span className="listening-rated-count">{ratedCount} of 14 rated</span>
        </div>
        <div className="listening-result-copy">
          {result
            ? <><h4>{result.title}</h4><p>{result.description}</p></>
            : <p>Rate all 14 qualities to see the listening guide’s suggested classification.</p>}
        </div>
        <button className="listening-reset" type="button" onClick={() => setScores({})} disabled={ratedCount === 0}>Reset scores</button>
      </div>

      <blockquote className="listening-gut-check">
        <span className="kicker">The one-sentence gut check</span>
        <p>Does this track make you feel like you are sitting in a quiet, dimly lit room at night, overhearing a tender, fragile piano and string melody drifting through an open window from an ambiguous past?</p>
      </blockquote>
    </section>
  );
}
