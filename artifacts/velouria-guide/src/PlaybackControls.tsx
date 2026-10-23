import type { usePianoPlayback } from './usePianoPlayback';

type Props = {
  player: ReturnType<typeof usePianoPlayback>;
  title: string;
  testId: string;
  bars: number;
  disabled?: boolean;
  together?: boolean;
};

export function PlaybackControls({ player, title, testId, bars, disabled = false, together = false }: Props) {
  return <>
    <div className="roll-player" data-testid={`${testId}-player`}>
      <button type="button" className="roll-play-button" onClick={player.active ? player.stop : player.play} disabled={disabled} aria-label={`${player.active ? 'Stop' : 'Play'} ${title}`} data-testid={`${testId}-play`}>
        <span aria-hidden="true">{player.active ? '■' : '▶'}</span> {player.active ? 'Stop' : 'Play'}{together ? ' together' : ''}
      </button>
      <label htmlFor={`${player.owner}-tempo`}>Tempo
        <select id={`${player.owner}-tempo`} value={player.bpm} onChange={event => player.setBpm(Number(event.target.value))}>
          {[40, 50, 60, 70, 80, 100, 120].map(bpm => <option value={bpm} key={bpm}>{bpm} BPM</option>)}
        </select>
      </label>
      <label htmlFor={`${player.owner}-volume`}>Volume
        <input id={`${player.owner}-volume`} type="range" min="0" max="1" step=".05" value={player.volume} onChange={event => player.changeVolume(Number(event.target.value))} aria-valuetext={`${Math.round(player.volume * 100)} percent`} />
      </label>
      <span className="roll-play-position" role="status" aria-live="off" data-testid={`${testId}-position`}>{!player.active ? `Ready · ${bars} bars` : player.beat === null ? 'Starting…' : player.beat >= bars * 4 ? 'Letting the sound fade…' : `Bar ${Math.floor(player.beat / 4) + 1} · Beat ${Math.floor(player.beat % 4) + 1}`}</span>
    </div>
    {player.error && <p className="roll-player-error" role="alert">{player.error}</p>}
  </>;
}
