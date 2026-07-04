import { motion } from "framer-motion";
import { Sparkles, Bot, ArrowRight, FileText, Mail, BarChart3, CreditCard, Users, Package } from "lucide-react";
import { cn } from "@/utils/cn";
import { SUGGESTED_PROMPTS } from "@/data";

const iconMap: Record<string, React.ElementType> = {
  "file-text": FileText,
  mail: Mail,
  "bar-chart": BarChart3,
  "credit-card": CreditCard,
  users: Users,
  package: Package,
};

interface WelcomeStateProps {
  onPromptClick: (promptId: string, label: string) => void;
}

export function WelcomeState({ onPromptClick }: WelcomeStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
            <Bot className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-text-primary">BusinessOS AI Copilot</h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          Your intelligent business assistant for reports, emails, quotations, analytics, and operational insights.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl"
      >
        {SUGGESTED_PROMPTS.map((prompt, i) => {
          const Icon = iconMap[prompt.icon] || Sparkles;
          return (
            <motion.button
              key={prompt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptClick(prompt.responseKey, prompt.label)}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-sm hover:border-border-hover hover:shadow-md transition-all duration-200"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-text-primary">{prompt.label}</span>
                <p className="text-xs text-text-secondary mt-0.5">{prompt.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary shrink-0" />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
