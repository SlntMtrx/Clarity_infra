// shared/contracts/ClientEventV1.ts

import type { ClientContractVersion } from "./ClientContractVersion";

export interface ClientEventV1 {
  contractVersion: ClientContractVersion;
  source: "extension" | "api";
  bottleneck: string;
  createdAt: string;
}

// ⬇️ FORCE MODULE
export {};
