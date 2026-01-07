console.log("[validateSafeInput] loaded");

import type { SafeInput } from "../types/SafeInput";

export function validateSafeInput(input: SafeInput) {
  if (!input.createdAt) {
    return { valid: false, reason: "Missing createdAt" };
  }

  if (
    typeof input.bottleneck !== "string" ||
    input.bottleneck.trim().length === 0
  ) {
    return { valid: false, reason: "Invalid bottleneck" };
  }

  if (input.bottleneck.length > 200) {
    return { valid: false, reason: "Bottleneck too long" };
  }

  return { valid: true };
}
