import { describe, it, expect } from "vitest";
import { decideNextAction } from "./reasoning";
import type { AgentRuntimeState } from "./state";
import type { Interpretation } from "../../shared/types/Interpretation";

function mockInterpretation(
  bottleneckType: string,
  confidence = 0.8
): Interpretation {
  return {
    fragmentationLevel: 0.6,
    primaryBottleneck: {
      type: bottleneckType as any,
      description: "Test bottleneck",
      confidence,
    },
    createdAt: new Date().toISOString(),
  };
}

function baseState(
  overrides?: Partial<AgentRuntimeState>
): AgentRuntimeState {
  return {
    mode: "IDLE",
    attempts: 0,
    patternConfidence: 0,
    patterns: {},
    lastBottleneck: undefined,
    lastUpdated: new Date().toISOString(),
    ...overrides,
  };
}

describe("agent decision logic", () => {
  it("defaults to CLARIFY_ONCE on first encounter", () => {
    const decision = decideNextAction(
      baseState(),
      mockInterpretation("uncertainty")
    );
    expect(decision.type).toBe("CLARIFY_ONCE");
  });

  it("stops after maximum clarification attempts", () => {
    const decision = decideNextAction(
      baseState({ attempts: 3 }),
      mockInterpretation("uncertainty")
    );
    expect(decision.type).toBe("STOP");
  });

  it("escalates on repeated bottleneck with high confidence", () => {
    const decision = decideNextAction(
      baseState({
        lastBottleneck: "uncertainty",
        patternConfidence: 0.8,
      }),
      mockInterpretation("uncertainty", 0.9)
    );
    expect(decision.type).toBe("ESCALATE_PATTERN");
  });
});
