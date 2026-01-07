/**
 * RawSignal
 * ---------
 * Represents pre-privacy user interaction signals.
 *
 * These signals are:
 * - High fidelity
 * - Potentially identifying
 * - NEVER allowed into cognition
 *
 * RawSignal exists ONLY to be:
 *   → aggregated
 *   → abstracted
 *   → destroyed
 */

export interface RawSignal {
  /**
   * Origin of the signal.
   * Example: browser extension
   */
  source: "extension";

  /**
   * Type of low-level signal.
   */
  type:
    | "TAB_SWITCH"
    | "FOCUS_CHANGE"
    | "IDLE"
    | "KEY_ACTIVITY";

  /**
   * Timestamp when signal occurred.
   * Milliseconds since epoch.
   */
  timestamp: number;

  /**
   * Optional metadata.
   * ⚠️ May contain sensitive info.
   * MUST NOT leave the signal layer.
   */
  metadata?: unknown;
}
