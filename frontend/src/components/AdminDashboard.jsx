import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Activity, Award, Coins, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { fetchAdminMetrics, fetchHelpers } from '../utils/api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [helpers, setHelpers] = useState([]);

  useEffect(() => {
    async function loadData() {
      const m = await fetchAdminMetrics();
      const h = await fetchHelpers();
      setMetrics(m);
      setHelpers(h);
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              Verified Helpers
            </span>
            <ShieldCheck size={20} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {metrics?.total_verified_helpers || 4}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            100% Police & Aadhaar Verified
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              Registered Citizens
            </span>
            <Users size={20} color="var(--primary-indigo)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {metrics?.active_registered_users || 142}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Blind, Elderly, Disabled (Goa)
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              Completed Missions
            </span>
            <Activity size={20} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
            {metrics?.tasks_completed || 36}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            Hospital, Bus, Market escorts
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              Coins Disbursed
            </span>
            <Coins size={20} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-amber)' }}>
            {metrics?.inr_economy_value || "₹1,135"}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            1 Coin = ₹1 INR Micro-Economy
          </div>
        </div>
      </div>

      {/* Helper Verification Registry */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={20} color="var(--accent-emerald)" />
            Goa Verified Helper Registry • पडताळणी रजिस्टर
          </div>
          <span className="pill-btn" style={{ fontSize: '0.78rem' }}>
            <Search size={14} />
            Filter by Taluka (Tiswadi, Bardez, Salcete)
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                <th style={{ padding: '12px 14px' }}>Helper Name</th>
                <th style={{ padding: '12px 14px' }}>Verification Documents</th>
                <th style={{ padding: '12px 14px' }}>Rating</th>
                <th style={{ padding: '12px 14px' }}>Tasks</th>
                <th style={{ padding: '12px 14px' }}>Coins Balance</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {helpers.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>
                    {h.name}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>
                      {h.phone}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge-verified">
                      <ShieldCheck size={11} />
                      {h.verification_badge}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    ⭐ {h.rating} ({h.reviews_count})
                  </td>
                  <td style={{ padding: '14px' }}>{h.completed_tasks_count}</td>
                  <td style={{ padding: '14px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    {h.coins_balance} Coins (₹{h.coins_balance})
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent-emerald)',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      <CheckCircle size={13} />
                      Active / Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
