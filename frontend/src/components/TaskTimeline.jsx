import React from 'react';
import { CheckCircle2, Play, ArrowRight, Award } from 'lucide-react';

export default function TaskTimeline({ task, simulationStep, onAdvanceStep, isAutoSimulating }) {
  const steps = [
    { title: "Voice Request", subtitle: "Konkani AI Processed" },
    { title: "Helper Matched", subtitle: "Rahul Naik (4.95⭐)" },
    { title: "Helper En Route", subtitle: "Reaching Pickup Point" },
    { title: "Escorting", subtitle: "Assisting to GMC" },
    { title: "Completed & Paid", subtitle: "50 Coins Transferred" }
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
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          TASK PROGRESSION TIMELINE • कार्य प्रगती
        </span>
        {!isAutoSimulating && task?.status !== 'completed' && (
          <button
            className="pill-btn"
            onClick={onAdvanceStep}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              background: 'var(--primary-indigo)',
              color: 'white'
            }}
          >
            <Play size={13} fill="white" />
            Advance Step ({currentStep + 1}/5)
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
