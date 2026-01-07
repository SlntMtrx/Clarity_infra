/**
 * NetworkPayload
 * --------------
 * The ONLY shape allowed to leave the server boundary.
 */

export interface NetworkPayload {
  success: boolean;
  message?: string;
  confidence?: number;
  createdAt: string;
}

/**
 * Force module boundary.
 * Required because interfaces are erased at runtime.
 */
export {};
