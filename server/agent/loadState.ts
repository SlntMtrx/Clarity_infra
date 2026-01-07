import type { AgentRuntimeState } from "./state";

export function loadInitialState(): AgentRuntimeState {
  return {
    mode: "IDLE",
    attempts: 0,
    patternConfidence: 0,
    patterns: {},
    lastBottleneck: undefined,
    lastUpdated: new Date().toISOString(),
  };
}
