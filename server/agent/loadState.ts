import { interpretInput } from "../cognition/interpretation";
import { generateArtifact } from "../cognition/artifactEngine";
import { validateArtifact } from "../safety/validateArtifact";

import { decideNextAction } from "../agent/reasoning";
import { updateAgentState } from "../agent/updateState";
import { INITIAL_AGENT_STATE } from "../agent/state";

export async function think(inputText: string) {
  let state = INITIAL_AGENT_STATE;

  const interpretation = interpretInput(inputText);

  const decision = decideNextAction(state, interpretation);

  if (decision.type === "STOP") {
    return {
      success: false,
      reason: decision.reason,
    };
  }

  if (decision.type === "ESCALATE_PATTERN") {
    return {
      success: true,
      artifact: {
        content:
          "This blockage keeps recurring because the same unresolved constraint remains unaddressed.",
        type: "pattern_insight",
        confidence: 0.9,
        persistable: true,
        createdAt: new Date().toISOString(),
      },
    };
  }

  // CLARIFY_ONCE
  const artifactResponse = await generateArtifact(
    inputText,
    interpretation
  );

  const validation = validateArtifact(artifactResponse.artifact.content);

  if (!validation.valid) {
    return {
      success: false,
      reason: "Unsafe artifact generated.",
    };
  }

  state = updateAgentState(state, interpretation);

  return {
    success: true,
    artifact: artifactResponse.artifact,
  };
}
