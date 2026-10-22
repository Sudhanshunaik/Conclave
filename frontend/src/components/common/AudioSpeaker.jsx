import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export default function AudioSpeaker({ text, audioBase64 = null, label = "Aikanvya (Listen)" }) {
  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  const handleToggle = () => {
    if (isSpeaking) {
      cancel();
    } else if (text || audioBase64) {
      speak(text, { audioBase64 });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="pill-btn"
      style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '5px' }}
      title={isSpeaking ? "Stop audio" : "Play speech aloud"}
      aria-label={label}
    >
      {isSpeaking ? <VolumeX size={13} color="var(--accent-rose)" /> : <Volume2 size={13} color="var(--primary-indigo)" />}
      <span>{label}</span>
    </button>
  );
}
