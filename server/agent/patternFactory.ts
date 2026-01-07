import type { Interpretation } from "../../shared/types/Interpretation";
import type { PatternArtifact, PatternType } from "../../shared/types/PatternArtifact";

export function createPatternArtifact(
  interpretation: Interpretation,
  previousPattern?: PatternArtifact
): PatternArtifact {
  const now = new Date().toISOString();

  const patternType = mapBottleneckToPattern(
    interpretation.primaryBottleneck.type
  );

  const previousOccurrences = previousPattern
    ? previousPattern.occurrences
    : 0;

  return {
    id: `pattern_${patternType}`,
    summary: buildPatternSummary(patternType),
    patternType,
    confidence: interpretation.primaryBottleneck.confidence,
    occurrences: previousOccurrences + 1,
    firstDetectedAt: previousPattern
      ? previousPattern.firstDetectedAt
      : now,
    lastDetectedAt: now,
  };
}

/**
 * Map low-level bottleneck → stable pattern.
 */
function mapBottleneckToPattern(bottleneck: string): PatternType {
  switch (bottleneck) {
    case "uncertainty":
      return "recurring_uncertainty";
    case "attention_fragmentation":
      return "chronic_fragmentation";
    case "avoidance":
      return "avoidance_loop";
    case "premature_optimization":
      return "premature_optimization_cycle";
    default:
      return "constraint_avoidance";
  }
}

/**
 * Pattern summaries are fixed templates.
 * Never LLM-generated.
 */
function buildPatternSummary(pattern: PatternType): string {
  switch (pattern) {
    case "recurring_uncertainty":
      return "Progress repeatedly stalls because key success criteria remain undefined.";
    case "chronic_fragmentation":
      return "Attention repeatedly fragments because multiple unresolved threads compete at once.";
    case "avoidance_loop":
      return "Action is repeatedly delayed when decisions approach irreversible commitment.";
    case "premature_optimization_cycle":
      return "Clarity is repeatedly lost by optimizing details before constraints are fixed.";
    default:
      return "Progress repeatedly stalls due to unresolved structural constraints.";
  }
}
