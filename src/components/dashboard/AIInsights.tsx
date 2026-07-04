import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { TrendingUp, Package, AlertTriangle, BarChart3, Sparkles } from "lucide-react";
import { AI_INSIGHTS } from "@/data";
import type { ElementType } from "react";

const iconMap: Record<string, ElementType> = {
  "trending-up": TrendingUp,
  package: Package,
  "alert-triangle": AlertTriangle,
  "bar-chart": BarChart3,
};

const colorMap: Record<string, string> = {
  green: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  blue: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  amber: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  purple: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
};

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-xl border border-border bg-surface p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-text-primary">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {AI_INSIGHTS.map((insight, i) => {
          const Icon = iconMap[insight.icon] || Sparkles;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", colorMap[insight.color])}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm text-text-primary leading-snug pt-1">{insight.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
