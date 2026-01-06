/**
 * invokeLLM
 * ---------
 * This module is the ONLY place where we directly interact with an LLM.
 *
 * Design goals:
 * - Deterministic shape
 * - Bounded output
 * - No autonomy
 * - No retries without validation
 * - No silent failures
 */

import type { Interpretation } from "../../shared/types/Interpretation";
import type { CognitiveArtifact } from "../../shared/types/Artifact";

/**
 * Input required to invoke the LLM.
 * This is deliberately minimal.
 */
export interface InvokeLLMInput {
  /**
   * Raw user-provided cognitive noise.
   */
  inputText: string;

  /**
   * System-level interpretation guiding compression.
   */
  interpretation: Interpretation;

  /**
   * Optional system prompt additions (from agent reasoning).
   */
  systemDirectives?: string[];
}

/**
 * Output returned from the LLM invocation.
 * This is NOT yet trusted.
 */
export interface InvokeLLMOutput {
  /**
   * Candidate artifact content produced by the model.
   */
  artifactText: string;

  /**
   * Raw model confidence signal, if provided.
   */
  modelConfidence?: number;
}

/**
 * Invokes the language model to perform cognitive compression.
 *
 * NOTE:
 * - This function does NOT validate safety.
 * - This function does NOT enforce one-sentence rules.
 * - That happens downstream in the safety layer.
 */
export async function invokeLLM(
  input: InvokeLLMInput
): Promise<InvokeLLMOutput> {
  const {
    inputText,
    interpretation,
    systemDirectives = [],
  } = input;

  /**
   * Construct the system prompt.
   * This is intentionally rigid.
   */
  const systemPrompt = `
You are a cognitive compression engine.

Your task:
- Produce exactly ONE declarative sentence.
- Clarify the user's thinking bottleneck.
- Do NOT give advice.
- Do NOT suggest actions.
- Do NOT provide emotional validation.
- Do NOT ask questions.

The output must:
- Be neutral in tone.
- Be concise.
- Reflect the core cognitive bottleneck.

Cognitive bottleneck:
${interpretation.primaryBottleneck.description}

Fragmentation level:
${interpretation.fragmentationLevel}

Additional directives:
${systemDirectives.join("\n")}

Respond with ONLY the sentence.
`.trim();

  /**
   * User prompt contains only the raw cognitive noise.
   */
  const userPrompt = `
User input:
${inputText}
`.trim();

  /**
   * Call the LLM provider.
   * Replace this section with your actual provider SDK.
   */
  const response = await invokeProvider({
    systemPrompt,
    userPrompt,
  });

  /**
   * We return raw output only.
   * No validation, no transformation.
   */
  return {
    artifactText: response.text,
    modelConfidence: response.confidence,
  };
}

/**
 * Placeholder LLM call.
 *
 * IMPORTANT:
 * This is intentionally isolated so the rest of the system
 * does not depend on any specific provider.
 *
 * Replace this with OpenAI, Anthropic, local model, etc.
 */
/**
 * NOTE:
 * This implementation is used during early development
 * to allow deterministic testing of cognition and safety layers.
 *
 * Replace ONLY after:
 * - interpretation logic is complete
 * - artifact validation is enforced
 * - safety rejection paths exist
 */

async function invokeProvider(params: {
  systemPrompt: string;
  userPrompt: string;
}): Promise<{ text: string; confidence?: number }> {
  // Simulated delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    text: "You are delaying action because the criteria for a good outcome are still undefined.",
    confidence: 0.72,
  };
}
