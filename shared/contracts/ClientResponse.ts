/**
 * ClientResponse
 * --------------
 * Responses the server may send back to the client.
 * This is the ONLY client-facing output surface.
 */

export type ClientResponse =
  | ThinkSuccessResponse
  | ThinkFailureResponse;

/**
 * Successful cognition result.
 */
export interface ThinkSuccessResponse {
  type: "THINK_SUCCESS";

  /**
   * One-sentence clarity artifact.
   */
  content: string;

  /**
   * Confidence score [0–1].
   */
  confidence: number;

  /**
   * Whether this artifact may be persisted client-side.
   */
  persistable: boolean;

  /**
   * ISO timestamp.
   */
  createdAt: string;
}

/**
 * Failed or rejected request.
 */
export interface ThinkFailureResponse {
  type: "THINK_FAILURE";

  /**
   * Human-readable reason (safe, non-sensitive).
   */
  reason: string;
}
