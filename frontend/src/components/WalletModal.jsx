import React, { useState } from 'react';
import { Coins, ArrowDownRight, CheckCircle, X, Sparkles } from 'lucide-react';
import { redeemHelperCoins } from '../utils/api';
import confetti from 'canvas-confetti';

export default function WalletModal({ isOpen, onClose, helper, onRedeemSuccess }) {
  const [coinsToRedeem, setCoinsToRedeem] = useState(100);
  const [upiId, setUpiId] = useState('rahul.naik@oksbi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (coinsToRedeem <= 0 || coinsToRedeem > (helper?.coins_balance || 0)) {
      alert("Please enter a valid amount of coins.");
      return;
    }

    setIsSubmitting(true);
    const res = await redeemHelperCoins(helper.id, coinsToRedeem, upiId);
    setIsSubmitting(false);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });

    setSuccessMessage(res.message || `₹${coinsToRedeem} transferred to ${upiId}`);
    if (onRedeemSuccess) onRedeemSuccess(coinsToRedeem);
  };

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
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-amber)'
          }}>
            <Coins size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Helper Earnings Wallet</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Convert earned service coins into direct INR bank payouts
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Available Balance
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {helper?.coins_balance || 0} Coins
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Exchange Value
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              ₹{helper?.coins_balance || 0} INR
            </div>
          </div>
        </div>

        {successMessage ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Transfer Successful!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              {successMessage}
            </p>
            <button
              className="pill-btn"
              onClick={onClose}
              style={{ margin: '0 auto', background: 'var(--primary-indigo)', color: 'white' }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleRedeem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>
                Coins to Redeem (1 Coin = ₹1)
              </label>
              <input
                type="number"
                min="10"
                max={helper?.coins_balance || 500}
                value={coinsToRedeem}
                onChange={(e) => setCoinsToRedeem(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  fontWeight: 700
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>
                Goa UPI ID / Bank VPA
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="pill-btn"
              disabled={isSubmitting}
              style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                padding: '12px',
                justifyContent: 'center',
                fontWeight: 700,
                marginTop: '8px'
              }}
            >
              <ArrowDownRight size={16} />
              {isSubmitting ? 'Transferring...' : `Redeem ₹${coinsToRedeem} to Bank`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
