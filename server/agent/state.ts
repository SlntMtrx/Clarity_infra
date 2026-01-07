// server/agent/state.ts

import type { PatternArtifact } from "../../shared/types/PatternArtifact";

/**
 * Runtime-only agent state.
 * Never persisted directly.
 */
export type AgentRuntimeState = {
  mode: "IDLE" | "ACTIVE" | "ESCALATED";
  attempts: number;
  lastBottleneck?: string;
  patternConfidence: number;
  patterns: Record<string, PatternArtifact>;
  lastUpdated: string;
};

/**
 * Immutable baseline state.
 * MUST NOT be mutated.
 */
export const INITIAL_AGENT_STATE: AgentRuntimeState = {
  mode: "IDLE",
  attempts: 0,
  lastBottleneck: undefined,
  patternConfidence: 0,
  patterns: {},
  lastUpdated: new Date().toISOString(),
};

/**
 * Factory for fresh runtime state.
 * This is the ONLY correct way to initialize agent state.
 */
export function createInitialAgentState(): AgentRuntimeState {
  return {
    ...INITIAL_AGENT_STATE,
    lastUpdated: new Date().toISOString(),
  };
}
