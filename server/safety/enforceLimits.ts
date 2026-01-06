/**
 * enforceLimits
 * -------------
 * Enforces strict execution limits on cognition flows.
 *
 * This module prevents:
 * - infinite retries
 * - runaway latency
 * - silent degradation
 *
 * These limits are HARD. They do not adapt.
 */

export interface CognitionLimits {
  /**
   * Maximum number of LLM attempts allowed
   * for a single cognitive pass.
   */
  maxAttempts: number;

  /**
   * Maximum total time allowed (ms)
   * for a cognitive pass.
   */
  maxDurationMs: number;
}

/**
 * Default system limits.
 * Tuned conservatively.
 */
export const DEFAULT_LIMITS: CognitionLimits = {
  maxAttempts: 2,
  maxDurationMs: 3_000, // 3 seconds total
};

/**
 * Tracks execution state for a cognition pass.
 */
export class LimitEnforcer {
  private attempts = 0;
  private readonly startTime: number;

  constructor(private readonly limits: CognitionLimits = DEFAULT_LIMITS) {
    this.startTime = Date.now();
  }

  /**
   * Record an attempt and check if another is allowed.
   */
  registerAttempt(): void {
    this.attempts += 1;

    if (this.attempts > this.limits.maxAttempts) {
      throw new Error("Cognition attempt limit exceeded.");
    }

    if (this.elapsedTime() > this.limits.maxDurationMs) {
      throw new Error("Cognition time limit exceeded.");
    }
  }

  /**
   * Returns elapsed time since cognition started.
   */
  elapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Returns whether another attempt is permitted.
   */
  canContinue(): boolean {
    return (
      this.attempts < this.limits.maxAttempts &&
      this.elapsedTime() < this.limits.maxDurationMs
    );
  }
}
