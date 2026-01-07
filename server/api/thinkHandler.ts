// server/api/thinkHandler.ts
// --------------------------------------
// HTTP boundary for agent cognition.
// This file MUST NOT contain cognition logic.
// It only validates, routes, and serializes.
//

import type { Request, Response } from "express";

import { think } from "../agent/think";
import { thinkResultToNetworkPayload } from "./mappers/thinkResultToNetworkPayload";

import type { SafeInput } from "../privacy/types/SafeInput";

export async function thinkHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const body = req.body;

    /**
     * 1. Strict SafeInput validation
     * Nothing unsafe crosses this boundary.
     */
    if (
      !body ||
      (body.source !== "extension" && body.source !== "api") ||
      typeof body.bottleneck !== "string" ||
      typeof body.createdAt !== "string"
    ) {
      res.status(400).end();
      return;
    }

    const safeInput: SafeInput = {
      source: body.source,
      bottleneck: body.bottleneck,
      createdAt: body.createdAt,
    };

    /**
     * 2. Execute cognition
     */
    const result = await think(safeInput);

    /**
     * 3. Map to network-safe payload
     * This is the ONLY thing allowed to leave the server.
     */
    const payload = thinkResultToNetworkPayload(result);

    /**
     * 4. Respond
     */
    res.status(200).json(payload);
  } catch {
    /**
     * Silent failure by design.
     * No stack traces. No leakage.
     */
    res.status(204).end();
  }
}
