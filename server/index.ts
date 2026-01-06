import express from "express";
import bodyParser from "body-parser";

import { clarify } from "./api/clarify";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`Clarity server running on http://localhost:${PORT}`);
});
app.get("/", (_req, res) => {
  res.send("Clarity Infrastructure is running.");
});

