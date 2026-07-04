import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Plus, MessageSquare, Star, Sparkles, TrendingUp, AlertTriangle, Clock, FileText,
  Bot, LayoutTemplate,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/common/Button";
import { CHAT_HISTORY, AI_SUGGESTIONS, USER_NAME } from "@/data";
import { sendMessage } from "@/services/copilotService";
import { WelcomeState } from "@/components/copilot/WelcomeState";
import { ChatMessage as ChatMessageComponent } from "@/components/copilot/ChatMessage";
import { ChatInput } from "@/components/copilot/ChatInput";
import { TypingIndicator } from "@/components/copilot/TypingIndicator";
import { BusinessTemplates } from "@/components/copilot/BusinessTemplates";
import type { ChatMessageItem } from "@/types";

const suggestionIcons: Record<string, React.ElementType> = {
  "trending-up": TrendingUp,
  "alert-triangle": AlertTriangle,
  clock: Clock,
  "file-text": FileText,
};

const suggestionColors: Record<string, string> = {
  green: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  amber: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  blue: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  purple: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
};

function generateTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function Copilot() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightTab, setRightTab] = useState<"suggestions" | "templates">("suggestions");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const msg: ChatMessageItem = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: generateTimestamp(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleAIResponse = useCallback(
    async (userText: string) => {
      setIsTyping(true);
      const response = await sendMessage(userText, messages);
      addMessage("assistant", response);
      setIsTyping(false);
    },
    [addMessage, messages],
  );

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    addMessage("user", text);
    setInput("");
    handleAIResponse(text);
  }, [input, isTyping, addMessage, handleAIResponse]);

  const handlePromptClick = useCallback(
    (responseKey: string, label: string) => {
      addMessage("user", label);
      handleAIResponse(label);
      if (!activeConv) setActiveConv("new");
    },
    [addMessage, handleAIResponse, activeConv],
  );

  const handleTemplateSelect = useCallback(
    (prompt: string) => {
      addMessage("user", prompt);
      handleAIResponse(prompt);
      if (!activeConv) setActiveConv("new");
    },
    [addMessage, handleAIResponse, activeConv],
  );

  useEffect(() => {
    const pendingPrompt = localStorage.getItem("copilot_prompt");
    if (pendingPrompt) {
      localStorage.removeItem("copilot_prompt");
      addMessage("user", pendingPrompt);
      handleAIResponse(pendingPrompt);
      if (!activeConv) setActiveConv("new");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    setActiveConv(null);
  }, []);

  return (
    <div className="flex h-[calc(100vh-5rem)] -mx-6 -mb-6">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "border-r border-border bg-surface flex flex-col shrink-0 min-h-0",
          sidebarOpen ? "min-w-0" : "w-0",
        )}
      >
        <div className="p-3 border-b border-border">
          <Button className="w-full" size="sm" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-1">
              Chat History
            </span>
          </div>
          <div className="space-y-1">
            {CHAT_HISTORY.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                className={cn(
                  "w-full text-left rounded-lg p-2.5 transition-colors",
                  activeConv === conv.id
                    ? "bg-surface-tertiary"
                    : "hover:bg-surface-secondary",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-text-primary truncate flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3 text-text-tertiary shrink-0" />
                    {conv.title}
                  </span>
                  {conv.isFavorite && (
                    <Star className="h-3 w-3 text-amber-500 shrink-0 fill-amber-500" />
                  )}
                </div>
                <p className="text-[11px] text-text-tertiary mt-1 line-clamp-1">{conv.lastMessage}</p>
                <span className="text-[10px] text-text-tertiary mt-1 block">{conv.timestamp}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-1">
            Recent Prompts
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Generate Report", "Draft Email", "Analyze Sales"].map((label) => (
              <button
                key={label}
                onClick={() => handlePromptClick(
                  label === "Generate Report" ? "report" : label === "Draft Email" ? "email" : "sales",
                  label,
                )}
                className="rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-[11px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0 flex flex-col bg-surface-secondary min-h-0">
        {messages.length === 0 && !isTyping ? (
          <div className="flex-1 overflow-y-auto min-h-0">
            <WelcomeState onPromptClick={handlePromptClick} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-6 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <ChatMessageComponent key={msg.id} message={msg} index={i} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onClear={handleClear}
          disabled={isTyping}
        />
      </div>

      <aside className="w-72 shrink-0 border-l border-border bg-surface hidden xl:flex flex-col min-h-0">
        <div className="p-3 border-b border-border">
          <div className="flex gap-1">
            <button
              onClick={() => setRightTab("suggestions")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                rightTab === "suggestions"
                  ? "bg-surface-tertiary text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Suggestions
            </button>
            <button
              onClick={() => setRightTab("templates")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                rightTab === "templates"
                  ? "bg-surface-tertiary text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary",
              )}
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              Templates
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {rightTab === "suggestions" ? (
            <div className="space-y-2">
              {AI_SUGGESTIONS.map((suggestion, i) => {
                const Icon = suggestionIcons[suggestion.icon] || Sparkles;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-secondary p-2.5"
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                        suggestionColors[suggestion.color] || suggestionColors.blue,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs text-text-primary leading-snug">{suggestion.text}</p>
                  </motion.div>
                );
              })}
              <div className="pt-2">
                <div className="rounded-lg border border-brand-500/20 bg-surface p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3 w-3 text-brand-400" />
                    <span className="text-[11px] font-medium text-brand-400">Tip</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    Switch to the Templates tab for pre-built business document templates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <BusinessTemplates onSelectTemplate={handleTemplateSelect} />
          )}
        </div>
      </aside>
    </div>
  );
}
