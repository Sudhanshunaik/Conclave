import React, { useState } from 'react';
import { Bell, CheckCircle, Navigation, Clock, Coins, MapPin } from 'lucide-react';

export default function AvailableTasksList({ tasks, activeTask, onAcceptTask }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleAccept = async (task) => {
    setLoadingId(task.id);
    await onAcceptTask(task);
    setLoadingId(null);
  };

  const displayTasks = tasks && tasks.length > 0 ? tasks : (activeTask ? [activeTask] : []);

  if (displayTasks.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📡</div>
        <h4>Nearby Assistance Radar Active</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Listening for requests from blind and senior citizens in Panaji, Bambolim, and Mapusa...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {displayTasks.map((t) => (
        <div
          key={t.id}
          style={{
            background: 'var(--bg-card)',
            border: t.id === activeTask?.id ? '2px solid var(--primary-indigo)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-verified" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-indigo)', borderColor: 'var(--primary-indigo)' }}>
                  {t.service_type?.replace('_', ' ').toUpperCase() || 'HOSPITAL ESCORT'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {t.created_at || 'Just now'}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', marginTop: '6px' }}>Citizen: {t.user_name}</h4>
            </div>

            <div className="coin-badge">
              +{t.coin_reward || 50} Coins (₹{t.coin_reward || 50})
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>📍 <strong>Pickup:</strong> {t.pickup_location}</div>
            <div>🏥 <strong>Destination:</strong> {t.destination}</div>
            {t.konkani_transcript && (
              <div style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                Konkani: "{t.konkani_transcript}"
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              Status: {t.status?.toUpperCase()}
            </span>

            {t.status === 'requested' && (
              <button
                className="pill-btn"
                onClick={() => handleAccept(t)}
                disabled={loadingId === t.id}
                style={{ background: 'var(--accent-emerald)', color: 'white', fontWeight: 700 }}
              >
                <CheckCircle size={15} />
                {loadingId === t.id ? 'Accepting...' : 'Accept Request'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
