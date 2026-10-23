import { useState } from 'react';
import { buildMidi, midiFilename, type MidiTrack } from './midi';

type Props = { tracks: MidiTrack[]; bars: number; bpm: number; title: string; testId: string };

export function MidiDownloadButton({ tracks, bars, bpm, title, testId }: Props) {
  const [error, setError] = useState('');
  function download() {
    let url: string | undefined;
    let link: HTMLAnchorElement | undefined;
    try {
      setError('');
      const bytes = buildMidi(tracks, bars, bpm);
      // An owned ArrayBuffer is accepted by Blob across TypeScript DOM versions.
      const buffer = new ArrayBuffer(bytes.length);
      new Uint8Array(buffer).set(bytes);
      url = URL.createObjectURL(new Blob([buffer], { type: 'audio/midi' }));
      link = document.createElement('a');
      link.href = url;
      link.download = midiFilename(title, bpm);
      document.body.appendChild(link);
      link.click();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the MIDI file. Please try again.');
    } finally {
      link?.remove();
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30_000);
      }
    }
  }
  return <>
    <button type="button" className="roll-midi-button" onClick={download}
      aria-label={`Download MIDI for ${title}`} data-testid={`${testId}-download-midi`}>Download MIDI</button>
    {error && <span className="roll-player-error" role="alert">{error}</span>}
  </>;
}
