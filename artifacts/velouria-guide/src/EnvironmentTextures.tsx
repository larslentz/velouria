export function EnvironmentTextures() {
  return <>
    <div className="grid-three">
      <article className="surface" data-testid="environment-dust">
        <div className="kicker">Instrument texture option</div>
        <h3>SoundMorph Dust</h3>
        <p>SoundMorph Dust is a standalone instrument that generates its own sound. In this arrangement, use it as a separate textural layer—not as an effect receiving the piano, recorded phrases, or their note endings.</p>
        <p>Give Dust its own track in your music software. Choose a subtle texture, bring it in quietly beneath Foundation’s chords and the Sincere Fragment melody, and let it continue through the melody’s rests. Fade it in or out over a later eight-bar repeat rather than making it compete with every melodic note.</p>
        <p>Listen for space, movement, and grain rather than another lead melody. If the texture has a clear musical pitch, check that it fits the chords underneath it.</p>
      </article>
      <article className="surface" data-testid="environment-halo-loop-captures">
        <div className="kicker">Recorded-effects texture option</div>
        <h3>SoundBetter Halo Effect loop captures</h3>
        <p>Try these captured loops as a potential background-effects layer alongside instruments, orchestral excerpts, tape loops, and field recordings. Place them on their own track behind Foundation’s chords or the Sincere Fragment melody; they can add atmosphere without becoming the main melody.</p>
        <p>Keep a capture quiet enough that the musical parts stay clear, and use fades at its start and end. Try different entry points or sections and listen for the feeling that best suits the piece. This is one possible texture, not a required ingredient.</p>
      </article>
      <article className="surface" data-testid="environment-recorded-texture">
        <div className="kicker">Orchestral recordings & tape loops</div>
        <h3>A recording can provide atmosphere</h3>
        <p>A distant string swell, a small orchestral excerpt, or a worn tape loop can play quietly behind the main parts. A tape loop is a recorded passage that repeats; you can make this with a repeating audio clip in music software, without a physical tape machine.</p>
        <p>For background use, soften the start and end with fades and keep the level low enough to hear the melody clearly. Check any audible notes against the changing chords. A gentle layer may continue through bars 3–6 while the melody rests; it need not repeat the melody’s notes or enter on every beat.</p>
        <p>Keep a strongly melodic or rhythmically busy recording lower, edit it more sparsely, or use it as the main phrase instead of letting two melodies compete.</p>
      </article>
    </div>
    <section className="learning-note" aria-labelledby="recording-roles-title" data-testid="environment-recording-roles">
      <h3 id="recording-roles-title">The same kind of recording can be the music itself</h3>
      <p><strong>Texture is a role, not a rule about the source.</strong> An orchestral or tape-loop recording does not have to stay in the background. Decide what you want it to do:</p>
      <ul>
        <li><strong>Foundation:</strong> arrange recorded sustained chords to perform the eight-bar chord sequence. These clips replace the piano backing; use the notes and chord-change times shown in Foundation.</li>
        <li><strong>Sincere Fragment:</strong> use a short recorded phrase as the main melody. For the guide’s example, match its three descending notes and leave the four empty melody bars intact.</li>
        <li><strong>Transformations:</strong> change that recorded phrase’s timing, pitch, or ending to make a later variation. The recording carries the changed musical idea, not merely a decorative layer behind it.</li>
        <li><strong>Environment:</strong> let a quiet recording provide atmosphere behind those musical parts. It can continue while the melody rests, provided it does not obscure the harmony or the silence between phrases.</li>
      </ul>
      <p><strong>Try one arrangement:</strong> use recorded string chords for Foundation’s first eight bars. On the next eight-bar cycle, bring in a recorded cello fragment at the same time as the returning chords. Add Dust quietly on a separate track, allowing it to continue through the melody’s rests. On a later repeat, try one transformation of the cello phrase. You do not need an additional piano part if the recordings already perform its musical roles.</p>
    </section>
  </>;
}
