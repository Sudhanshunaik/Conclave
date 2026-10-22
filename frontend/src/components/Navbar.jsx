import React from 'react';
import { Shield, Sparkles, Volume2, Eye, AlertTriangle, Users, UserCheck } from 'lucide-react';

export default function Navbar({
  currentRole,
  setCurrentRole,
  isHighContrast,
  setIsHighContrast,
  autoSimulate,
  setAutoSimulate,
  onTriggerSos
}) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="brand-section">
        <div className="brand-icon" aria-hidden="true">
          🤝
        </div>
        <div>
          <div className="brand-title">Sahayak AI</div>
          <div className="brand-tagline">tumcho aawaz, tumcho sahayak • तुमचो आवाज, तुमचो साhayak</div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Role Switcher */}
        <div className="role-tabs" role="tablist" aria-label="User Persona Selector">
          <button
            className={`role-tab-btn ${currentRole === 'user' ? 'active' : ''}`}
            onClick={() => setCurrentRole('user')}
            role="tab"
            aria-selected={currentRole === 'user'}
          >
            👤 Citizen (Asha)
          </button>
          <button
            className={`role-tab-btn ${currentRole === 'helper' ? 'active' : ''}`}
            onClick={() => setCurrentRole('helper')}
            role="tab"
            aria-selected={currentRole === 'helper'}
          >
            🤝 Helper (Rahul)
          </button>
          <button
            className={`role-tab-btn ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentRole('admin')}
            role="tab"
            aria-selected={currentRole === 'admin'}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <button
          className={`pill-btn ${autoSimulate ? 'active-sim' : ''}`}
          onClick={() => setAutoSimulate(!autoSimulate)}
          title="Toggle automatic helper acceptance and GPS progression for solo demo"
          aria-pressed={autoSimulate}
        >
          <Sparkles size={16} />
          {autoSimulate ? '⚡ Auto-Simulate: ON' : '⚡ Auto-Simulate: OFF'}
        </button>

        {/* High Contrast Accessibility Toggle */}
        <button
          className="pill-btn"
          onClick={() => setIsHighContrast(!isHighContrast)}
          title="Toggle High Contrast Accessible Display for Visually Impaired"
          aria-pressed={isHighContrast}
        >
          <Eye size={16} />
          {isHighContrast ? 'Standard Mode' : '👁️ High Contrast'}
        </button>

        {/* Emergency SOS Button */}
        <button
          className="sos-trigger-btn"
          onClick={onTriggerSos}
          aria-label="Trigger Emergency Assistance"
        >
          <AlertTriangle size={18} />
          SOS / आपातकाल
        </button>
      </div>
    </nav>
  );
}
