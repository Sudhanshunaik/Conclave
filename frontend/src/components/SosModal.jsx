import React, { useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { playSosAlarm } from '../utils/konkaniAudio';

export default function SosModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      playSosAlarm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#1a0b12',
        border: '2px solid var(--accent-rose)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        boxShadow: 'var(--glow-rose)',
        color: '#ffffff',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'var(--accent-rose)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={28} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              EMERGENCY SOS BROADCAST
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              आपातकालीन alert सक्रिय केला
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          fontSize: '0.92rem',
          lineHeight: 1.5
        }}>
          <strong>Citizen:</strong> Asha Naik (Visually Impaired)<br />
          <strong>Live GPS Coordinates:</strong> 15.4989° N, 73.8278° E (Panaji KTC Bus Stand)<br />
          <strong>Status:</strong> Immediate SOS Beacon Transmitted to nearest verified helpers!
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" />
            <span>Goa 108 Emergency Ambulance Dispatched</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" />
            <span>Goa Police ERSS 112 Notified with location</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" />
            <span>Helper Rahul Naik (120m away) alerted to intercept</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="pill-btn"
            style={{
              flex: 1,
              background: 'var(--accent-rose)',
              color: 'white',
              padding: '12px',
              justifyContent: 'center',
              fontWeight: 700
            }}
            onClick={() => alert("Calling Goa 108 Emergency Services...")}
          >
            <PhoneCall size={18} />
            Call 108 Ambulance
          </button>
          <button
            className="pill-btn"
            style={{
              flex: 1,
              background: 'var(--bg-card)',
              color: 'white',
              padding: '12px',
              justifyContent: 'center'
            }}
            onClick={onClose}
          >
            I am Safe / Alert Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
