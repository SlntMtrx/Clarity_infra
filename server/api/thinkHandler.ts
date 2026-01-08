// server/api/thinkHandler.ts
// --------------------------------------
// HTTP boundary for agent cognition.
// Validates client contract → maps to SafeInput → executes cognition
//

import type { Request, Response } from "express";

import { think } from "../agent/think";
import { thinkResultToNetworkPayload } from "./mappers/thinkResultToNetworkPayload";

import {
  CLIENT_CONTRACT_VERSION,
  type ClientEventV1,
} from "@shared/contracts";


import type { SafeInput } from "../privacy/types/SafeInput";

export async function thinkHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const body = req.body as ClientEventV1;

    /**
     * 1. Enforce client contract (V1)
     */
    if (
      !body ||
      body.contractVersion !== CLIENT_CONTRACT_VERSION ||
      (body.source !== "extension" && body.source !== "api") ||
      typeof body.bottleneck !== "string" ||
      typeof body.createdAt !== "string"
    ) {
      res.status(400).end();
      return;
    }

    /**
     * 2. Map ClientEvent → SafeInput
     * HARD privacy boundary
     */
    const safeInput: SafeInput = {
      source: body.source,
      bottleneck: body.bottleneck,
      createdAt: body.createdAt,
    };

    /**
     * 3. Execute cognition
     */
    const result = await think(safeInput);

    /**
     * 4. Serialize to network payload
     */
    const payload = thinkResultToNetworkPayload(result);

    /**
     * 5. Respond
     */
    res.status(200).json(payload);
  } catch {
    /**
     * Silent failure by design
     */
    res.status(204).end();
  }
}
