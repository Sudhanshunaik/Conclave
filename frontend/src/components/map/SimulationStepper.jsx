import React from 'react';
import { Play, CheckCircle2 } from 'lucide-react';

export default function SimulationStepper({ task, simulationStep, onAdvanceStep, isAutoSimulating }) {
  const steps = [
    { title: "Requested", subtitle: "Searching Goa helpers..." },
    { title: "Matched", subtitle: "Rahul Naik (4.95⭐)" },
    { title: "In Progress", subtitle: "Escorting along NH66" },
    { title: "Arrived", subtitle: "At GMC Bambolim OPD" },
    { title: "Completed", subtitle: "50 Coins Transferred" }
  ];

  const currentStep = task?.status === 'completed'
    ? 4
    : task?.status === 'arrived'
      ? 3
      : task?.status === 'in_progress'
        ? 2
        : task?.status === 'matched'
          ? 1
          : 0;

  return (
    <div className="card" style={{ marginTop: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          HACKATHON DEMO SIMULATION STEPPER • प्रात्यक्षिक नियंत्रक
        </span>
        {!isAutoSimulating && task?.status !== 'completed' && (
          <button
            className="pill-btn"
            onClick={onAdvanceStep}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              background: 'var(--primary-indigo)',
              color: 'white',
              gap: '6px'
            }}
          >
            <Play size={13} fill="white" />
            Simulate Next Step ({currentStep + 1}/5)
          </button>
        )}
      </div>

      <div className="timeline">
        {steps.map((st, idx) => {
          const isDone = idx < currentStep || task?.status === 'completed';
          const isActive = idx === currentStep && task?.status !== 'completed';

          return (
            <div
              key={idx}
              className={`timeline-step ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-node">
                {isDone ? <CheckCircle2 size={18} /> : idx + 1}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="step-title" style={{ color: isActive ? 'var(--text-main)' : undefined }}>
                  {st.title}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                  {st.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
