import React from 'react';
import { Eye, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';

export default function Header({
  isHighContrast,
  setIsHighContrast,
  autoSimulate,
  setAutoSimulate,
  onTriggerSos
}) {
  return (
    <header className="navbar" role="banner">
      <div className="brand-section">
        <div className="brand-icon" aria-hidden="true">
          🤝
        </div>
        <div>
          <h1 className="brand-title">Sahayak AI (सहायक AI)</h1>
          <div className="brand-tagline">
            तुमचो आवाज, तुमचो साhayak • Your Voice, Your Companion
          </div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Auto-simulation toggle */}
        <button
          className={`pill-btn ${autoSimulate ? 'active-sim' : ''}`}
          onClick={() => setAutoSimulate(!autoSimulate)}
          title="Auto-advance helper matching & GPS progression for solo presentations"
          aria-pressed={autoSimulate}
        >
          <Sparkles size={16} />
          {autoSimulate ? '⚡ Auto-Simulate: ON' : '⚡ Auto-Simulate: OFF'}
        </button>

        {/* High-contrast mode */}
        <button
          className="pill-btn"
          onClick={() => setIsHighContrast(!isHighContrast)}
          title="High contrast accessible mode for visually impaired"
          aria-pressed={isHighContrast}
        >
          <Eye size={16} />
          {isHighContrast ? 'Normal View' : '👁️ High Contrast'}
        </button>

        {/* SOS Emergency Button */}
        <button
          className="sos-trigger-btn"
          onClick={onTriggerSos}
          aria-label="Trigger Emergency Assistance"
        >
          <AlertTriangle size={18} />
          SOS / आपातकाल
        </button>
      </div>
    </header>
  );
}
