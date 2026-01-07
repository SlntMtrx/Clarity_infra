// shared/types/AgentState.ts

/**
 * AgentState
 * ----------
 * Long-lived cognitive control state.
 * This is NOT user-visible.
 */

export interface AgentState {
  version: number;

  mode: "IDLE" | "ACTIVE" | "ESCALATED";

  attempts: number;

  lastBottleneck?: string;

  patternConfidence: number;

  cognitivePatterns: string[];

  triggerModel: {
    sensitivity: number;
  };

  questionStrategy: {
    enabled: boolean;
  };

  lastUpdated: string;
}
