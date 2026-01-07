// background.js — Clarity Infra (Phase 4 wiring)

const THINK_ENDPOINT = "http://localhost:3000/api/think";

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== "CONSENT_ACCEPTED") return;

  // Guard: must come from a tab
  if (!sender.tab || !sender.tab.id) return;

  handleConsent(sender.tab.id);
});

// Handle consent → cognition → response
async function handleConsent(tabId) {
  try {
    const response = await fetch(THINK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Minimal, abstract signal only
        bottleneck: "attention_fragmentation",
        source: "extension",
      }),
    });

    if (!response.ok) return;

    const data = await response.json();
    if (!data || !data.summary) return;

    // Send the single sentence back to the same tab
    chrome.tabs.sendMessage(tabId, {
      type: "COGNITIVE_ARTIFACT",
      summary: data.summary,
    });
  } catch {
    // Silent failure by design
  }
}
