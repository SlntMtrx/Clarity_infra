import { describe, it, expect, beforeEach } from "vitest";
import {
  savePattern,
  loadPatterns,
  clearStore,
} from "./patternStore";
import type { PatternArtifact } from "../../../shared/types/PatternArtifact";

/**
 * Helper
 */
function mockPattern(
  overrides?: Partial<PatternArtifact>
): PatternArtifact {
  const now = new Date().toISOString();

  return {
    id: "pattern-1",
    summary: "User repeatedly doubts decisions",
    patternType: "recurring_uncertainty",
    confidence: 0.85,
    occurrences: 3,
    firstDetectedAt: now,
    lastDetectedAt: now,
    ...overrides,
  };
}

describe("patternStore (local)", () => {
  beforeEach(() => {
    clearStore();
  });

  it("starts empty", () => {
    const patterns = loadPatterns();
    expect(Object.keys(patterns)).toHaveLength(0);
  });

  it("saves and loads a pattern by id", () => {
    const pattern = mockPattern();

    savePattern(pattern);

    const patterns = loadPatterns();
    expect(patterns[pattern.id]).toBeDefined();
  });

  it("overwrites an existing pattern with the same id", () => {
    savePattern(mockPattern({ confidence: 0.6 }));
    savePattern(mockPattern({ confidence: 0.9 }));

    const patterns = loadPatterns();
    expect(patterns["pattern-1"].confidence).toBe(0.9);
  });
});
