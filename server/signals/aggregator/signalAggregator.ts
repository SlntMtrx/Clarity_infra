import { TriggerSignal } from "../types/TriggerSignal";

const AGGREGATION_WINDOW_MS = 3 * 60 * 1000; // 3 minutes

export function aggregateSignals(
  signals: TriggerSignal[]
): TriggerSignal | null {
  if (!signals.length) return null;

  const now = Date.now();

  const recent = signals.filter(
    s => now - s.detectedAt <= AGGREGATION_WINDOW_MS
  );

  if (!recent.length) return null;

  // Choose strongest signal deterministically
  recent.sort((a, b) => b.value - a.value);
  return recent[0];
}
