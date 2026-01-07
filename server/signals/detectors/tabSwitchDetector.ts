import { TriggerSignal } from "../types/TriggerSignal";

let switchCount = 0;
let windowStart = Date.now();

const WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const THRESHOLD = 15;

export function recordTabSwitch(): TriggerSignal | null {
  const now = Date.now();

  // Reset window if expired
  if (now - windowStart > WINDOW_MS) {
    switchCount = 0;
    windowStart = now;
  }

  switchCount++;

  if (switchCount >= THRESHOLD) {
    const signal: TriggerSignal = {
      type: "rapid_tab_switching",
      value: switchCount,
      durationMs: now - windowStart,
      detectedAt: now,
    };

    // Reset after firing
    switchCount = 0;
    windowStart = now;

    return signal;
  }

  return null;
}
