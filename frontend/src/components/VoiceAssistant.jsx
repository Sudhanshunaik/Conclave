import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, Sparkles } from 'lucide-react';
import { playStartTone, playSuccessChime, speakKonkaniText } from '../utils/konkaniAudio';

export default function VoiceAssistant({ onVoiceSubmit, isProcessing, lastResponse }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Click or tap below to speak in Konkani / उल्लोवंक क्लीक करा');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API if supported in browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'kok-IN'; // Konkani locale with Hindi/English fallback

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening to your voice in Konkani... / तुमचो आवाज aaikta...');
        playStartTone();
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
        setStatusMessage('Tap to speak again or use the quick scenario buttons below.');
      };

      recognition.onend = () => {
        setIsListening(false);
        // If captured text, trigger submit
        setTranscript((latest) => {
          if (latest && latest.trim().length > 0) {
            setStatusMessage('Processing with Sahayak AI...');
            onVoiceSubmit(latest.trim());
          } else {
            setStatusMessage('Click below to speak in Konkani / उल्लोवंक क्लीक करा');
          }
          return latest;
        });
      };

      recognitionRef.current = recognition;
    }
  }, [onVoiceSubmit]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // If already running or permission issue
          console.warn("Speech recognition restart:", e);
          simulateDefaultSpeech();
        }
      } else {
        // Fallback for browsers without speech recognition
        simulateDefaultSpeech();
      }
    }
  };

  const simulateDefaultSpeech = () => {
    setIsListening(true);
    setStatusMessage('Simulating Konkani voice input...');
    playStartTone();
    setTimeout(() => {
      const sample = "Maka GMC hospitalak vochunk ek verified sahayak zai";
      setTranscript(sample);
      setIsListening(false);
      onVoiceSubmit(sample);
    }, 1800);
  };

  const handleReadAloud = () => {
    if (lastResponse?.konkani_spoken_response) {
      speakKonkaniText(lastResponse.konkani_spoken_response);
    }
  };

  return (
    <div className="voice-hero">
      <div className="mic-button-wrapper">
        <button
          className={`giant-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={isProcessing}
          aria-label={isListening ? "Listening, tap to finish" : "Tap to speak in Konkani"}
          title="Giant accessible microphone for elderly and visually impaired"
        >
          {isProcessing ? (
            <Loader2 size={54} className="spin-animation" />
          ) : isListening ? (
            <MicOff size={54} />
          ) : (
            <Mic size={54} />
          )}
          <span className="mic-label">
            {isProcessing ? "Analyzing..." : isListening ? "Listening" : "Speak Konkani"}
          </span>
        </button>
      </div>

      {/* Dynamic Sound Wave Visualizer */}
      <div className={`sound-waves ${isListening || isProcessing ? 'active' : ''}`} aria-hidden="true">
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
      </div>

      <p style={{ marginTop: '12px', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {statusMessage}
      </p>

      {/* Transcript Card */}
      {(transcript || lastResponse) && (
        <div className="transcript-box" role="region" aria-live="polite">
          <div className="transcript-header">
            <span>Konkani Voice Transcript • आवाज प्रत</span>
            {lastResponse && (
              <button
                onClick={handleReadAloud}
                className="pill-btn"
                style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                title="Hear response in spoken Konkani"
              >
                <Volume2 size={13} />
                Aaikat (Listen)
              </button>
            )}
          </div>
          <div className="transcript-konkani">
            "{transcript || lastResponse?.konkani_spoken_response || 'Maka GMC hospitalak vochunk sahayak zai'}"
          </div>
          {lastResponse?.english_translation && (
            <div className="transcript-english">
              English: "{lastResponse.english_translation}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
