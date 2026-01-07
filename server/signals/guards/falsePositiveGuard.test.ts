import { describe, it, expect } from "vitest";
import { shouldFireNudge } from "./falsePositiveGuard";
import { TriggerSignal } from "../types/TriggerSignal";

function createSignal(
  overrides: Partial<TriggerSignal> = {}
): TriggerSignal {
  return {
    type: "rapid_tab_switching",
    value: 15,
    durationMs: 60_000,
    detectedAt: Date.now(),
    ...overrides,
  };
}

describe("falsePositiveGuard", () => {
  it("allows the first signal to fire", () => {
    const signal = createSignal();
    const result = shouldFireNudge(signal, []);
    expect(result).toBe(true);
  });

  it("blocks nudges that happen too close together", () => {
    const now = Date.now();

    const previous = createSignal({ detectedAt: now });
    const current = createSignal({ detectedAt: now + 5_000 }); // 5s later

    const result = shouldFireNudge(current, [previous]);
    expect(result).toBe(false);
  });

  it("allows nudges after sufficient time gap", () => {
    const now = Date.now();

    const previous = createSignal({ detectedAt: now });
    const current = createSignal({ detectedAt: now + 30_000 }); // 30s later

    const result = shouldFireNudge(current, [previous]);
    expect(result).toBe(true);
  });

  it("blocks slow, deliberate research-style tab switching", () => {
    const signal = createSignal({
      durationMs: 10 * 60_000, // 10 minutes
      value: 12,              // below frantic threshold
    });

    const result = shouldFireNudge(signal, []);
    expect(result).toBe(false);
  });

  it("does not block clearly frantic behavior even if long-running", () => {
    const signal = createSignal({
      durationMs: 10 * 60_000,
      value: 30, // clearly chaotic
    });

    const result = shouldFireNudge(signal, []);
    expect(result).toBe(true);
  });
});
