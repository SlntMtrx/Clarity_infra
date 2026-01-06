/**
 * blockAdvice
 * -----------
 * Secondary safety layer to detect subtle or implied advice
 * that may bypass simple keyword checks.
 *
 * This module is intentionally conservative.
 * False positives are acceptable. False negatives are not.
 */

const ADVICE_VERB_PATTERNS = [
  "define",
  "clarify",
  "focus on",
  "prioritize",
  "start by",
  "stop",
  "avoid",
  "do",
  "try",
  "consider",
  "decide",
  "commit",
  "list",
];

const IMPERATIVE_PATTERNS = [
  /^you\s+(should|need|must|can|have to)\b/,
  /^try\s+/,
  /^consider\s+/,
  /^focus\s+/,
  /^start\s+/,
];


/**
 * Returns true if the artifact contains
 * subtle advice or directive language.
 */
export function blocksAdvice(text: string): boolean {
  const normalized = text.trim().toLowerCase();

  // Hard stop on imperatives
  if (IMPERATIVE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // Look for embedded directive verbs
  return ADVICE_VERB_PATTERNS.some((verb) =>
    normalized.includes(` ${verb} `)
  );
}
