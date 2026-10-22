// Tactile audio feedback & Konkani speech synthesis

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Plays a synthesized pleasant tone */
export function playTone(freq = 440, type = 'sine', duration = 0.15, gainVal = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio cue error:", e);
  }
}

/** Audio feedback when mic starts listening */
export function playStartTone() {
  playTone(523.25, 'sine', 0.12, 0.2); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.18, 0.2), 100); // E5
}

/** Audio feedback when helper matches */
export function playSuccessChime() {
  playTone(523.25, 'triangle', 0.15, 0.2);
  setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.2), 120);
  setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.25), 240); // G5
}

/** Coin clink sound effect on task completion */
export function playCoinSound() {
  playTone(987.77, 'sine', 0.1, 0.3); // B5
  setTimeout(() => playTone(1318.51, 'sine', 0.3, 0.3), 80); // E6
}

/** Urgent emergency alarm tone */
export function playSosAlarm() {
  const ctx = getAudioContext();
  if (!ctx) return;
  for (let i = 0; i < 4; i++) {
    setTimeout(() => playTone(880, 'sawtooth', 0.15, 0.35), i * 220);
    setTimeout(() => playTone(660, 'sawtooth', 0.15, 0.35), i * 220 + 100);
  }
}

/** Spoken Konkani TTS using Web Speech API */
export function speakKonkaniText(text) {
  if (!('speechSynthesis' in window)) {
    console.warn("Web Speech API not supported.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  // Pick best available voice (kok-IN, mr-IN, hi-IN, or en-IN)
  const voices = window.speechSynthesis.getVoices();
  const konkaniVoice = voices.find(v => 
    v.lang.includes('kok') || 
    v.lang.includes('mr-IN') || 
    v.lang.includes('hi-IN') || 
    v.lang.includes('en-IN')
  );

  if (konkaniVoice) {
    utterance.voice = konkaniVoice;
  }
  utterance.rate = 0.95; // slightly slower for senior/blind clarity
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
}
