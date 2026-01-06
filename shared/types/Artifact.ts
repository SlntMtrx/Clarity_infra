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
  | "decision_fog_reduction";

/**
 * Represents a single cognitive artifact returned to the user.
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
   * Confidence score indicating how strongly the system
   * believes this artifact reflects the user's bottleneck.
   *
   * This is epistemic confidence, not correctness.
   */
  confidence: number;

  /**
   * Whether this artifact is safe to persist as memory.
   * Some artifacts are situational and should not shape long-term state.
   */
  persistable: boolean;

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
 */
export interface ArtifactResponse {
  artifact: CognitiveArtifact;

  /**
   * Metadata is optional and stripped in most production responses.
   */
  metadata?: ArtifactMetadata;
}
