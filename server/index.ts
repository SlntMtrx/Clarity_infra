import express from "express";
import bodyParser from "body-parser";

import { clarify } from "./api/clarify";
import { thinkHandler } from "./api/thinkHandler";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

/**
 * Existing clarify endpoint (UNCHANGED)
 */
app.post("/clarify", async (req, res) => {
  try {
    const result = await clarify({
      inputText: req.body?.inputText,
    });

    res.json(result);
  } catch {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * Phase 4 cognition endpoint (NEW)
 */
app.post("/api/think", thinkHandler);

app.listen(PORT, () => {
  console.log(`Clarity server running on http://localhost:${PORT}`);
}
);
