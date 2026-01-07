import { recordTabSwitch } from "../../server/signals/detectors/tabSwitchDetector";
import { aggregateSignals } from "../../server/signals/aggregator/signalAggregator";
import { shouldFireNudge } from "../../server/signals/guards/falsePositiveGuard";
import { createConsentNudge } from "../../server/api/signalThinkBridge";

let signalBuffer: any[] = [];

chrome.tabs.onActivated.addListener(() => {
  const signal = recordTabSwitch();
  if (!signal) return;

  signalBuffer.push(signal);

  const aggregated = aggregateSignals(signalBuffer);
  if (!aggregated) return;

  const shouldFire = shouldFireNudge(aggregated, signalBuffer);
  if (!shouldFire) return;

  const nudge = createConsentNudge(aggregated);

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabs[0]?.id) return;

    chrome.tabs.sendMessage(tabs[0].id, {
      type: "CONSENT_NUDGE",
      payload: nudge,
    });
  });

  // Reset buffer after firing
  signalBuffer = [];
});
