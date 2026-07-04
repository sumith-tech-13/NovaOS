import { GoogleGenerativeAI } from "@google/generative-ai";
import { keyManager } from "./_key-manager.js";

const MODEL = "gemini-1.0-pro";

const SYSTEM_PROMPT = `You are NovaAI, the intelligent business assistant for NovaOS — a business operating system for SMEs.

Your role: Help business owners and managers with their daily operations. You can:
- Generate business reports and summaries
- Draft professional emails and quotations
- Analyze sales, revenue, and inventory data
- Answer questions about business operations
- Provide recommendations and insights

Rules:
1. Be concise but informative. Use markdown formatting (bold, tables, lists, blockquotes).
2. When referencing data, use realistic SME metrics (revenue, orders, stock levels, etc.).
3. Always be professional, helpful, and action-oriented.
4. If you don't know something specific, provide a reasonable example based on common SME patterns.
5. Format tables with | pipes | for readability.
6. Use > blockquotes for recommendations or important notes.
7. Keep responses under 500 words unless generating a full report.
8. End with a question or next-step suggestion to keep the conversation flowing.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'message' field" });
  }

  const keyResult = keyManager.pickKey();
  if (!keyResult) {
    return res.status(503).json({ error: "No API keys available" });
  }

  const { key, index } = keyResult;
  const contents = [];

  if (history && Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role === "user" || msg.role === "assistant") {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser message: "${message.trim()}"` }],
  });

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
    });

    const responseText = result.response.text().trim();
    return res.status(200).json({ response: responseText });
  } catch (err) {
    const errorMsg = err.message || String(err);
    if (
      errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.includes("rate") || errorMsg.includes("Too Many Requests")
    ) {
      keyManager.markFailed(index, "429");
    } else if (
      errorMsg.includes("403") || errorMsg.includes("daily") || errorMsg.includes("quota")
    ) {
      keyManager.markFailed(index, "403");
    }
    return res.status(502).json({ error: "Failed to process chat message", detail: errorMsg });
  }
}
