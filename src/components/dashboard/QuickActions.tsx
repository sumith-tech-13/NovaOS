import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Bot, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { QUICK_ACTIONS } from "@/data";

const iconMap: Record<string, React.ElementType> = {
  "file-text": FileText,
  "check-circle": FileText,
  mail: Bot,
  package: FileText,
  "credit-card": FileText,
  bot: Bot,
};

const colorMap: Record<string, string> = {
  "file-text": "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  mail: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  "check-circle": "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  package: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  "credit-card": "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10",
  bot: "text-brand-600 bg-gradient-to-br from-brand-500/10 to-brand-600/10",
};

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = iconMap[action.icon] || Bot;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => action.path && navigate(action.path)}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left shadow-sm hover:border-border-hover hover:shadow-md transition-all duration-200"
            >
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", colorMap[action.icon])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-text-primary">{action.label}</span>
                <p className="text-xs text-text-secondary mt-0.5">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
