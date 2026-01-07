export {};

import type { PatternArtifact } from "../../shared/types/PatternArtifact";

export function decayPatterns(
  patterns: Record<string, PatternArtifact>
): Record<string, PatternArtifact> {
  const decayed: Record<string, PatternArtifact> = {};

  for (const key in patterns) {
    const pattern = patterns[key];

    decayed[key] = {
      ...pattern,
      confidence: Math.max(pattern.confidence * 0.9, 0),
    };
  }

  return decayed;
}
