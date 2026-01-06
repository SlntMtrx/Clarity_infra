import type { PatternArtifact } from "../../shared/types/PatternArtifact";

export interface AgentRuntimeState {
  mode: "IDLE" | "ACTIVE" | "ESCALATED";
  attempts: number;
  lastBottleneck?: string;
  patternConfidence: number;
  patterns: Record<string, PatternArtifact>;
  lastUpdated: string;
}

export const INITIAL_AGENT_STATE: AgentRuntimeState = {
  mode: "IDLE",
  attempts: 0,
  patternConfidence: 0,
  patterns: {},
  lastUpdated: new Date().toISOString(),
};
