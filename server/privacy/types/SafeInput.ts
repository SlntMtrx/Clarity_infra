/**
 * SafeInput
 * ---------
 * Privacy-hardened input that is allowed to cross
 * into cognition and reasoning.
 *
 * This type is a HARD BOUNDARY.
 * Nothing upstream of this should contain:
 * - URLs
 * - Page titles
 * - Raw text
 * - User identifiers
 * - Domain data
 */

export interface SafeInput {
  /**
   * Source of the input.
   * Used only for routing and policy.
   */
  source: "extension" | "api";

  /**
   * Compressed, abstracted bottleneck description.
   * Example:
   *  - "frequent task switching without completion"
   *  - "returning to same question repeatedly"
   *
   * MUST be irreversible.
   */
  bottleneck: string;

  /**
   * Timestamp when this abstraction was created.
   * ISO string.
   */
  createdAt: string;
}
