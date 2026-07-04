import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { TimelineEvent } from "@/types";
import { TIMELINE_EVENTS } from "@/data";

interface TimelineContextValue {
  events: TimelineEvent[];
  unreadCount: number;
  addEvent: (event: Omit<TimelineEvent, "id" | "read" | "timestamp">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

const EVENT_TEMPLATES = [
  { type: "workflow" as const, messages: ["Leave request approved", "Expense report filed", "Purchase order processed"] },
  { type: "analytics" as const, messages: ["Report generated", "Forecast updated", "KPI milestone reached"] },
  { type: "inventory" as const, messages: ["Stock level alert", "Shipment received", "Reorder triggered"] },
  { type: "order" as const, messages: ["New order placed", "Order fulfilled", "Order cancelled"] },
  { type: "system" as const, messages: ["Backup completed", "System health check passed", "Update installed"] },
];

const USERS = ["System", "You", "Sarah Chen", "Priya Patel", "David Miller", "James Wilson"];

let eventCounter = 100;

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);

  const unreadCount = events.filter((e) => !e.read).length;

  const addEvent = useCallback((partial: Omit<TimelineEvent, "id" | "read" | "timestamp">) => {
    const newEvent: TimelineEvent = {
      ...partial,
      id: `t${++eventCounter}`,
      timestamp: "just now",
      read: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const markRead = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  }, []);

  const markAllRead = useCallback(() => {
    setEvents((prev) => prev.map((e) => ({ ...e, read: true })));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const message = template.messages[Math.floor(Math.random() * template.messages.length)];
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      addEvent({ type: template.type, message, user });
    }, 30000);
    return () => clearInterval(interval);
  }, [addEvent]);

  return (
    <TimelineContext.Provider value={{ events, unreadCount, addEvent, markRead, markAllRead }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used within TimelineProvider");
  return ctx;
}
