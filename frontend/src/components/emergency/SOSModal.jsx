import React, { useEffect, useState } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { playSosAlarm } from '../../utils/konkaniAudio';
import { triggerEmergencySOS } from '../../services/api';

export default function SOSModal({ isOpen, onClose }) {
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      playSosAlarm();
      setCountdown(3);
      setIsDispatched(false);

      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            setIsDispatched(true);
            triggerEmergencySOS("Panaji KTC Bus Stand area");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.88)',
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
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-muted)' }}
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

        {!isDispatched ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-rose)', marginBottom: '8px' }}>
              {countdown}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Transmitting GPS location to Goa 108 Ambulance and nearest verified helpers in 3 seconds...
            </p>
            <button
              className="pill-btn"
              onClick={onClose}
              style={{ background: 'var(--bg-card)', color: 'white', padding: '10px 24px', margin: '0 auto' }}
            >
              Cancel Alert
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '18px',
              fontSize: '0.88rem'
            }}>
              <strong>Citizen:</strong> Asha Naik (Visually Impaired)<br />
              <strong>Coordinates:</strong> 15.4989° N, 73.8278° E (Panaji KTC)<br />
              <strong>Dispatch State:</strong> HIGH PRIORITY BEACON SENT
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <CheckCircle size={16} color="var(--accent-emerald)" />
                <span>Goa 108 Emergency Ambulance Dispatched</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <CheckCircle size={16} color="var(--accent-emerald)" />
                <span>Goa Police ERSS 112 Notified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <CheckCircle size={16} color="var(--accent-emerald)" />
                <span>Nearby Helper Rahul Naik (120m away) Intercepting</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="pill-btn"
                style={{ flex: 1, background: 'var(--accent-rose)', color: 'white', padding: '12px', justifyContent: 'center', fontWeight: 700 }}
                onClick={() => alert("Calling Goa 108 Ambulance...")}
              >
                <PhoneCall size={16} />
                Call 108 Ambulance
              </button>
              <button
                className="pill-btn"
                style={{ flex: 1, background: 'var(--bg-card)', color: 'white', padding: '12px', justifyContent: 'center' }}
                onClick={onClose}
              >
                I Am Safe / Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
