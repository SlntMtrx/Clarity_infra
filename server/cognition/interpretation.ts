/**
 * interpretation
 * --------------
 * Translates raw cognitive noise into a structured Interpretation.
 *
 * This module:
 * - infers cognitive bottlenecks
 * - surfaces tensions
 * - estimates fragmentation
 *
 * IMPORTANT:
 * - No advice
 * - No output phrasing
 * - No user-facing language
 */

import type {
  Interpretation,
  CognitiveBottleneck,
  CognitiveBottleneckType,
  CognitiveTension,
} from "../../shared/types/Interpretation";

/**
 * Entry point for interpretation.
 */
export function interpretInput(inputText: string): Interpretation {
  const bottlenecks = inferBottlenecks(inputText);
  const tensions = inferTensions(inputText);
  const fragmentationLevel = estimateFragmentation(inputText);

  return {
    primaryBottleneck: bottlenecks[0],
    secondaryBottlenecks: bottlenecks.slice(1),
    tensions: tensions.length > 0 ? tensions : undefined,
    fragmentationLevel,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Infer likely cognitive bottlenecks from the input text.
 *
 * NOTE:
 * This is intentionally heuristic-based for v1.
 * Precision comes later via agent state.
 */
function inferBottlenecks(input: string): CognitiveBottleneck[] {
  const normalized = input.toLowerCase();

  const candidates: CognitiveBottleneck[] = [];

  if (containsAny(normalized, ["not sure", "unclear", "don't know", "confused"])) {
    candidates.push(makeBottleneck("uncertainty", "Lack of clarity about the situation or next step.", 0.7));
  }

  if (containsAny(normalized, ["too many", "overwhelming", "everything", "spread thin"])) {
    candidates.push(makeBottleneck("attention_fragmentation", "Attention is split across too many competing threads.", 0.65));
  }

  if (containsAny(normalized, ["waiting", "stalling", "putting off", "later"])) {
    candidates.push(makeBottleneck("avoidance", "Action is being delayed due to unresolved ambiguity.", 0.6));
  }

  if (containsAny(normalized, ["optimize", "perfect", "best possible"])) {
    candidates.push(makeBottleneck("premature_optimization", "Trying to optimize before constraints are defined.", 0.55));
  }

  if (candidates.length === 0) {
    candidates.push(makeBottleneck("underconstraint", "The problem space lacks sufficient structure.", 0.5));
  }

  return sortByConfidence(candidates);
}

/**
 * Infer tensions between competing thoughts or goals.
 */
function inferTensions(input: string): CognitiveTension[] {
  const tensions: CognitiveTension[] = [];

  const sentences = splitSentences(input);

  if (sentences.length >= 2) {
    tensions.push({
      left: sentences[0],
      right: sentences[1],
    });
  }

  return tensions;
}

/**
 * Estimate how fragmented the user's thinking is.
 *
 * Returns a value in range [0, 1].
 */
function estimateFragmentation(input: string): number {
  const lengthFactor = Math.min(input.length / 500, 1);
  const sentenceCount = splitSentences(input).length;

  const sentenceFactor = Math.min(sentenceCount / 6, 1);

  return roundToTwoDecimals((lengthFactor + sentenceFactor) / 2);
}

/**
 * Helpers
 */

function makeBottleneck(
  type: CognitiveBottleneckType,
  description: string,
  confidence: number
): CognitiveBottleneck {
  return { type, description, confidence };
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sortByConfidence<T extends { confidence: number }>(items: T[]): T[] {
  return items.sort((a, b) => b.confidence - a.confidence);
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
