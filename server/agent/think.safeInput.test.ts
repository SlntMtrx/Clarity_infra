import { describe, it, expect } from "vitest";
import { think } from "./think";

describe("think SafeInput enforcement", () => {
  it("rejects invalid SafeInput", async () => {
    const result = await think({
      source: "extension",
      bottleneck: "",
      createdAt: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid SafeInput", async () => {
    const result = await think({
      source: "extension",
      bottleneck: "revisiting same task repeatedly",
      createdAt: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });
});