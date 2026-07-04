import { motion } from "framer-motion";
import { Send, Paperclip, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/common/Button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, onClear, disabled }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border bg-surface p-4"
    >
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot anything..."
            rows={1}
            className="w-full min-h-[42px] max-h-32 rounded-lg border border-border bg-surface-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none resize-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            style={{ height: "auto" }}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <Button
            size="md"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="h-9 w-9 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={onClear}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-[11px] text-text-tertiary mt-2 text-center">
        NovaOS Copilot uses business data to generate responses. Press <kbd className="rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px] font-mono">Enter</kbd> to send, <kbd className="rounded border border-border bg-surface-secondary px-1 py-0.5 text-[10px] font-mono">Shift + Enter</kbd> for new line
      </p>
    </motion.div>
  );
}
