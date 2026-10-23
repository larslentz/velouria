import { useEffect, useId, useRef, useState } from 'react';
import type { Event as NoteEvent } from './music';
import { feltPiano } from './feltPiano';

export function usePianoPlayback(events: NoteEvent[], bars: number) {
  const owner = useId();
  const mounted = useRef(true);
  const [active, setActive] = useState(false);
  const [beat, setBeat] = useState<number | null>(null);
  const [bpm, setBpm] = useState(60);
  const [volume, setVolume] = useState(.55);
  const [error, setError] = useState('');
  const signature = JSON.stringify(events.map(({ start, duration, pitch }) => [start, duration, pitch]));

  useEffect(() => {
    mounted.current = true;
    const stopWhenHidden = () => { if (document.hidden) feltPiano.stop(owner); };
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => {
      mounted.current = false;
      document.removeEventListener('visibilitychange', stopWhenHidden);
      feltPiano.stop(owner);
    };
  }, [owner]);
  useEffect(() => {
    feltPiano.stop(owner);
    setError('');
    return () => feltPiano.stop(owner);
  }, [owner, signature, bars, bpm]);

  function stop() { feltPiano.stop(owner); }
  async function play() {
    setError('');
    setActive(true);
    try {
      await feltPiano.play({
        owner, events, bars, bpm, volume,
        onBeat: value => { if (mounted.current) setBeat(Math.round(value * 20) / 20); },
        onStop: () => { if (mounted.current) { setActive(false); setBeat(null); } },
      });
    } catch (cause) {
      if (mounted.current) {
        setActive(false);
        setBeat(null);
        setError(cause instanceof Error ? cause.message : 'Unable to play audio. Please try again.');
      }
    }
  }
  function changeVolume(value: number) {
    setVolume(value);
    feltPiano.setVolume(owner, value);
  }
  return { owner, active, beat, bpm, setBpm, volume, changeVolume, error, play, stop };
}
