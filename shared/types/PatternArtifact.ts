/**
 * PatternArtifact
 * ----------------
 * Represents a recurring cognitive structure identified
 * across multiple clarification cycles.
 *
 * This is NOT a momentary insight.
 * This is a stable hypothesis about how the user's mind
 * repeatedly gets blocked.
 */

export type PatternType =
  | "recurring_uncertainty"
  | "chronic_fragmentation"
  | "avoidance_loop"
  | "premature_optimization_cycle"
  | "constraint_avoidance";

/**
 * A PatternArtifact is safe to persist.
 * It is generated ONLY by the agent — never the LLM.
 */
export interface PatternArtifact {
  /**
   * Stable identifier for this pattern.
   */
  id: string;

  /**
   * Human-readable compressed description.
   * Still one sentence. Still neutral.
   */
  summary: string;

  /**
   * Type of recurring cognitive pattern.
   */
  patternType: PatternType;

  /**
   * Confidence that this pattern is real.
   * Must exceed escalation threshold.
   */
  confidence: number;

  /**
   * Number of independent confirmations.
   */
  occurrences: number;

  /**
   * ISO timestamp when this pattern was first detected.
   */
  firstDetectedAt: string;

  /**
   * ISO timestamp when this pattern was last reinforced.
   */
  lastDetectedAt: string;
}
