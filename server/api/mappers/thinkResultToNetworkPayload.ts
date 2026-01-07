import type { ThinkResult } from "../../agent/think";
import type { NetworkPayload } from "../types/NetworkPayload";

export function thinkResultToNetworkPayload(
  result: ThinkResult
): NetworkPayload {
  if (!result.success || !result.artifact) {
    return {
      success: false,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    success: true,
    message: result.artifact.content,
    confidence: result.artifact.confidence,
    createdAt: new Date().toISOString(),
  };
}
