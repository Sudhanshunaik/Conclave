import { useState, useCallback, useRef } from 'react';
import { synthesizeAudio } from '../services/api';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeAudioRef = useRef(null);

  const playAudioBase64 = useCallback((base64Data) => {
    try {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      const audioUrl = `data:audio/mp3;base64,${base64Data}`;
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);

      audio.play().catch((e) => console.warn("Audio play blocked by browser interaction policy:", e));
      return true;
    } catch (e) {
      console.warn("Base64 audio playback failed:", e);
      return false;
    }
  }, []);

  const speak = useCallback(async (text, { audioBase64 = null } = {}) => {
    if (!text && !audioBase64) return;

    // 1. If audioBase64 is passed directly from API response, play it immediately!
    if (audioBase64) {
      const played = playAudioBase64(audioBase64);
      if (played) return;
    }

    // 2. Otherwise request Google Cloud Neural studio voice from backend
    try {
      setIsSpeaking(true);
      const res = await synthesizeAudio(text);
      if (res && res.audio_base64) {
        const played = playAudioBase64(res.audio_base64);
        if (played) return;
      }
    } catch (err) {
      console.warn("Server neural voice synthesis failed, falling back to browser:", err);
    }

    // 3. Fallback to browser SpeechSynthesis only if offline/network failure
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v =>
        v.lang.includes('kok') ||
        v.lang.includes('mr-IN') ||
        v.lang.includes('hi-IN') ||
        v.lang.includes('en-IN')
      );
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [playAudioBase64]);

  const cancel = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    speak,
    playAudioBase64,
    cancel
  };
}
