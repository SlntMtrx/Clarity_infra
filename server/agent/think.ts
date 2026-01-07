import { interpretInput } from "../cognition/interpretation";
import { generateArtifact } from "../cognition/artifactEngine";
import { validateArtifact } from "../safety/validateArtifact";
import { validateSafeInput } from "../privacy/guards/validateSafeInput";

import { decideNextAction } from "./reasoning";
import { updateAgentState } from "./updateState";
import { createPatternArtifact } from "./patternFactory";
import { decayPatterns } from "./patternDecay";

import {
  INITIAL_AGENT_STATE,
  type AgentRuntimeState,
} from "./state";

import type { CognitiveArtifact } from "../../shared/types/Artifact";
import type { PatternArtifact } from "../../shared/types/PatternArtifact";
import type { SafeInput } from "../privacy/types/SafeInput";

export interface ThinkResult {
  success: boolean;
  artifact?: CognitiveArtifact;
  reason?: string;
}

export async function think(input: SafeInput): Promise<ThinkResult> {
  let state: AgentRuntimeState = { ...INITIAL_AGENT_STATE };

  // 🔒 HARD PRIVACY BOUNDARY (THIS WAS MISSING)
  const validation = validateSafeInput(input);
  if (!validation.valid) {
    return {
      success: false,
      reason: validation.reason,
    };
  }

  const interpretation = interpretInput(input.bottleneck);

  state.patterns = decayPatterns(state.patterns);

  const decision = decideNextAction(state, interpretation);

  if (decision.type === "STOP") {
    return { success: false, reason: decision.reason };
  }

  if (decision.type === "ESCALATE_PATTERN") {
    const key = interpretation.primaryBottleneck.type;

    const existing: PatternArtifact | undefined =
      state.patterns[key];

    const pattern = createPatternArtifact(
      interpretation,
      existing
    );

    state.patterns[key] = pattern;

    const artifact: CognitiveArtifact = {
      content: pattern.summary,
      type: "reframe",
      confidence: pattern.confidence,
      persistable: true,
      createdAt: new Date().toISOString(),
    };

    return { success: true, artifact };
  }

  const response = await generateArtifact(
    input.bottleneck,
    interpretation
  );

  const artifact = response.artifact;

  if (!validateArtifact(artifact.content).valid) {
    return { success: false, reason: "Unsafe artifact" };
  }

  state = updateAgentState(state, interpretation);

  return { success: true, artifact };
}
