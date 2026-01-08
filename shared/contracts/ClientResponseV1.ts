// shared/contracts/ClientResponseV1.ts

export interface ClientResponseV1 {
  success: boolean;
  artifact?: {
    content: string;
    confidence: number;
  };
  reason?: string;
}

// ⬇️ FORCE MODULE
export {};
