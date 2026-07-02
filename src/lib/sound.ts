const SOUND_KEY = "tsubuyakiBattlerSound_v1";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {
      // ignore
    });
  }
  return ctx;
}

export function isSoundOn(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(SOUND_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
}

function tone(
  audioCtx: AudioContext,
  {
    freqStart,
    freqEnd,
    startTime,
    duration,
    gainPeak,
    type = "square",
  }: {
    freqStart: number;
    freqEnd?: number;
    startTime: number;
    duration: number;
    gainPeak: number;
    type?: OscillatorType;
  }
) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, startTime);
  if (typeof freqEnd === "number" && freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), startTime + duration);
  }
  gain.gain.setValueAtTime(gainPeak, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playMove(): void {
  if (!isSoundOn()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  tone(audioCtx, { freqStart: 440, freqEnd: 660, startTime: now, duration: 0.12, gainPeak: 0.12 });
}

export function playHit(crit: boolean): void {
  if (!isSoundOn()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  tone(audioCtx, {
    freqStart: 150,
    freqEnd: 60,
    startTime: now,
    duration: crit ? 0.22 : 0.16,
    gainPeak: crit ? 0.28 : 0.18,
    type: "square",
  });
  if (crit) {
    tone(audioCtx, { freqStart: 1400, freqEnd: 1800, startTime: now + 0.05, duration: 0.12, gainPeak: 0.14 });
  }
}

export function playEvent(): void {
  if (!isSoundOn()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  tone(audioCtx, { freqStart: 520, startTime: now, duration: 0.08, gainPeak: 0.08 });
  tone(audioCtx, { freqStart: 700, startTime: now + 0.11, duration: 0.08, gainPeak: 0.08 });
}

export function playFaint(): void {
  if (!isSoundOn()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  tone(audioCtx, { freqStart: 600, freqEnd: 80, startTime: now, duration: 0.5, gainPeak: 0.2 });
}

export function playVictory(): void {
  if (!isSoundOn()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  const noteDur = 0.22;
  notes.forEach((freq, i) => {
    tone(audioCtx, {
      freqStart: freq,
      startTime: now + i * noteDur,
      duration: noteDur * 0.95,
      gainPeak: 0.16,
    });
  });
}
