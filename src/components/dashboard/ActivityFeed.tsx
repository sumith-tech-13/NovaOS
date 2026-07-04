import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ACTIVITIES } from "@/data";
import { GitBranch, BarChart3, Package, ShoppingCart, FileText, Sparkles } from "lucide-react";
import type { ElementType } from "react";

const typeIcons: Record<string, ElementType> = {
  workflow: GitBranch,
  analytics: BarChart3,
  inventory: Package,
  order: ShoppingCart,
  invoice: FileText,
};

function getIcon(type: string): ElementType {
  return typeIcons[type] || Sparkles;
}

const typeColors: Record<string, string> = {
  workflow: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  analytics: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  inventory: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  order: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  invoice: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10",
};

function getColor(type: string): string {
  return typeColors[type] || "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
}

export function ActivityFeed() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h3>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      >
        <div className="space-y-0 divide-y divide-border-light">
          {ACTIVITIES.map((activity, i) => {
            const Icon = getIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", getColor(activity.type))}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary leading-snug">{activity.message}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">{activity.timestamp}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="text-xs text-text-tertiary">{activity.user}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
