import React from 'react';
import { CheckCircle2, Clock, Coins, MapPin, Navigation, Sparkles, Volume2 } from 'lucide-react';
import AudioSpeaker from '../common/AudioSpeaker';

export default function VoiceResponseCard({ response, onConfirmTask, isConfirming }) {
  if (!response) return null;

  return (
    <div className="transcript-box" style={{ marginTop: '16px', background: 'rgba(99, 102, 241, 0.08)', borderColor: 'var(--border-highlight)' }}>
      {/* Header Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-verified" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-indigo)' }}>
            Intent: {response.service_type?.replace('_', ' ').toUpperCase() || 'ASSISTANCE'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
            ✨ {Math.round((response.confidence_score || 0.95) * 100)}% Confidence
          </span>
        </div>

        <AudioSpeaker
          text={response.konkani_spoken_response}
          label="Aikanvya (Listen)"
        />
      </div>

      {/* Konkani Spoken Text */}
      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
        "{response.konkani_spoken_response}"
      </div>

      {/* English Translation */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '14px' }}>
        English: "{response.english_translation}"
      </div>

      {/* Extracted Route Preview */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '0.84rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={15} color="var(--accent-emerald)" />
          <span><strong>Pickup:</strong> {response.pickup_location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={15} color="var(--accent-rose)" />
          <span><strong>Destination:</strong> {response.destination}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            Est. {response.estimated_duration_minutes || 45} mins
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontWeight: 700 }}>
            <Coins size={13} />
            Reward: {response.coin_reward || 50} Sahayak Coins (₹{response.coin_reward || 50})
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        className="pill-btn"
        onClick={onConfirmTask}
        disabled={isConfirming}
        style={{
          width: '100%',
          marginTop: '14px',
          padding: '12px',
          background: 'var(--primary-gradient)',
          color: 'white',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}
      >
        <Sparkles size={16} />
        {isConfirming ? "Matching Nearby Verified Helper..." : "Sahayak Sodha (Confirm & Find Helper)"}
      </button>
    </div>
  );
}
