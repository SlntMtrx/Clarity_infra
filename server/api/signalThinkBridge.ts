// server/api/signalThinkBridge.ts

import type { TriggerSignal } from "../signals/types/TriggerSignal";
import { signalToInput } from "../signals/bridge/signalToInput";
import { think } from "../agent/think";
import type { SafeInput } from "../privacy/types/SafeInput";

/**
 * Represents a consent-first nudge.
 * No cognition has occurred yet.
 */
export interface ConsentNudge {
  type: "CONSENT_REQUIRED";
  prompt: string;
  signal: TriggerSignal;
  createdAt: number;
}

/**
 * Create a consent-first nudge from a trigger signal.
 * This function MUST NOT call think().
 */
export function createConsentNudge(
  signal: TriggerSignal
): ConsentNudge {
  return {
    type: "CONSENT_REQUIRED",
    prompt: "Noise detected. Want 60 seconds of clarity?",
    signal,
    createdAt: Date.now(),
  };
}

/**
 * Execute cognition ONLY after explicit user consent.
 * This is the single allowed path into think().
 */
export async function proceedWithConsent(
  nudge: ConsentNudge
) {
  const bottleneck = signalToInput(nudge.signal);

  const safeInput: SafeInput = {
    source: "extension",
    bottleneck,
    createdAt: new Date().toISOString(),
  };

  return think(safeInput);
}
