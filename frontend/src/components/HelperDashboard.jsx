import React, { useState } from 'react';
import { Coins, CheckCircle, Navigation, ShieldCheck, ArrowUpRight, DollarSign, Award, Bell } from 'lucide-react';
import { playCoinSound } from '../utils/konkaniAudio';
import confetti from 'canvas-confetti';

export default function HelperDashboard({
  helper,
  activeTask,
  onAcceptTask,
  onCompleteTask,
  onOpenWallet
}) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAcceptTask();
    setIsAccepting(false);
  };

  const handleComplete = () => {
    playCoinSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCompleteTask();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Helper Wallet & Overview Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #131c31 0%, #1a2238 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="helper-avatar" style={{ width: '44px', height: '44px', fontSize: '1.2rem' }}>
                {helper.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Welcome, {helper.name}</h3>
                <div className="badge-verified">
                  <ShieldCheck size={12} />
                  {helper.verification_badge}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Earnings Wallet (नाणी)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Coins size={22} />
                {helper.coins_balance} Coins (₹{helper.coins_balance})
              </div>
            </div>

            <button
              className="pill-btn"
              onClick={onOpenWallet}
              style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                padding: '10px 18px',
                fontWeight: 700
              }}
            >
              <ArrowUpRight size={16} />
              Redeem UPI / Bank
            </button>
          </div>
        </div>
      </div>

      {/* Active / Incoming Task Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Bell size={18} color="var(--accent-amber)" />
            {activeTask ? 'Active Assigned Request • सक्रिय कार्य' : 'Nearby Assistance Radar (Goa)'}
          </div>
          <span className="badge-verified" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-indigo)', borderColor: 'var(--primary-indigo)' }}>
            Goa Radius: 5km
          </span>
        </div>

        {activeTask ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{activeTask.service_type === 'hospital_visit' ? '🏥 Hospital OPD Companion' : 'Everyday Companion'}</h4>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Citizen: <strong>{activeTask.user_name}</strong>
                  </div>
                </div>
                <div className="coin-badge">
                  +{activeTask.coin_reward} Coins Reward (₹{activeTask.coin_reward})
                </div>
              </div>

              <div style={{ margin: '14px 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>📍 <strong>Pickup:</strong> {activeTask.pickup_location}</div>
                <div>🏁 <strong>Destination:</strong> {activeTask.destination}</div>
                {activeTask.konkani_transcript && (
                  <div style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '4px' }}>
                    Konkani Request: "{activeTask.konkani_transcript}"
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                {activeTask.status === 'requested' && (
                  <button
                    className="pill-btn"
                    style={{ background: 'var(--accent-emerald)', color: 'white', padding: '10px 20px', fontWeight: 700 }}
                    onClick={handleAccept}
                    disabled={isAccepting}
                  >
                    <CheckCircle size={16} />
                    Accept Request / स्वीकार करा
                  </button>
                )}
                {activeTask.status !== 'completed' && activeTask.status !== 'requested' && (
                  <button
                    className="pill-btn"
                    style={{ background: 'var(--primary-indigo)', color: 'white', padding: '10px 20px', fontWeight: 700 }}
                    onClick={handleComplete}
                  >
                    <CheckCircle size={16} />
                    Mark Completed & Collect {activeTask.coin_reward} Coins
                  </button>
                )}
                <button
                  className="pill-btn"
                  onClick={() => alert(`Starting turn-by-turn navigation from Panaji to ${activeTask.destination}`)}
                >
                  <Navigation size={16} />
                  Start GPS Guide
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📡</div>
            <h4>Listening for nearby assistance requests in Goa...</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Switch to the "Citizen (Asha)" tab and speak a Konkani request to trigger an incoming dispatch!
            </p>
          </div>
        )}
      </div>

      {/* Helper Stats & Milestones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {helper.completed_tasks_count}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Tasks Completed
          </div>
        </div>

        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            ⭐ {helper.rating}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Rating ({helper.reviews_count} reviews)
          </div>
        </div>

        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-indigo)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Verification Status
          </div>
        </div>
      </div>
    </div>
  );
}
