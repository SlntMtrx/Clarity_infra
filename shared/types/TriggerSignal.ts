/**
 * TriggerSignal
 * -------------
 * A TriggerSignal represents an objective, behavioral indication
 * that the user's thinking may be fragmenting.
 *
 * IMPORTANT:
 * - Signals are non-judgmental
 * - Signals do NOT imply distraction
 * - Signals only indicate potential cognitive instability
 */

/**
 * Supported trigger signal types.
 * These are intentionally behavioral, not emotional.
 */
export type TriggerSignalType =
  | "rapid_tab_switching"
  | "rapid_window_switching"
  | "repeated_open_close"
  | "rapid_app_switching"
  | "search_query_loop"
  | "cursor_scroll_thrashing";

/**
 * Represents a single detected trigger signal.
 */
export interface TriggerSignal {
  /**
   * The type of signal detected.
   */
  type: TriggerSignalType;

  /**
   * Raw numeric value associated with the signal.
   * Example: number of tab switches in a time window.
   */
  value: number;

  /**
   * Duration (in milliseconds) over which the signal was measured.
   */
  durationMs: number;

  /**
   * Optional contextual metadata.
   * Used internally to reduce false positives.
   */
  context?: {
    /**
     * Number of unique domains or contexts involved.
     */
    domainCount?: number;

    /**
     * Average dwell time per context (in milliseconds).
     */
    averageDwellMs?: number;

    /**
     * Whether the signal occurred during a known focus window.
     */
    duringFocusWindow?: boolean;
  };

  /**
   * ISO timestamp of when the signal was detected.
   */
  detectedAt: string;
}
