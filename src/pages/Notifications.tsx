import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCheck, Trash2, CheckCircle, AlertTriangle, Info, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import type { ElementType } from "react";

const TYPE_ICONS: Record<string, ElementType> = {
  approval: CheckCircle,
  alert: AlertTriangle,
  update: Info,
  reminder: Clock,
  system: AlertCircle,
};

const TYPE_COLORS: Record<string, string> = {
  approval: "text-green-500 bg-green-500/10",
  alert: "text-red-500 bg-red-500/10",
  update: "text-blue-500 bg-blue-500/10",
  reminder: "text-amber-500 bg-amber-500/10",
  system: "text-gray-500 bg-gray-500/10",
};

const TYPE_LABELS: Record<string, string> = {
  approval: "Approvals",
  alert: "Alerts",
  update: "Updates",
  reminder: "Reminders",
  system: "System",
};

const FILTERS = ["all", "approval", "alert", "update", "reminder", "system"] as const;

export function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-1.5" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f
                ? "bg-brand-500 text-white"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
            )}
          >
            {f === "all" ? "All" : TYPE_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-text-tertiary">
            <CheckCircle className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const Icon = TYPE_ICONS[notif.type] || Info;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm",
                  notif.read
                    ? "border-border bg-surface"
                    : "border-brand-500/20 bg-brand-500/[0.02]"
                )}
                onClick={() => markRead(notif.id)}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TYPE_COLORS[notif.type])}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={cn("text-sm", notif.read ? "text-text-secondary" : "text-text-primary font-medium")}>
                        {notif.title && <span className="font-semibold">{notif.title}</span>}
                        {notif.title && " — "}
                        {notif.message}
                      </p>
                      <span className="text-xs text-text-tertiary mt-1 block">{notif.time}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={notif.type === "alert" ? "danger" : notif.type === "approval" ? "success" : "secondary"} size="sm">
                        {TYPE_LABELS[notif.type]}
                      </Badge>
                      {!notif.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
