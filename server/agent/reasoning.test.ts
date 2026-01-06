import { describe, it, expect } from "vitest";
import { decideNextAction } from "./reasoning";
import type { AgentState } from "./state";
import type { Interpretation } from "../../shared/types/Interpretation";

/**
 * Helpers
 */

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

function baseState(overrides?: Partial<AgentState>): AgentState {
  return {
    mode: "idle",
    attempts: 0,
    patternConfidence: 0,
    ...overrides,
  };
}

/**
 * Tests
 */

describe("agent decision logic", () => {
  it("defaults to CLARIFY_ONCE on first encounter", () => {
    const state = baseState();
    const interpretation = mockInterpretation("uncertainty");

    const decision = decideNextAction(state, interpretation);

    expect(decision.type).toBe("CLARIFY_ONCE");
  });

  it("stops after maximum clarification attempts", () => {
    const state = baseState({
      attempts: 3,
    });

    const interpretation = mockInterpretation("uncertainty");

    const decision = decideNextAction(state, interpretation);

    expect(decision.type).toBe("STOP");
  });

  it("does NOT escalate on first bottleneck occurrence", () => {
    const state = baseState({
      lastBottleneck: undefined,
      patternConfidence: 0,
    });

    const interpretation = mockInterpretation("attention_fragmentation");

    const decision = decideNextAction(state, interpretation);

    expect(decision.type).toBe("CLARIFY_ONCE");
  });

  it("does NOT escalate if confidence is too low", () => {
    const state = baseState({
      lastBottleneck: "uncertainty",
      patternConfidence: 0.6,
    });

    const interpretation = mockInterpretation("uncertainty", 0.5);

    const decision = decideNextAction(state, interpretation);

    expect(decision.type).toBe("CLARIFY_ONCE");
  });

  it("escalates to pattern insight on repeated bottleneck with high confidence", () => {
    const state = baseState({
      lastBottleneck: "uncertainty",
      patternConfidence: 0.8,
    });

    const interpretation = mockInterpretation("uncertainty", 0.9);

    const decision = decideNextAction(state, interpretation);

    expect(decision.type).toBe("ESCALATE_PATTERN");
  });
});
