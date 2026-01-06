import { describe, it, expect } from "vitest";
import { validateArtifact } from "./validateArtifact";

describe("validateArtifact — safety policy", () => {
  it("accepts a single declarative sentence", () => {
    const result = validateArtifact(
      "Your thinking is blocked because the criteria for completion are undefined."
    );

    expect(result.valid).toBe(true);
  });

  it("rejects multiple sentences", () => {
    const result = validateArtifact(
      "Your thinking is blocked. You are waiting for clarity."
    );

    expect(result.valid).toBe(false);
    expect(result.reasons?.join(" ")).toMatch(/one sentence|single sentence/i);

  });

  it("rejects questions", () => {
    const result = validateArtifact(
      "Are you delaying action because the criteria are unclear?"
    );

    expect(result.valid).toBe(false);
    expect(result.reasons?.join(" ")).toMatch(/question/i);
  });

  it("rejects imperative or advice-like language", () => {
    const result = validateArtifact(
      "You should define clearer criteria before proceeding."
    );

    expect(result.valid).toBe(false);
    expect(result.reasons?.join(" ")).toMatch(/advice/i);
  });

  it("rejects emotional validation", () => {
    const result = validateArtifact(
      "It's understandable to feel overwhelmed when everything is unclear."
    );

    expect(result.valid).toBe(false);
    expect(result.reasons?.join(" ")).toMatch(/emotional/i);
  });

  it("marks artifacts as persistable only when stable", () => {
    const result = validateArtifact(
      "Your attention is fragmented because multiple unresolved tasks are competing."
    );

    expect(result.valid).toBe(true);
    expect(result.persistable).toBe(true);
  });
});
