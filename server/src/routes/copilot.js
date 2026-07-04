import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { keyManager } from "../services/keyManager.js";

const router = Router();

const SYSTEM_PROMPT = `You are a business operations assistant. Your only job is to parse a user's natural language request for a purchase order into a clean JSON object.

Read the user's text and extract three fields:
- "itemName": the name of the item or product being requested
- "quantity": the number of units needed (must be a number, not a string)
- "reason": a short explanation of why this purchase is needed

Rules:
1. Return ONLY a valid JSON object with exactly those three keys.
2. Do NOT include markdown, code fences, backticks, or any text before or after the JSON.
3. If the quantity is implied (e.g. "a few", "some"), default to 1.
4. If the item name is ambiguous, use the most specific name you can infer.
5. Keep the reason concise — one sentence is enough.

Valid response example:
{"itemName": "Wireless Mouse Pro", "quantity": 50, "reason": "Current stock of 23 is below the 30-unit threshold and predicted to run out in 6 days."}

Invalid response (do NOT do this):
\`\`\`json
{"itemName": "Wireless Mouse Pro", "quantity": 50, "reason": "Stock is low"}
\`\`\`

Return ONLY the raw JSON object.`;

router.post("/parse-request", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      error: "Missing or invalid 'text' field in request body",
    });
  }

  const keyResult = keyManager.pickKey();
  if (!keyResult) {
    return res.status(503).json({
      error: "No API keys available. All keys have reached their daily limit or are in cooldown.",
    });
  }

  const { key, index } = keyResult;

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser request: "${text.trim()}"` }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 200,
      },
    });

    const responseText = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error(`Failed to parse Gemini response as JSON. Raw: ${responseText}`);
        }
      } else {
        throw new Error(`No JSON object found in Gemini response. Raw: ${responseText}`);
      }
    }

    if (
      typeof parsed.itemName !== "string" ||
      (typeof parsed.quantity !== "number" && typeof parsed.quantity !== "string") ||
      typeof parsed.reason !== "string"
    ) {
      throw new Error(
        `Response missing required fields. Got: ${JSON.stringify(parsed)}`
      );
    }

    parsed.quantity = Number(parsed.quantity);

    return res.status(200).json({
      itemName: parsed.itemName,
      quantity: isNaN(parsed.quantity) ? 1 : Math.max(1, Math.round(parsed.quantity)),
      reason: parsed.reason,
    });
  } catch (err) {
    const errorMsg = err.message || String(err);

    if (
      errorMsg.includes("429") ||
      errorMsg.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.includes("rate") ||
      errorMsg.includes("Too Many Requests")
    ) {
      keyManager.markFailed(index, "429");
    } else if (
      errorMsg.includes("403") ||
      errorMsg.includes("daily") ||
      errorMsg.includes("quota")
    ) {
      keyManager.markFailed(index, "403");
    }

    console.error(`[Copilot] Gemini API error (key ${index}):`, errorMsg);

    return res.status(502).json({
      error: "Failed to process request with AI",
      detail: errorMsg,
    });
  }
});

router.get("/keys/status", (_req, res) => {
  return res.status(200).json(keyManager.getStatus());
});

export default router;
