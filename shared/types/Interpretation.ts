/**
 * Interpretation
 * --------------
 * An Interpretation represents the system's internal understanding
 * of why the user's thinking is currently unstable.
 *
 * IMPORTANT:
 * - This is NOT user-facing
 * - This is NOT emotional labeling
 * - This is NOT diagnosis
 *
 * It exists purely to guide compression into a Cognitive Artifact.
 */

/**
 * High-level categories of cognitive breakdown.
 * These are abstract and intentionally non-clinical.
 */
export type CognitiveBottleneckType =
  | "uncertainty"
  | "overconstraint"
  | "underconstraint"
  | "conflicting_goals"
  | "premature_optimization"
  | "avoidance"
  | "decision_fatigue"
  | "attention_fragmentation";

/**
 * Represents a single inferred cognitive bottleneck.
 */
export interface CognitiveBottleneck {
  /**
   * The inferred bottleneck category.
   */
  type: CognitiveBottleneckType;

  /**
   * Short explanation used internally by the system.
   * NEVER shown directly to the user.
   */
  description: string;

  /**
   * Epistemic confidence score [0, 1).
   * Reflects belief, not correctness.
   */
  confidence: number;
}

/**
 * Captures key tensions or ambiguities present in the user's input.
 * These are often the raw material for compression.
 */
export interface CognitiveTension {
  /**
   * One side of the tension.
   */
  left: string;

  /**
   * The opposing or conflicting side.
   */
  right: string;
}

/**
 * Represents the system's complete internal interpretation
 * of a single cognitive interruption.
 */
export interface Interpretation {
  /**
   * Primary inferred bottleneck.
   */
  primaryBottleneck: CognitiveBottleneck;

  /**
   * Secondary bottlenecks, if any.
   */
  secondaryBottlenecks?: CognitiveBottleneck[];

  /**
   * Key unresolved tensions detected in the input.
   */
  tensions?: CognitiveTension[];

  /**
   * Degree of fragmentation detected in the user's thinking.
   * Used to decide how aggressive compression should be.
   */
  fragmentationLevel: number;

  /**
   * ISO timestamp of interpretation creation.
   */
  createdAt: string;
}
