import type { AgentState } from "./state";
import type { Interpretation } from "../../shared/types/Interpretation";

export function updateAgentState(
  state: AgentState,
  interpretation: Interpretation
): AgentState {
  const sameBottleneck =
    state.lastBottleneck === interpretation.primaryBottleneck.type;

  return {
    ...state,
    attempts: state.attempts + 1,
    mode: "clarifying",
    lastBottleneck: interpretation.primaryBottleneck.type,
    patternConfidence: sameBottleneck
      ? Math.min(state.patternConfidence + 0.2, 1)
      : 0.3,
  };
}
