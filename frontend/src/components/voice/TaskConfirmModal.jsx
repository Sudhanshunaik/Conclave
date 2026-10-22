import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, Navigation, X } from 'lucide-react';

export default function TaskConfirmModal({ isOpen, onClose, task, onConfirm }) {
  if (!isOpen || !task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '460px',
        width: '100%',
        padding: '24px',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Confirm Assistance Dispatch
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Connecting you with Goa Police cleared local helpers in Tiswadi / Bardez.
        </p>

        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '18px' }}>
          <div>📍 <strong>Pickup:</strong> {task.pickup_location}</div>
          <div>🏥 <strong>Destination:</strong> {task.destination}</div>
          <div style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
            🪙 Helper Reward: {task.coin_reward || 50} Coins
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="pill-btn"
            onClick={onConfirm}
            style={{ flex: 1, background: 'var(--primary-gradient)', color: 'white', padding: '12px', justifyContent: 'center', fontWeight: 700 }}
          >
            Confirm Dispatch
          </button>
          <button
            className="pill-btn"
            onClick={onClose}
            style={{ padding: '12px', background: 'transparent', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
