// content.js — Clarity Infra (Phase 4 complete flow)

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CONSENT_NUDGE") {
    showConsentToast();
  }

  if (message.type === "COGNITIVE_ARTIFACT") {
    showArtifact(message.summary);
  }
});

let toastEl = null;

/* -----------------------------
   Consent Toast
------------------------------ */
function showConsentToast() {
  if (document.getElementById("clarity-toast")) return;

  const toast = document.createElement("div");
  toast.id = "clarity-toast";
  toastEl = toast;

  // Position (top-right, peripheral)
  toast.style.position = "fixed";
  toast.style.top = "72px";
  toast.style.right = "24px";
  toast.style.maxWidth = "360px";
  toast.style.zIndex = "2147483647";

  // Visual design
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.padding = "18px 22px";
  toast.style.borderRadius = "12px";
  toast.style.fontFamily = "system-ui, -apple-system, sans-serif";
  toast.style.fontSize = "15.5px";
  toast.style.lineHeight = "1.45";
  toast.style.boxShadow = "0 12px 32px rgba(0,0,0,0.45)";

  // Motion
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";
  toast.style.transition = "opacity 250ms ease, transform 250ms ease";

  toast.innerHTML = `
    <div style="margin-bottom: 14px;">
      Noise detected. Want 60 seconds of clarity?
    </div>

    <div style="display: flex; gap: 10px;">
      <button id="clarity-yes" style="
        background: #2563eb;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      ">Yes</button>

      <button id="clarity-no" style="
        background: #2a2a2a;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
      ">No</button>
    </div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  document.getElementById("clarity-yes").onclick = () => {
    toast.innerHTML = `
      <div style="opacity:0.85;">
        Thinking…
      </div>
    `;

    chrome.runtime.sendMessage({ type: "CONSENT_ACCEPTED" });
  };

  document.getElementById("clarity-no").onclick = () => {
    dismissToast();
  };
}

/* -----------------------------
   Artifact Display
------------------------------ */
function showArtifact(summary) {
  if (!toastEl) return;

  toastEl.innerHTML = `
    <div>
      ${summary}
    </div>
  `;

  // Auto-dismiss after reflection window
  setTimeout(() => {
    dismissToast();
  }, 7000);
}

/* -----------------------------
   Cleanup
------------------------------ */
function dismissToast() {
  if (!toastEl) return;

  toastEl.style.opacity = "0";
  toastEl.style.transform = "translateY(-10px)";

  setTimeout(() => {
    toastEl?.remove();
    toastEl = null;
  }, 250);
}
