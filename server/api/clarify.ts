/**
 * clarify API
 * -----------
 * Public entrypoint for a single cognitive clarification pass.
 *
 * Flow:
 * 1. Accept raw cognitive noise
 * 2. Interpret the input
 * 3. Generate artifact candidates
 * 4. Enforce safety + limits
 * 5. Return a validated artifact or fail safely
 *
 * IMPORTANT:
 * - No persistence here
 * - No retries without limits
 * - No user-facing errors leaking internals
 */

import type { ArtifactResponse } from "../../shared/types/Artifact";

import { interpretInput } from "../cognition/interpretation";
import { generateArtifact } from "../cognition/artifactEngine";

import { validateArtifact } from "../safety/validateArtifact";

import { LimitEnforcer } from "../safety/enforceLimits";

/**
 * Shape of incoming request.
 */
export interface ClarifyRequest {
  inputText: string;
}

/**
 * Shape of outgoing response.
 */
export interface ClarifyResponse {
  success: boolean;
  result?: ArtifactResponse;
  error?: string;
}

/**
 * Main clarify handler.
 * This can later be wrapped by HTTP, edge, or RPC layers.
 */
export async function clarify(
  request: ClarifyRequest
): Promise<ClarifyResponse> {
  const { inputText } = request;

  if (!inputText || inputText.trim().length === 0) {
    return {
      success: false,
      error: "Input text is required.",
    };
  }

  const limits = new LimitEnforcer();

  try {
    const interpretation = interpretInput(inputText);

    while (limits.canContinue()) {
      limits.registerAttempt();

      const artifactResponse = await generateArtifact(
        inputText,
        interpretation
      );

      const artifact = artifactResponse.artifact;

      // Hard safety checks
            const validation = validateArtifact(artifact.content);

      if (!validation.valid) {
        console.log("⛔ Artifact rejected by validator");
        console.log("↳ Content:", artifact.content);
        console.log("↳ Reasons:", validation.reasons);
        continue;
      }

      


      // Artifact passed all checks
      return {
        success: true,
        result: artifactResponse,
      };
    }

    // If all attempts failed
    return {
      success: false,
      error: "Unable to generate a safe cognitive artifact.",
    };
  } catch (error) {
    // Fail safely without leaking internals
    return {
      success: false,
      error: "Cognitive clarification failed.",
    };
  }
}
