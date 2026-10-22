import { useState, useEffect, useRef, useCallback } from 'react';
import { playStartTone } from '../utils/konkaniAudio';

export function useSpeechRecognition({ onResult, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'kok-IN'; // Konkani locale

      recognition.onstart = () => {
        setIsListening(true);
        playStartTone();
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setTranscript(text);
        if (event.results[0].isFinal && onResult) {
          onResult(text);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition restart catch:", err);
      }
    } else {
      // Simulate speech for unsupported environments
      setIsListening(true);
      playStartTone();
      setTimeout(() => {
        const fallbackSample = "Maka GMC hospitalak vochunk sahayak zai";
        setTranscript(fallbackSample);
        setIsListening(false);
        if (onResult) onResult(fallbackSample);
      }, 1500);
    }
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    setTranscript
  };
}
