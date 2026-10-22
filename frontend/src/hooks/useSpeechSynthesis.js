import { useState, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text, { rate = 0.95, pitch = 1.05 } = {}) => {
    if (!('speechSynthesis' in window)) {
      console.warn("SpeechSynthesis not supported.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick best available Indian regional voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v =>
      v.lang.includes('kok') ||
      v.lang.includes('mr-IN') ||
      v.lang.includes('hi-IN') ||
      v.lang.includes('en-IN')
    );

    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    cancel
  };
}
