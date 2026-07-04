import { motion } from "framer-motion";
import { Calendar, CheckSquare, Bell, Sparkles, TrendingUp, Package, AlertTriangle, BarChart3 } from "lucide-react";
import { cn } from "@/utils/cn";
import { SCHEDULE, TASKS, NOTIFICATIONS_LIST, AI_INSIGHTS } from "@/data";

const priorityColors = {
  high: "text-danger-500",
  medium: "text-warning-500",
  low: "text-text-tertiary",
};

const priorityDots = {
  high: "bg-danger-500",
  medium: "bg-warning-500",
  low: "bg-text-tertiary",
};

export function RightSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-brand-600" />
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Today's Schedule</span>
        </div>
        <div className="space-y-3">
          {SCHEDULE.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-2 w-2 rounded-full bg-brand-500 mt-1.5" />
                <div className="w-px h-6 bg-border last:hidden" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="h-4 w-4 text-brand-600" />
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Upcoming Tasks</span>
        </div>
        <div className="space-y-2">
          {TASKS.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-lg bg-surface-secondary p-2.5">
              <div className={cn("h-2 w-2 shrink-0 rounded-full", priorityDots[task.priority])} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary truncate">{task.title}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{task.due}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Notifications</span>
          </div>
        </div>
        <div className="space-y-2">
          {NOTIFICATIONS_LIST.slice(0, 5).map((n) => {
            const Icon = n.type === "alert" ? AlertTriangle : n.type === "approval" ? CheckSquare : Sparkles;
            const iconColor = n.type === "alert" ? "text-amber-500" : n.type === "approval" ? "text-green-500" : "text-brand-500";
            return (
              <div key={n.id} className={cn("flex items-start gap-2.5 py-2 first:pt-0 last:pb-0 border-b border-border last:border-0", !n.read && "opacity-100", n.read && "opacity-60")}>
                <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", iconColor)} />
                <div>
                  <p className="text-xs text-text-primary leading-snug">{n.message}</p>
                  <span className="text-[10px] text-text-tertiary mt-0.5 block">{n.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-brand-500/20 bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">AI Insights</span>
        </div>
        <div className="space-y-2">
          {AI_INSIGHTS.map((insight, i) => {
            const Icon = insight.icon === "trending-up" ? TrendingUp : insight.icon === "package" ? Package : insight.icon === "alert-triangle" ? AlertTriangle : BarChart3;
            const dotColor = insight.color === "green" ? "bg-green-500" : insight.color === "blue" ? "bg-blue-500" : insight.color === "amber" ? "bg-amber-500" : "bg-purple-500";
            return (
              <div key={i} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
                <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", dotColor)} />
                <p className="text-xs text-text-secondary leading-relaxed">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
