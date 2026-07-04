import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/common/Button";

const TEMPLATES = [
  { label: "Business Report", prompt: "Generate a quarterly business performance report" },
  { label: "Internal Policy", prompt: "Draft an employee policy document for" },
  { label: "Meeting Minutes", prompt: "Create meeting minutes for" },
  { label: "Project Proposal", prompt: "Write a project proposal for" },
];

export function DocumentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setResult(`# Generated Document\n\nBased on your request: *"${prompt}"*\n\nThis is a preview of the AI-generated document content. In production, this would be processed by the Gemini API to produce a fully formatted document with appropriate structure and content.\n\n## Key Points\n\n- Document type identified and formatted\n- Content structured with proper headings\n- Professional formatting applied\n\n*The full AI generation pipeline will be connected in the next update.*`);
      setGenerating(false);
    }, 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-500" />
        <h3 className="text-sm font-semibold text-text-primary">AI Document Generator</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            onClick={() => setPrompt(t.prompt + "...")}
            className="rounded-lg border border-border bg-surface-secondary px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Describe the document you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
          className="h-9 flex-1 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-500 focus:outline-none"
        />
        <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} size="sm">
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg border border-border bg-surface-secondary p-3 text-sm text-text-secondary"
        >
          <pre className="whitespace-pre-wrap font-sans">{result}</pre>
        </motion.div>
      )}
    </div>
  );
}
