import type { AgentRuntimeState } from "./state";
import type { Interpretation } from "../../shared/types/Interpretation";

export function updateAgentState(
  state: AgentRuntimeState,
  interpretation: Interpretation
): AgentRuntimeState {
  return {
    ...state,
    attempts: state.attempts + 1,
    lastBottleneck: interpretation.primaryBottleneck.type,
    patternConfidence: Math.max(
      state.patternConfidence,
      interpretation.primaryBottleneck.confidence
    ),
    lastUpdated: new Date().toISOString(),
  };
}
