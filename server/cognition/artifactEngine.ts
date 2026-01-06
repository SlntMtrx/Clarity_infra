/**
 * artifactEngine
 * --------------
 * Orchestrates the conversion of an Interpretation
 * into a Cognitive Artifact via the LLM.
 *
 * Responsibilities:
 * - prepare directives for compression
 * - invoke the LLM
 * - shape raw output into an ArtifactResponse
 *
 * IMPORTANT:
 * - No safety validation here
 * - No retries here
 * - No persistence here
 */

import type { Interpretation } from "../../shared/types/Interpretation";
import type {
  ArtifactResponse,
  CognitiveArtifact,
  ArtifactType,
} from "../../shared/types/Artifact";

import { invokeLLM } from "./invokeLLM";

/**
 * Entry point for artifact generation.
 */
export async function generateArtifact(
  inputText: string,
  interpretation: Interpretation
): Promise<ArtifactResponse> {
  const directives = buildSystemDirectives(interpretation);

  const llmResult = await invokeLLM({
    inputText,
    interpretation,
    systemDirectives: directives,
  });

  const artifact: CognitiveArtifact = {
    content: llmResult.artifactText.trim(),
    type: inferArtifactType(interpretation),
    confidence: llmResult.modelConfidence ?? interpretation.primaryBottleneck.confidence,
    persistable: isPersistable(interpretation),
    createdAt: new Date().toISOString(),
  };

  return {
    artifact,
  };
}

/**
 * Build additional system-level directives for the LLM
 * based on interpretation context.
 */
function buildSystemDirectives(interpretation: Interpretation): string[] {
  const directives: string[] = [];

  if (interpretation.fragmentationLevel > 0.7) {
    directives.push(
      "Prioritize clarity over completeness. Compress aggressively."
    );
  }

  if (interpretation.primaryBottleneck.type === "uncertainty") {
    directives.push(
      "Surface the missing constraint or definition."
    );
  }

  if (interpretation.primaryBottleneck.type === "attention_fragmentation") {
    directives.push(
      "Name the single dominant thread causing overload."
    );
  }

  return directives;
}

/**
 * Infer artifact category based on interpretation.
 */
function inferArtifactType(interpretation: Interpretation): ArtifactType {
  switch (interpretation.primaryBottleneck.type) {
    case "uncertainty":
      return "clarification";
    case "attention_fragmentation":
      return "decision_fog_reduction";
    case "premature_optimization":
      return "constraint_exposure";
    case "avoidance":
      return "assumption_surface";
    default:
      return "reframe";
  }
}

/**
 * Decide whether this artifact should influence long-term memory.
 *
 * Rule:
 * - Situational overload should not persist
 * - Structural patterns may
 */
function isPersistable(interpretation: Interpretation): boolean {
  return interpretation.primaryBottleneck.confidence > 0.6;
}
