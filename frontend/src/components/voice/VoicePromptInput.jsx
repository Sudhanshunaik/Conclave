import React from 'react';
import { Mic, MicOff, Loader2, Sparkles, HeartPulse, Bus, ShoppingBag, Building2 } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export default function VoicePromptInput({ onPromptSubmit, isProcessing }) {
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => {
      if (text && text.trim().length > 0) {
        onPromptSubmit(text.trim());
      }
    }
  });

  const samplePrompts = [
    {
      title: "GMC Hospital Visit",
      konkani: "Maka GMC hospitalak vochunk sahayak zai",
      english: "I need a helper to go to GMC Hospital Bambolim",
      icon: <HeartPulse size={16} color="#f43f5e" />
    },
    {
      title: "Panaji KTC Escort",
      konkani: "Panaji KTC bus standak escort zai",
      english: "I need an escort at Panaji bus stand",
      icon: <Bus size={16} color="#3b82f6" />
    },
    {
      title: "Mapusa District Hospital",
      konkani: "District Hospital Mapusa vhorunk konn asa?",
      english: "Is someone available for Mapusa hospital?",
      icon: <Building2 size={16} color="#10b981" />
    },
    {
      title: "Ration / Grocery Shop",
      konkani: "Mhaka ration dukanant vochunk adhar zai",
      english: "I need assistance going to the ration shop",
      icon: <ShoppingBag size={16} color="#f59e0b" />
    }
  ];

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="voice-hero">
      <div className="mic-button-wrapper">
        <button
          className={`giant-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={handleMicClick}
          disabled={isProcessing}
          aria-label={isListening ? "Listening, tap to finish" : "Tap to speak in Konkani"}
        >
          {isProcessing ? (
            <Loader2 size={54} className="spin-animation" />
          ) : isListening ? (
            <MicOff size={54} />
          ) : (
            <Mic size={54} />
          )}
          <span className="mic-label">
            {isProcessing ? "Analyzing..." : isListening ? "Listening..." : "Speak Konkani"}
          </span>
        </button>
      </div>

      {/* Visual Audio Waveform */}
      <div className={`sound-waves ${isListening || isProcessing ? 'active' : ''}`} aria-hidden="true">
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
        <div className="wave-bar" />
      </div>

      <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {isListening
          ? "Aaikta... Speak naturally in Konkani / उल्लोवंक सुरु करा"
          : isProcessing
            ? "Gemini 2.5 Flash is extracting your request..."
            : "Tap the microphone or choose a quick 1-tap scenario below:"}
      </p>

      {/* 1-Tap Quick Sample Chips */}
      <div className="scenario-chips-container" style={{ marginTop: '18px' }}>
        <div className="chips-label">
          <Sparkles size={13} color="var(--primary-indigo)" />
          Quick 1-Tap Konkani Requests / झटपट कोकणी पर्याय
        </div>
        <div className="chips-grid">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => onPromptSubmit(p.konkani)}
              disabled={isProcessing}
              title={p.english}
            >
              {p.icon}
              <div>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  "{p.konkani}"
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
