import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useTimeline } from "@/contexts/TimelineContext";
import { GitBranch, BarChart3, Package, ShoppingCart, FileText, Sparkles, Users, File, Activity } from "lucide-react";
import type { ElementType } from "react";

const TYPE_ICONS: Record<string, ElementType> = {
  workflow: GitBranch,
  analytics: BarChart3,
  inventory: Package,
  order: ShoppingCart,
  invoice: FileText,
  employee: Users,
  document: File,
  system: Activity,
};

const TYPE_COLORS: Record<string, string> = {
  workflow: "text-blue-500 bg-blue-500/10",
  analytics: "text-purple-500 bg-purple-500/10",
  inventory: "text-amber-500 bg-amber-500/10",
  order: "text-green-500 bg-green-500/10",
  invoice: "text-brand-500 bg-brand-500/10",
  employee: "text-rose-500 bg-rose-500/10",
  document: "text-cyan-500 bg-cyan-500/10",
  system: "text-gray-500 bg-gray-500/10",
};

function getIcon(type: string): ElementType {
  return TYPE_ICONS[type] || Sparkles;
}

function getColor(type: string): string {
  return TYPE_COLORS[type] || "text-gray-500 bg-gray-500/10";
}

export function TimelineFeed() {
  const { events, markRead, markAllRead, unreadCount } = useTimeline();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Activity Timeline</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      >
        <div className="space-y-0 divide-y divide-border-light">
          {events.slice(0, 10).map((event, i) => {
            const Icon = getIcon(event.type);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "flex items-start gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer transition-colors",
                  !event.read && "rounded-lg -mx-2 px-2 bg-brand-500/[0.02]"
                )}
                onClick={() => markRead(event.id)}
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", getColor(event.type))}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-text-primary leading-snug flex-1">{event.message}</p>
                    {!event.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">{event.timestamp}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="text-xs text-text-tertiary">{event.user}</span>
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
