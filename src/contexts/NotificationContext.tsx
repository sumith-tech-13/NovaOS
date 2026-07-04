import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { NotificationItem } from "@/types";
import { NOTIFICATIONS_LIST } from "@/data";
import { useTimeline } from "./TimelineContext";

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let notifCounter = 100;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_LIST);
  const { events } = useTimeline();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0];
      const isRecent = latest.timestamp === "just now" || latest.timestamp.startsWith("1");
      if (isRecent && !notifications.some((n) => n.message === latest.message)) {
        const typeMap: Record<string, NotificationItem["type"]> = {
          workflow: "approval",
          inventory: "alert",
          order: "update",
          analytics: "update",
          document: "update",
          system: "system",
          employee: "reminder",
        };
        const newNotif: NotificationItem = {
          id: `n${++notifCounter}`,
          type: typeMap[latest.type] || "system",
          title: latest.type.charAt(0).toUpperCase() + latest.type.slice(1),
          message: latest.message,
          time: "just now",
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    }
  }, [events, notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
