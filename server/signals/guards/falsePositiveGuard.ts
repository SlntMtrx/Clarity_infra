import { TriggerSignal } from "../types/TriggerSignal";

const MIN_GAP_BETWEEN_NUDGES_MS = 15_000;

export function shouldFireNudge(
  signal: TriggerSignal,
  recentSignals: TriggerSignal[]
): boolean {
  if (!signal) return false;

  // Block slow, deliberate research-style behavior
  if (
    signal.type === "rapid_tab_switching" &&
    signal.durationMs > 5 * 60 * 1000 &&
    signal.value < 20
  ) {
    return false;
  }

  const lastSignal = recentSignals[recentSignals.length - 1];

  // First non-research signal is allowed
  if (!lastSignal) return true;

  // Prevent rapid re-interruption
  const timeSinceLast = signal.detectedAt - lastSignal.detectedAt;
  if (timeSinceLast < MIN_GAP_BETWEEN_NUDGES_MS) {
    return false;
  }

  return true;
}
