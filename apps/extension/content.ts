chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "CONSENT_NUDGE") return;

  if (document.getElementById("clarity-nudge")) return;

  const container = document.createElement("div");
  container.id = "clarity-nudge";
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #111;
    color: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: system-ui;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    z-index: 999999;
  `;

  container.innerHTML = `
    <div style="margin-bottom: 8px;">
      Noise detected. Want 60 seconds of clarity?
    </div>
    <div style="display: flex; gap: 8px;">
      <button id="clarity-yes">Yes</button>
      <button id="clarity-no">No</button>
    </div>
  `;

 const yesBtn = container.querySelector(
  "#clarity-yes"
) as HTMLButtonElement | null;

const noBtn = container.querySelector(
  "#clarity-no"
) as HTMLButtonElement | null;

if (!yesBtn || !noBtn) return;


  yesBtn.onclick = () => {
    chrome.runtime.sendMessage({
      type: "CONSENT_ACCEPTED",
      payload: message.payload,
    });
    container.remove();
  };

  noBtn.onclick = () => {
    container.remove();
  };

  document.body.appendChild(container);
});
