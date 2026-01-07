/**
 * Artifact
 * --------
 * A Cognitive Artifact is the ONLY user-facing output of the system.
 *
 * Core rules:
 * - Exactly one clear thought
 * - No advice, no plans, no emotional validation
 * - Compressed, not explanatory
 * - Action-neutral (clarifies, does not direct)
 */

/**
 * The type of cognitive compression performed.
 * Used internally for evaluation and tuning.
 */
export type ArtifactType =
  | "clarification"
  | "reframe"
  | "constraint_exposure"
  | "assumption_surface"
  | "decision_fog_reduction"
  | "pattern_insight";

/**
 * Represents a single, situational cognitive artifact.
 */
export interface CognitiveArtifact {
  /**
   * The compressed thought itself.
   * This MUST be:
   * - one sentence
   * - declarative
   * - under a strict length limit (enforced elsewhere)
   */
  content: string;

  /**
   * The category of cognitive work performed.
   * Never shown directly to the user.
   */
  type: ArtifactType;

  /**
   * Epistemic confidence (not correctness).
   */
  confidence: number;

  /**
   * Whether this artifact is safe to persist as memory.
   * Situational artifacts are usually NOT persistable.
   */
  persistable: boolean;

  /**
   * ISO timestamp of artifact creation.
   */
  createdAt: string;
}

/**
 * Represents a structural, longitudinal cognitive pattern.
 * These are rare, high-confidence, and always persistable.
 */
export interface PatternArtifact {
  /**
   * Structural insight derived from repeated cognition.
   * Still ONE sentence. Still declarative.
   */
  content: string;

  /**
   * Always a pattern insight.
   */
  type: "pattern_insight";

  /**
   * Pattern artifacts must meet a higher confidence bar.
   */
  confidence: number;

  /**
   * Pattern artifacts are always persistable.
   */
  persistable: true;

  /**
   * Number of observed occurrences supporting this pattern.
   */
  occurrences: number;

  /**
   * Bottleneck category this pattern represents.
   */
  bottleneckType: string;

  /**
   * ISO timestamp of artifact creation.
   */
  createdAt: string;
}

/**
 * Optional metadata used for internal evaluation and debugging.
 * This must NEVER be exposed to the user.
 */
export interface ArtifactMetadata {
  /**
   * Approximate compression ratio from input to output.
   * Used to tune prompt effectiveness.
   */
  compressionRatio: number;

  /**
   * IDs of cognitive patterns that influenced this artifact.
   */
  contributingPatternIds: string[];

  /**
   * Whether the artifact passed all safety checks on first pass.
   */
  safetyPassed: boolean;
}

/**
 * Complete response returned from the cognition engine.
 * This is what the API returns to the frontend.
 *
 * Union enforces explicit handling of pattern escalation.
 */
export type ArtifactResponse =
  | { artifact: CognitiveArtifact; metadata?: ArtifactMetadata }
  | { artifact: PatternArtifact; metadata?: ArtifactMetadata };
