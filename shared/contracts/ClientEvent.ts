/**
 * ClientEvent
 * -----------
 * Events that the client is allowed to send to the server.
 * This is a HARD CONTRACT.
 */

export type ClientEvent =
  | ThinkRequestEvent;

/**
 * Request cognition after explicit consent.
 */
export interface ThinkRequestEvent {
  type: "THINK_REQUEST";

  /**
   * Privacy-safe, irreversible bottleneck description.
   */
  bottleneck: string;

  /**
   * ISO timestamp generated client-side.
   */
  createdAt: string;
}
