import type { PatternArtifact } from "../../shared/types/PatternArtifact";

const MIN_CONFIDENCE = 0.8;
const MIN_OCCURRENCES = 2;

export function shouldPersist(
  pattern: PatternArtifact
): boolean {
  if (pattern.confidence < MIN_CONFIDENCE) {
    return false;
  }

  if (pattern.occurrences < MIN_OCCURRENCES) {
    return false;
  }

  return true;
}
