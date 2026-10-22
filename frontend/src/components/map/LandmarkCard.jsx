import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { GOA_LANDMARKS } from '../../utils/goaLocations';

export default function LandmarkCard({ onSelectLandmark }) {
  const landmarks = [
    { key: "GMC_BAMBOLIM", label: "GMC Bambolim", desc: "Premier Super-Speciality Hospital", emoji: "🏥" },
    { key: "PANAJI_KTC", label: "Panaji KTC Stand", desc: "Interstate Transit Hub", emoji: "🚌" },
    { key: "MAPUSA_MARKET", label: "Mapusa Market", desc: "Municipal Friday Market", emoji: "🛒" },
    { key: "MARGAO_STATION", label: "Margao Railway", desc: "South Goa Rail Junction", emoji: "🚆" },
  ];

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '8px' }}>
        Key Goa Landmarks & Corridors
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {landmarks.map((lm) => (
          <div
            key={lm.key}
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{lm.emoji}</div>
            <div style={{ fontWeight: 700 }}>{lm.label}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{lm.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
