import React from 'react';
import { Mic, MapPin, Users, BarChart3 } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'voice', label: 'Voice Assistant', konkani: 'आवाज साhayak', icon: <Mic size={18} /> },
    { id: 'map', label: 'Live Goa Map', konkani: 'थेट स्थान ट्रॅकिंग', icon: <MapPin size={18} /> },
    { id: 'helper', label: 'Helper Portal', konkani: 'सहायक पोर्टल', icon: <Users size={18} /> },
    { id: 'admin', label: 'Admin Impact', konkani: 'डॅशबोर्ड', icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className="role-tabs" style={{ marginBottom: '20px', width: 'fit-content' }} role="tablist" aria-label="Main application sections">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`role-tab-btn ${activeTab === t.id ? 'active' : ''}`}
          onClick={() => setActiveTab(t.id)}
          role="tab"
          aria-selected={activeTab === t.id}
        >
          {t.icon}
          <span>{t.label}</span>
          <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({t.konkani})</span>
        </button>
      ))}
    </nav>
  );
}
