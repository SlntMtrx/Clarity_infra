import { describe, it, expect } from "vitest";
import { shouldPersist } from "./shouldPersist";
import type { PatternArtifact } from "../../shared/types/PatternArtifact";

function mockPattern(
  confidence: number,
  occurrences = 1
): PatternArtifact {
  return {
    id: "pattern-1",
    patternType: "recurring_uncertainty",
    summary: "You keep hesitating at the same decision points.",
    confidence,
    occurrences,
    firstDetectedAt: new Date().toISOString(),
    lastDetectedAt: new Date().toISOString(),
  };
}

describe("shouldPersist", () => {
  it("does not persist low confidence patterns", () => {
    expect(shouldPersist(mockPattern(0.4, 3))).toBe(false);
  });

  it("does not persist single-occurrence patterns", () => {
    expect(shouldPersist(mockPattern(0.9, 1))).toBe(false);
  });

  it("persists repeated high-confidence patterns", () => {
    expect(shouldPersist(mockPattern(0.85, 3))).toBe(true);
  });
});
