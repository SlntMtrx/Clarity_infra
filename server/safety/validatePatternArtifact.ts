import type { PatternArtifact } from "../../shared/types/Artifact";

export function validatePatternArtifact(
  artifact: PatternArtifact
): { valid: boolean; reason?: string } {
  if (artifact.confidence < 0.85) {
    return {
      valid: false,
      reason: "Pattern artifact confidence too low.",
    };
  }

  if (artifact.occurrences < 2) {
    return {
      valid: false,
      reason: "Insufficient occurrences for pattern detection.",
    };
  }

  if (artifact.type !== "pattern_insight") {
    return {
      valid: false,
      reason: "Invalid artifact type for pattern artifact.",
    };
  }

  if (!artifact.persistable) {
    return {
      valid: false,
      reason: "Pattern artifacts must be persistable.",
    };
  }

  return { valid: true };
}
