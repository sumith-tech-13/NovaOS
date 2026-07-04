import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import type { ChatMessageItem } from "@/types";

interface ChatMessageProps {
  message: ChatMessageItem;
  index: number;
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-3 rounded-lg border border-border bg-surface-secondary overflow-hidden">
      {language && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="text-[11px] text-text-tertiary font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success-500" />
                <span className="text-success-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className="p-3 overflow-x-auto">
        <code className="text-sm font-mono text-text-primary leading-relaxed whitespace-pre-wrap">{children}</code>
      </div>
    </div>
  );
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn("flex items-start gap-3 px-6", isUser ? "" : "")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
          isUser
            ? "bg-brand-600"
            : "bg-gradient-to-br from-brand-500 to-brand-700",
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-primary">
            {isUser ? "You" : "NovaOS Copilot"}
          </span>
          <span className="text-[11px] text-text-tertiary">{message.timestamp}</span>
        </div>

        <div
          className={cn(
            "text-sm leading-relaxed",
            isUser
              ? "text-text-primary"
              : "prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-surface-secondary [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs [&_blockquote]:border-l-2 [&_blockquote]:border-brand-500 [&_blockquote]:pl-3 [&_blockquote]:text-text-secondary [&_blockquote]:italic [&_hr]:border-border [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-text-primary [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-3 [&_h3]:mb-1.5 [&_p]:text-text-primary [&_p]:mb-1 [&_strong]:text-text-primary [&_code]:text-[13px] [&_code]:font-mono",
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-surface-tertiary px-1.5 py-0.5 text-sm font-mono text-text-primary"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{String(children)}</CodeBlock>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
