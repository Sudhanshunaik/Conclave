import React from 'react';
import { ShieldCheck, Users, Activity, Coins, Star } from 'lucide-react';

export default function MetricsOverview({ metrics }) {
  const cards = [
    {
      label: "Verified Helpers",
      val: metrics?.total_verified_helpers || 4,
      sub: "100% Police & Aadhaar Verified",
      color: "var(--accent-emerald)",
      icon: <ShieldCheck size={20} color="var(--accent-emerald)" />
    },
    {
      label: "Registered Citizens",
      val: metrics?.active_registered_users || 142,
      sub: "Blind, Elderly, Disabled (Goa)",
      color: "var(--primary-indigo)",
      icon: <Users size={20} color="var(--primary-indigo)" />
    },
    {
      label: "Completed Missions",
      val: metrics?.tasks_completed || 36,
      sub: "Hospital, Bus, Market escorts",
      color: "var(--accent-cyan)",
      icon: <Activity size={20} color="var(--accent-cyan)" />
    },
    {
      label: "Coins Disbursed",
      val: metrics?.inr_economy_value || "₹1,135",
      sub: "1 Coin = ₹1 INR Micro-Economy",
      color: "var(--accent-amber)",
      icon: <Coins size={20} color="var(--accent-amber)" />
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {cards.map((c, idx) => (
        <div key={idx} className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              {c.label}
            </span>
            {c.icon}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: c.color }}>
            {c.val}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {c.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
