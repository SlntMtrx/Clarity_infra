export type TriggerSignalType =
  | "rapid_tab_switching"
  | "repeated_open_close"
  | "focus_loss"
  | "idle_resume";

export interface TriggerSignal {
  type: TriggerSignalType;
  value: number;
  durationMs: number;
  context?: string;
  detectedAt: number; // epoch ms
}
