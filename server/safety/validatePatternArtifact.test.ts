import { describe, it, expect } from "vitest";
import { validatePatternArtifact } from "./validatePatternArtifact";

describe("pattern artifact validation", () => {
  it("accepts a valid pattern artifact", () => {
    const result = validatePatternArtifact({
      content: "Repeated uncertainty delays decisions.",
      type: "pattern_insight",
      confidence: 0.9,
      persistable: true,
      occurrences: 3,
      bottleneckType: "uncertainty",
      createdAt: new Date().toISOString(),
    });

    expect(result.valid).toBe(true);
  });

  it("rejects low-confidence pattern artifacts", () => {
    const result = validatePatternArtifact({
      content: "Pattern text",
      type: "pattern_insight",
      confidence: 0.6,
      persistable: true,
      occurrences: 3,
      bottleneckType: "uncertainty",
      createdAt: new Date().toISOString(),
    });

    expect(result.valid).toBe(false);
  });
});
