/**
 * AgentState
 * ----------
 * This file defines the complete, bounded cognitive model of a user.
 *
 * IMPORTANT PRINCIPLES:
 * - Epistemic, not prescriptive (beliefs, not goals)
 * - Abstracted, not verbatim (no raw thoughts)
 * - Bounded and decaying (nothing grows forever)
 * - Read-only during cognition passes
 */

/**
 * Represents a single hypothesized cognitive pattern.
 * Example: "Avoids starting when success criteria are undefined"
 */
export interface CognitivePattern {
  id: string;

  /**
   * Human-readable description of the pattern.
   * Used ONLY for internal reasoning, never shown directly to users.
   */
  description: string;

  /**
   * Confidence score in range [0, 1).
   * Never reaches 1.0 — the system is always uncertain.
   */
  confidence: number;

  /**
   * Number of independent observations supporting this pattern.
   * Prevents overfitting to single sessions.
   */
  evidenceCount: number;

  /**
   * ISO timestamp of last observation.
   * Used for decay and relevance weighting.
   */
  lastObservedAt: string;

  /**
   * Rate at which confidence decays over time
   * when no new evidence appears.
   */
  decayRate: number;
}

/**
 * Models when the system SHOULD or SHOULD NOT interrupt the user.
 * This exists primarily to prevent false positives and annoyance.
 */
export interface TriggerModel {
  /**
   * User-specific tolerance for interruption.
   * Higher = more willing to be nudged.
   */
  interruptionTolerance: number;

  /**
   * Estimated false-positive rate for past nudges.
   * Used to reduce aggressiveness over time.
   */
  falsePositiveRate: number;

  /**
   * Signals that have historically been accepted by the user.
   * Key = signal name, value = acceptance confidence.
   */
  acceptedTriggers: Record<string, number>;

  /**
   * Signals that should generally be ignored for this user.
   */
  rejectedTriggers: Record<string, number>;

  /**
   * Cooldown and timing preferences.
   */
  cooldownPreferences: {
    dailyLimit: number;
    preferredTimeWindows: string[]; // e.g. ["09:00-12:00"]
  };
}

/**
 * Tracks which types of Socratic questions
 * actually help this user make progress.
 */
export interface QuestionStrategy {
  /**
   * Question categories that tend to unlock clarity.
   */
  effectiveQuestionTypes: Record<string, number>;

  /**
   * Question categories that tend to stall or frustrate.
   */
  ineffectiveQuestionTypes: Record<string, number>;

  /**
   * User preference for question verbosity.
   */
  preferredQuestionLength: "short" | "medium" | "long";

  /**
   * Signals that indicate the user is stuck or disengaging.
   */
  stallSignals: {
    longPauses: boolean;
    repeatedRephrasing: boolean;
  };
}

/**
 * Hard safety constraints.
 * These NEVER learn and NEVER adapt.
 */
export interface SafetyBoundaries {
  /**
   * Categories of output the system must never produce.
   */
  prohibitedOutputs: Array<
    | "advice"
    | "imperatives"
    | "action_plans"
    | "emotional_validation"
    | "diagnosis"
  >;

  /**
   * Maximum duration of a thinking session in seconds.
   */
  maxSessionDurationSeconds: number;

  /**
   * Maximum number of questions per session.
   */
  maxQuestionsPerSession: number;

  /**
   * Whether user consent is required before storing memory.
   */
  requireUserOptInForMemory: boolean;

  /**
   * Allowed tone for all outputs.
   */
  allowedTone: "neutral";
}

/**
 * The complete agent state for a single user.
 * This is the ONLY long-lived intelligence in the system.
 */
export interface AgentState {
  /**
   * Versioning allows safe schema evolution.
   */
  version: number;

  /**
   * Probabilistic model of how this user's thinking breaks.
   */
  cognitivePatterns: CognitivePattern[];

  /**
   * Personalized interruption model.
   */
  triggerModel: TriggerModel;

  /**
   * Adaptive Socratic questioning strategy.
   */
  questionStrategy: QuestionStrategy;

  /**
   * Non-negotiable safety constraints.
   */
  safetyBoundaries: SafetyBoundaries;

  /**
   * Timestamp of last update to this state.
   */
  lastUpdatedAt: string;
}
