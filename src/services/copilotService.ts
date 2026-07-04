import type { ChatMessageItem } from "@/types";
import { AI_RESPONSES } from "@/data";

const API_URL = "/api/copilot-chat";
const TIMEOUT_MS = 15000;

const KEYWORD_MAP: [RegExp, string][] = [
  [/report|monthly|quarterly|business summary|performance/i, "report"],
  [/email|draft|write.*client|compose/i, "email"],
  [/sales|revenue|performance|analysis|growth/i, "sales"],
  [/quotation|quote|proposal|pricing|estimate/i, "quotation"],
  [/meeting|standup|minutes|summary.*team|agenda/i, "meeting"],
  [/inventory|stock|restock|warehouse|supply/i, "inventory"],
];

const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|sup|yo)\b/i,
  /^(good morning|good evening|good afternoon|good day)\b/i,
  /^(what'?s up|how are you|how'?s it going|how do you do)\b/i,
];

const QUESTION_PATTERNS = [
  /what (can|should|do) (i|we|you)/i,
  /how (can|should|do) (i|we)/i,
  /help|guide|suggest|recommend/i,
];

function getSmartFallback(message: string): string {
  for (const [pattern, key] of KEYWORD_MAP) {
    if (pattern.test(message)) {
      return AI_RESPONSES[key];
    }
  }

  if (GREETING_PATTERNS.some((p) => p.test(message))) {
    return `👋 Welcome to NovaOS Copilot!

I'm your AI business assistant. Here's what I can help you with:

1. **Generate Reports** — Monthly summaries, business performance, revenue analysis
2. **Draft Communications** — Professional emails, quotations, proposals
3. **Analyze Data** — Sales trends, inventory levels, growth metrics
4. **Team Operations** — Meeting summaries, workflow approvals, leave management

**Quick stats for today:**
- Revenue is at **$82,450** (+14% this month)
- **3 inventory items** need restock attention
- **2 approvals** are pending your review

What would you like me to do? Just type it out!`;
  }

  if (QUESTION_PATTERNS.some((p) => p.test(message))) {
    return `Here's how I can help you run your business:

**Try asking me:**
- *"Generate a monthly report"* — Full business report with revenue, orders, and AI recommendations
- *"Draft an email to a client"* — Professional email ready to send
- *"Analyze sales performance"* — Deep sales analysis with growth breakdowns
- *"Check inventory levels"* — Stock status with restock recommendations
- *"Summarize the team meeting"* — Meeting notes with action items
- *"Create a quotation for TechCorp"* — Professional quotation with pricing

Just type what you need in plain English and I'll take care of it!`;
  }

  return `I understand you're asking about something related to your business. To help you best, could you try one of these:

- *"Generate a monthly report"*
- *"Draft an email to a client"*
- *"Analyze sales performance"*
- *"Check inventory levels"*

Or just tell me what you need in your own words and I'll do my best to help!`;
}

export async function sendMessage(
  message: string,
  history: ChatMessageItem[]
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const chatHistory = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    clearTimeout(timeout);
    console.warn("[CopilotService] Backend unavailable, using fallback:", err);
    return getSmartFallback(message);
  }
}
