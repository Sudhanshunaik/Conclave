import React from 'react';
import { ArrowDownRight, ArrowUpRight, Coins, Clock } from 'lucide-react';

export default function TransactionLedger({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No transactions recorded yet.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="card-header" style={{ marginBottom: '14px' }}>
        <div className="card-title">
          <Coins size={18} color="var(--accent-amber)" />
          Real-Time Activity & Coin Economy Ledger • व्यवहार वही
        </div>
        <span className="badge-verified">
          1 Coin = ₹1 INR
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.map((tx) => {
          const isEarned = tx.type === 'earned';
          return (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.86rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: isEarned ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  color: isEarned ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isEarned ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{tx.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    {tx.timestamp}
                  </div>
                </div>
              </div>

              <div style={{
                fontWeight: 800,
                fontSize: '0.95rem',
                color: isEarned ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}>
                {isEarned ? `+${tx.amount}` : tx.amount} Coins
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
