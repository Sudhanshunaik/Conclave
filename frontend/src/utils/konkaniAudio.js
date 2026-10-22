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

let activeAudio = null;

/** Plays base64 MP3 studio voice directly */
export function playBase64Audio(base64Data) {
  try {
    if (activeAudio) {
      activeAudio.pause();
    }
    const audio = new Audio(`data:audio/mp3;base64,${base64Data}`);
    activeAudio = audio;
    audio.play().catch(e => console.warn("Autoplay notice:", e));
    return true;
  } catch (e) {
    console.warn("Base64 audio playback failed:", e);
    return false;
  }
}

/** Spoken Konkani using Google Cloud Neural Human Studio Voice */
export async function speakKonkaniText(text, audioBase64 = null) {
  if (audioBase64) {
    const ok = playBase64Audio(audioBase64);
    if (ok) return;
  }

  // Attempt to fetch Google Neural audio from backend
  try {
    const res = await fetch("http://localhost:8000/api/voice/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audio_base64) {
        const ok = playBase64Audio(data.audio_base64);
        if (ok) return;
      }
    }
  } catch (err) {
    console.warn("Neural audio synthesis request failed:", err);
  }

  // Fallback to browser SpeechSynthesis only if server audio fails
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const konkaniVoice = voices.find(v => 
      v.lang.includes('kok') || 
      v.lang.includes('mr-IN') || 
      v.lang.includes('hi-IN') || 
      v.lang.includes('en-IN')
    );
    if (konkaniVoice) utterance.voice = konkaniVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }
}

