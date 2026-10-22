import React from 'react';
import { Sparkles, Building2, Bus, ShoppingBag, ShieldAlert, HeartPulse } from 'lucide-react';

export default function ScenarioChips({ onSelectScenario, isProcessing }) {
  const scenarios = [
    {
      title: "GMC Hospital Visit",
      konkani: "Maka GMC Bambolim hospitalak vochunk ek verified sahayak zai",
      english: "I need a verified companion to visit GMC Bambolim OPD",
      icon: <HeartPulse size={17} color="#f43f5e" />,
      tag: "Hospital"
    },
    {
      title: "Panaji KTC Bus Guide",
      konkani: "Maka Panaji KTC bus standak vochunk guide zai",
      english: "I need mobility assistance reaching Panaji KTC bus stand",
      icon: <Bus size={17} color="#3b82f6" />,
      tag: "Transport"
    },
    {
      title: "Mapusa Market Shopping",
      konkani: "Maka Mapusa bazarant saman haddunk sahayak zai",
      english: "I need help shopping in Mapusa Municipal Market",
      icon: <ShoppingBag size={17} color="#10b981" />,
      tag: "Everyday"
    },
    {
      title: "Provedoria Welfare Office",
      konkani: "Maka Provedoria sarkari karyalayak vochunk adhar zai",
      english: "Assistance to visit Social Welfare Office in Panaji",
      icon: <Building2 size={17} color="#f59e0b" />,
      tag: "Govt Office"
    }
  ];

  return (
    <div className="scenario-chips-container">
      <div className="chips-label">
        <Sparkles size={14} color="var(--primary-indigo)" />
        Quick Konkani Demo Scenarios / त्वरित कोकणी पर्याय
      </div>
      <div className="chips-grid">
        {scenarios.map((sc, idx) => (
          <button
            key={idx}
            className="chip-btn"
            onClick={() => onSelectScenario(sc.konkani)}
            disabled={isProcessing}
            title={sc.english}
          >
            {sc.icon}
            <div>
              <div style={{ fontWeight: 700 }}>{sc.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {sc.konkani.slice(0, 36)}...
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
