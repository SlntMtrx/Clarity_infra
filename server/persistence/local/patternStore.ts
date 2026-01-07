import type { PatternArtifact } from "../../../shared/types/PatternArtifact";

/**
 * Local in-memory store.
 * This will later be swapped for IndexedDB.
 */
let patternStore: Record<string, PatternArtifact> = {};

/**
 * Persist (or overwrite) a pattern by id.
 */
export function savePattern(pattern: PatternArtifact): void {
  patternStore[pattern.id] = pattern;
}

/**
 * Load all persisted patterns.
 */
export function loadPatterns(): Record<string, PatternArtifact> {
  return { ...patternStore };
}

/**
 * Clear all persisted patterns.
 * Used for tests and explicit user resets.
 */
export function clearPatterns(): void {
  patternStore = {};
}

/**
 * Alias for test clarity / semantic symmetry.
 */
export function clearStore(): void {
  clearPatterns();
}
