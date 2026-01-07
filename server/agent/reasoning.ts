import type { AgentRuntimeState } from "./state";
import type { Interpretation } from "../../shared/types/Interpretation";

export type AgentDecision =
  | { type: "STOP"; reason: string }
  | { type: "CLARIFY_ONCE" }
  | { type: "ESCALATE_PATTERN" };

export function decideNextAction(
  state: AgentRuntimeState,
  interpretation: Interpretation
): AgentDecision {
  // Absolute safety stop
  if (state.attempts >= 3) {
    return {
      type: "STOP",
      reason: "Maximum clarification attempts reached.",
    };
  }

  // Escalate if same bottleneck repeats with high confidence
  if (
    state.lastBottleneck === interpretation.primaryBottleneck.type &&
    state.patternConfidence > 0.75
  ) {
    return { type: "ESCALATE_PATTERN" };
  }

  // Default: allow a single clarification
  return { type: "CLARIFY_ONCE" };
}
