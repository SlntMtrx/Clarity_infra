import { TriggerSignal } from "../types/TriggerSignal";

export function signalToInput(signal: TriggerSignal): string {
  switch (signal.type) {
    case "rapid_tab_switching":
      return "I'm switching tabs rapidly and my attention feels fragmented.";

    case "repeated_open_close":
      return "I keep opening and closing things without making progress.";

    case "focus_loss":
      return "I lost focus and feel mentally scattered.";

    case "idle_resume":
      return "I'm returning after being idle and feel unclear.";

    default:
      return "My attention feels disrupted.";
  }
}
    