let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a synthesized sound effect using Web Audio API.
 * Zero files to download, extremely fast latency.
 * @param {string} mode - 'mech' | 'digital'
 * @param {boolean} isError - if true, plays an error sound
 */
export function playKeySound(mode, isError = false) {
  if (mode === 'none' && !isError) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // ── ERROR SOUND ──────────────────────────────────────────────
    if (isError) {
      // Low buzz sound
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
      return;
    }

    if (mode === 'none') return;

    // ── MECHANICAL CLICK ─────────────────────────────────────────
    if (mode === 'mech') {
      // Mechanical sound is composed of a sharp high-frequency click (key cap)
      // and a low frequency dull thud (bottom out).
      
      // 1. High frequency click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.008);
      
      clickGain.gain.setValueAtTime(0.04, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
      
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.01);

      // 2. Low dull thud (randomized slightly for realism)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      const bandpass = ctx.createBiquadFilter();
      
      thudOsc.type = 'sine';
      const pitch = 110 + Math.random() * 20; // 110Hz to 130Hz
      thudOsc.frequency.setValueAtTime(pitch, now);
      thudOsc.frequency.exponentialRampToValueAtTime(70, now + 0.035);
      
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(160, now);
      bandpass.Q.setValueAtTime(2, now);
      
      thudGain.gain.setValueAtTime(0.18, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      
      thudOsc.connect(bandpass);
      bandpass.connect(thudGain);
      thudGain.connect(ctx.destination);
      
      thudOsc.start(now);
      thudOsc.stop(now + 0.04);
    }

    // ── DIGITAL BEEP / POP ───────────────────────────────────────
    if (mode === 'digital') {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

      gainNode.gain.setValueAtTime(0.03, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (err) {
    console.warn('Web Audio synthesis failed:', err);
  }
}
