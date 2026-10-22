import React, { useState, useEffect, useRef } from 'react';
import Header from './components/common/Header';
import TabNavigation from './components/common/TabNavigation';
import VoicePromptInput from './components/voice/VoicePromptInput';
import VoiceResponseCard from './components/voice/VoiceResponseCard';
import TaskConfirmModal from './components/voice/TaskConfirmModal';
import GoaLiveMap from './components/map/GoaLiveMap';
import SimulationStepper from './components/map/SimulationStepper';
import LandmarkCard from './components/map/LandmarkCard';
import HelperCard from './components/helper/HelperCard';
import AvailableTasksList from './components/helper/AvailableTasksList';
import CoinWalletModal from './components/helper/CoinWalletModal';
import SOSModal from './components/emergency/SOSModal';
import MetricsOverview from './components/admin/MetricsOverview';
import TransactionLedger from './components/admin/TransactionLedger';

import {
  processVoicePrompt,
  createTask,
  completeTask as apiCompleteTask,
  fetchHelpers,
  fetchTasks,
  fetchTransactions,
  fetchAdminMetrics,
  triggerEmergencySOS
} from './services/api';
import { playSuccessChime, playCoinSound } from './utils/konkaniAudio';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { PANAJI_TO_GMC_ROUTE } from './utils/goaLocations';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'map' | 'helper' | 'admin'
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(true);

  // Core Data State
  const [activeTask, setActiveTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [activeHelper, setActiveHelper] = useState(null);
  const [allHelpers, setAllHelpers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Voice & Interaction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastVoiceResponse, setLastVoiceResponse] = useState(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentHelperCoords, setCurrentHelperCoords] = useState(null);

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { speak } = useSpeechSynthesis();
  const simTimerRef = useRef(null);

  // Sync high-contrast theme attribute
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isHighContrast]);

  // Initial data loading
  useEffect(() => {
    async function initData() {
      const [helpersData, tasksData, txData, mData] = await Promise.all([
        fetchHelpers(),
        fetchTasks(),
        fetchTransactions(),
        fetchAdminMetrics()
      ]);
      setAllHelpers(helpersData);
      if (helpersData.length > 0) setActiveHelper(helpersData[0]);
      setAllTasks(tasksData);
      setTransactions(txData);
      setMetrics(mData);
    }
    initData();
  }, []);

  // Handle Voice Prompt Submission
  const handleVoiceSubmit = async (promptText) => {
    setIsProcessing(true);
    try {
      const response = await processVoicePrompt(promptText);
      setLastVoiceResponse(response);

      if (response.intent === 'emergency_sos') {
        setIsSosOpen(true);
        setIsProcessing(false);
        return;
      }

      // Read response aloud in natural Google Neural Studio Voice
      if (response.konkani_spoken_response) {
        speak(response.konkani_spoken_response, { audioBase64: response.audio_base64 });
      }
    } catch (err) {
      console.error("Voice processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm and Create Task Dispatch
  const handleConfirmTask = async () => {
    if (!lastVoiceResponse) return;
    setIsProcessing(true);
    try {
      const newTask = await createTask({
        user_id: "user_asha_01",
        service_type: lastVoiceResponse.service_type || "hospital_visit",
        pickup_location: lastVoiceResponse.pickup_location || "Panaji KTC Bus Stand",
        pickup_coords: lastVoiceResponse.pickup_coords || { lat: 15.4989, lng: 73.8278 },
        destination: lastVoiceResponse.destination || "Goa Medical College (GMC) Bambolim",
        dest_coords: lastVoiceResponse.dest_coords || { lat: 15.4616, lng: 73.8567 },
        konkani_transcript: lastVoiceResponse.konkani_spoken_response,
        coin_reward: lastVoiceResponse.coin_reward || 50
      });

      setActiveTask(newTask);
      setAllTasks((prev) => [newTask, ...prev]);
      setSimulationStep(0);
      setCurrentHelperCoords(null);
      setIsConfirmModalOpen(false);

      if (autoSimulate) {
        startAutoSimulation(newTask);
      }
    } catch (err) {
      console.error("Task creation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-simulation progression
  const startAutoSimulation = (task) => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);

    // Step 1: Matched after 2s
    simTimerRef.current = setTimeout(() => {
      setSimulationStep(1);
      playSuccessChime();
      speak("Rahul Naik verified sahayak match zala.");
      setActiveTask((prev) => prev ? {
        ...prev,
        status: 'matched',
        helper_id: activeHelper?.id,
        helper_name: activeHelper?.name,
        helper_rating: activeHelper?.rating
      } : null);
      setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[0][0], lng: PANAJI_TO_GMC_ROUTE[0][1] });

      // Step 2: In transit after 3.5s
      simTimerRef.current = setTimeout(() => {
        setSimulationStep(2);
        setActiveTask((prev) => prev ? { ...prev, status: 'in_progress' } : null);
        setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[2][0], lng: PANAJI_TO_GMC_ROUTE[2][1] });

        // Step 3: Approaching GMC after 3.5s
        simTimerRef.current = setTimeout(() => {
          setSimulationStep(3);
          setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[4][0], lng: PANAJI_TO_GMC_ROUTE[4][1] });

          // Step 4: Arrived after 3s
          simTimerRef.current = setTimeout(() => {
            setSimulationStep(4);
            setActiveTask((prev) => prev ? { ...prev, status: 'arrived' } : null);
            setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[6][0], lng: PANAJI_TO_GMC_ROUTE[6][1] });

            // Step 5: Completed after 2.5s
            simTimerRef.current = setTimeout(() => {
              handleCompleteTask();
            }, 2500);
          }, 3000);
        }, 3500);
      }, 3500);
    }, 2000);
  };

  // Manual step progression
  const handleManualAdvanceStep = async () => {
    if (!activeTask) return;
    const nextStep = simulationStep + 1;
    setSimulationStep(nextStep);

    if (nextStep === 1) {
      playSuccessChime();
      setActiveTask((prev) => ({
        ...prev,
        status: 'matched',
        helper_id: activeHelper?.id,
        helper_name: activeHelper?.name
      }));
      setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[0][0], lng: PANAJI_TO_GMC_ROUTE[0][1] });
    } else if (nextStep === 2) {
      setActiveTask((prev) => ({ ...prev, status: 'in_progress' }));
      setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[2][0], lng: PANAJI_TO_GMC_ROUTE[2][1] });
    } else if (nextStep === 3) {
      setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[4][0], lng: PANAJI_TO_GMC_ROUTE[4][1] });
    } else if (nextStep === 4) {
      setActiveTask((prev) => ({ ...prev, status: 'arrived' }));
      setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[6][0], lng: PANAJI_TO_GMC_ROUTE[6][1] });
    } else if (nextStep >= 5) {
      handleCompleteTask();
    }
  };

  // Task Completion & Coin Payout
  const handleCompleteTask = async () => {
    if (activeTask) {
      await apiCompleteTask(activeTask.id);
      setActiveTask((prev) => ({ ...prev, status: 'completed' }));
      setSimulationStep(5);
      playCoinSound();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      const rewardAmount = activeTask.coin_reward || 50;
      setActiveHelper((prev) => prev ? {
        ...prev,
        coins_balance: prev.coins_balance + rewardAmount,
        completed_tasks_count: prev.completed_tasks_count + 1
      } : null);

      setTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          helper_id: activeHelper?.id,
          amount: rewardAmount,
          type: "earned",
          description: `Assisted Asha Naik to GMC Bambolim`,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }
  };

  const handleHelperAccept = async (taskToAccept) => {
    playSuccessChime();
    const task = taskToAccept || activeTask;
    setActiveTask({
      ...task,
      status: 'matched',
      helper_id: activeHelper?.id,
      helper_name: activeHelper?.name
    });
    setSimulationStep(1);
    setCurrentHelperCoords({ lat: PANAJI_TO_GMC_ROUTE[0][0], lng: PANAJI_TO_GMC_ROUTE[0][1] });
  };

  const handleTriggerSos = async () => {
    await triggerEmergencySOS("Panaji KTC Bus Stand Area");
    setIsSosOpen(true);
  };

  return (
    <div className="app-container">
      {/* 1. Header with branding & persistent SOS */}
      <Header
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        autoSimulate={autoSimulate}
        setAutoSimulate={setAutoSimulate}
        onTriggerSos={handleTriggerSos}
      />

      {/* 2. Primary Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 3. Screen 1: Konkani Voice Assistant */}
      {activeTab === 'voice' && (
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                🎙️ Konkani Voice Assistant • आवाज साhayak
              </div>
              <span className="badge-verified" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-indigo)' }}>
                Powered by Gemini 2.5 Flash
              </span>
            </div>

            <VoicePromptInput
              onPromptSubmit={handleVoiceSubmit}
              isProcessing={isProcessing}
            />

            <VoiceResponseCard
              response={lastVoiceResponse}
              onConfirmTask={handleConfirmTask}
              isConfirming={isProcessing}
            />

            {activeTask && activeTask.status !== 'requested' && activeHelper && (
              <HelperCard
                helper={activeHelper}
                task={activeTask}
                onCompleteTask={handleCompleteTask}
              />
            )}
          </div>

          <div>
            <GoaLiveMap
              task={activeTask}
              helper={activeHelper}
              simulationStep={simulationStep}
              pickupCoords={activeTask?.pickup_coords}
              destCoords={activeTask?.dest_coords}
              currentHelperCoords={currentHelperCoords}
            />
            {activeTask && (
              <SimulationStepper
                task={activeTask}
                simulationStep={simulationStep}
                onAdvanceStep={handleManualAdvanceStep}
                isAutoSimulating={autoSimulate}
              />
            )}
          </div>
        </div>
      )}

      {/* 4. Screen 2: Interactive Live Goa Map */}
      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GoaLiveMap
            task={activeTask}
            helper={activeHelper}
            simulationStep={simulationStep}
            pickupCoords={activeTask?.pickup_coords}
            destCoords={activeTask?.dest_coords}
            currentHelperCoords={currentHelperCoords}
          />
          <SimulationStepper
            task={activeTask}
            simulationStep={simulationStep}
            onAdvanceStep={handleManualAdvanceStep}
            isAutoSimulating={autoSimulate}
          />
          <LandmarkCard />
        </div>
      )}

      {/* 5. Screen 3: Verified Helper Marketplace & Coin Wallet */}
      {activeTab === 'helper' && activeHelper && (
        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #131c31 0%, #1a2238 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="helper-avatar" style={{ width: '48px', height: '48px' }}>
                    {activeHelper.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{activeHelper.name}</h3>
                    <div className="badge-verified">
                      <ShieldCheck size={12} />
                      {activeHelper.verification_badge}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Wallet Balance
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    🪙 {activeHelper.coins_balance} Coins (₹{activeHelper.coins_balance})
                  </div>
                  <button
                    className="pill-btn"
                    onClick={() => setIsWalletOpen(true)}
                    style={{ background: 'var(--primary-gradient)', color: 'white', marginTop: '6px', fontWeight: 700 }}
                  >
                    Redeem to Bank (UPI)
                  </button>
                </div>
              </div>
            </div>

            <AvailableTasksList
              tasks={allTasks}
              activeTask={activeTask}
              onAcceptTask={handleHelperAccept}
            />
          </div>

          <div>
            <GoaLiveMap
              task={activeTask}
              helper={activeHelper}
              simulationStep={simulationStep}
              pickupCoords={activeTask?.pickup_coords}
              destCoords={activeTask?.dest_coords}
              currentHelperCoords={currentHelperCoords}
            />
          </div>
        </div>
      )}

      {/* 6. Screen 5: Hackathon Admin Dashboard */}
      {activeTab === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MetricsOverview metrics={metrics} />

          {/* Helper Verification Registry */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <ShieldCheck size={20} color="var(--accent-emerald)" />
                Goa Verified Helper Registry • पडताळणी रजिस्टर
              </div>
              <span className="badge-verified">
                Police Background Verified
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    <th style={{ padding: '12px' }}>Helper Name</th>
                    <th style={{ padding: '12px' }}>Credentials</th>
                    <th style={{ padding: '12px' }}>Rating</th>
                    <th style={{ padding: '12px' }}>Tasks</th>
                    <th style={{ padding: '12px' }}>Coins</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allHelpers.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>
                        {h.name}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{h.phone}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge-verified">
                          <ShieldCheck size={11} />
                          {h.verification_badge}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                        ⭐ {h.rating}
                      </td>
                      <td style={{ padding: '12px' }}>{h.completed_tasks_count}</td>
                      <td style={{ padding: '12px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                        {h.coins_balance} Coins
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontSize: '0.78rem', fontWeight: 700 }}>
                          <CheckCircle size={13} />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <TransactionLedger transactions={transactions} />
        </div>
      )}

      {/* 7. Modals */}
      <SOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

      {activeHelper && (
        <CoinWalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          helper={activeHelper}
          onRedeemSuccess={(redeemed) => {
            setActiveHelper((prev) => prev ? {
              ...prev,
              coins_balance: prev.coins_balance - redeemed
            } : null);
          }}
        />
      )}

      <TaskConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        task={activeTask}
        onConfirm={handleConfirmTask}
      />
    </div>
  );
}
