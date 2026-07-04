import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, ChevronRight, Eye, AlertCircle, Info, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useNotifications } from "@/contexts/NotificationContext";
import type { NotificationItem } from "@/types";

const TYPE_ICONS: Record<string, typeof Bell> = {
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

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const recent = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-surface shadow-xl z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-text-tertiary">
                  <Bell className="h-8 w-8 mb-2 opacity-40" />
                  <span className="text-xs">No notifications</span>
                </div>
              ) : (
                recent.map((notif) => {
                  const Icon = TYPE_ICONS[notif.type] || Info;
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-secondary",
                        !notif.read && "bg-brand-500/[0.02]"
                      )}
                      onClick={() => {
                        markRead(notif.id);
                        if (notif.actionPath) navigate(notif.actionPath);
                        setOpen(false);
                      }}
                    >
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TYPE_COLORS[notif.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p className={cn("text-sm leading-snug flex-1", notif.read ? "text-text-secondary" : "text-text-primary font-medium")}>
                            {notif.title && <span className="font-medium">{notif.title} — </span>}
                            {notif.message}
                          </p>
                          {!notif.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                        </div>
                        <span className="text-xs text-text-tertiary mt-0.5 block">{notif.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-border p-2">
              <button
                onClick={() => { navigate("/notifications"); setOpen(false); }}
                className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary transition-colors"
              >
                View all notifications
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
