/**
 * validateArtifact
 * ----------------
 * Enforces all non-negotiable safety and quality constraints
 * on raw cognitive output.
 *
 * This module decides whether text is:
 * - acceptable
 * - rejectable
 *
 * It does NOT fix or regenerate artifacts.
 */

export interface ArtifactValidationResult {
  valid: boolean;
  reasons?: string[];
  persistable?: boolean;
}

export function validateArtifact(text: string): ArtifactValidationResult {
  // Defensive guard — infra-level safety
  if (typeof text !== "string") {
    throw new TypeError(
      `validateArtifact expected string, received ${typeof text}`
    );
  }

  const reasons: string[] = [];
  const normalized = text.toLowerCase().trim();

  if (!isSingleSentence(text)) {
    reasons.push("Artifact must contain exactly one sentence.");
  }

  if (containsAdvice(normalized)) {
    reasons.push("Artifact contains advice or directive language.");
  }

  if (containsQuestion(text)) {
    reasons.push("Artifact must not contain questions.");
  }

  if (containsEmotionalValidation(normalized)) {
    reasons.push("Artifact contains emotional validation.");
  }

  if (text.length > 240) {
    reasons.push("Artifact exceeds maximum allowed length.");
  }

  const valid = reasons.length === 0;

  const persistable =
    valid &&
    text.length > 40 &&
    !normalized.includes("right now") &&
    !normalized.includes("currently") &&
    !normalized.includes("this moment");

  return {
    valid,
    reasons: valid ? undefined : reasons,
    persistable,
  };
}

/* =========================
   Helper functions
   ========================= */

function isSingleSentence(text: string): boolean {
  const matches = text.match(/[.!?]/g);
  return matches !== null && matches.length === 1;
}

function containsAdvice(text: string): boolean {
  const advicePatterns = [
    "you should",
    "try to",
    "consider",
    "it would be better",
    "the best way",
    "you need to",
    "you must",
  ];

  return advicePatterns.some((p) => text.includes(p));
}

function containsQuestion(text: string): boolean {
  return text.includes("?");
}

function containsEmotionalValidation(text: string): boolean {
  const emotionalPatterns = [
    "it's okay",
    "it is okay",
    "it's normal",
    "that makes sense",
    "you are feeling",
    "i understand how you feel",
    "it's understandable",
  ];

  return emotionalPatterns.some((p) => text.includes(p));
}
