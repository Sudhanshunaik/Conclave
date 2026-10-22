import React from 'react';
import { ShieldCheck, Star, Phone, MessageSquare, Award, Coins } from 'lucide-react';

export default function HelperCard({ helper, task, onCompleteTask }) {
  if (!helper) return null;

  return (
    <div className="helper-card-box">
      <div className="helper-info">
        <div className="helper-avatar">
          {helper.name.charAt(0)}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="helper-name">{helper.name}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={14} fill="var(--accent-amber)" />
              {helper.rating}
            </span>
          </div>

          <div className="badge-verified">
            <ShieldCheck size={12} />
            {helper.verification_badge || "Goa Police Cleared • Aadhaar Verified"}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Languages: {helper.languages ? helper.languages.join(', ') : 'Konkani, English'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div className="coin-badge">
          <Coins size={16} />
          +{task?.coin_reward || 50} Coins
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="pill-btn"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={() => alert(`Calling verified helper ${helper.name} at ${helper.phone}`)}
          >
            <Phone size={13} color="var(--accent-emerald)" />
            Call
          </button>
          {task?.status !== 'completed' && (
            <button
              className="pill-btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                background: 'var(--accent-emerald)',
                color: 'white'
              }}
              onClick={onCompleteTask}
            >
              Confirm Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
