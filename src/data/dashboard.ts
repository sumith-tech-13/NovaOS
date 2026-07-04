import type { Insight, HealthScore, QuickAction, ScheduleItem, TaskItem } from "@/types";

export const COMMAND_CENTER = {
  greeting: "Good Morning, Sumith",
  revenue: "$82,450",
  revenueChange: "+14%",
  ordersToday: 47,
  inventoryAlerts: 3,
  pendingApprovals: 2,
  aiSummary:
    "I've analyzed your company data. Revenue is up 14% this month. Wireless Mouse inventory is running low — 23 remaining with 6 days until stockout. 2 leave requests are pending your approval. One quotation is ready for review.",
  recommendation:
    "Approve pending leave requests before noon and restock Wireless Mouse inventory today.",
};

export const HEALTH_DATA = {
  financial: { score: 87, trend: "up" as const, label: "Financial Health", description: "Strong revenue growth with healthy profit margins", path: "/analytics" },
  operational: { score: 78, trend: "up" as const, label: "Operational Health", description: "Steady 92% workflow completion rate this month", path: "/analytics" },
  employee: { score: 92, trend: "up" as const, label: "Employee Productivity", description: "High engagement with 4.8/5 avg team satisfaction", path: "/employees" },
};

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "1", label: "Generate Report", description: "Monthly business summary", icon: "file-text", path: "/copilot" },
  { id: "2", label: "Draft Email", description: "AI-assisted team communication", icon: "mail", path: "/copilot" },
  { id: "3", label: "Approve Requests", description: "2 pending approvals", icon: "check-circle", path: "/workflow" },
  { id: "4", label: "Restock Inventory", description: "3 items low in stock", icon: "package", path: "/inventory" },
  { id: "5", label: "Create Invoice", description: "Send to TechCorp India", icon: "credit-card", path: "/documents" },
  { id: "6", label: "Open AI Copilot", description: "Ask anything about your business", icon: "bot", path: "/copilot" },
];

export const SCHEDULE: ScheduleItem[] = [
  { id: "1", title: "Team Standup", time: "9:00 AM - 9:30 AM" },
  { id: "2", title: "Vendor Call", time: "11:00 AM - 11:30 AM" },
  { id: "3", title: "Review Q2 Report", time: "2:00 PM - 3:00 PM" },
];

export const TASKS: TaskItem[] = [
  { id: "1", title: "Review leave requests", due: "Today", priority: "high" },
  { id: "2", title: "Approve purchase order", due: "Today", priority: "medium" },
  { id: "3", title: "Update inventory levels", due: "Tomorrow", priority: "low" },
];

export const AI_INSIGHTS: Insight[] = [
  { icon: "trending-up", text: "Revenue is up 14% this month — highest growth in Q4.", color: "green" },
  { icon: "package", text: "Electronics category is the fastest-growing segment.", color: "blue" },
  { icon: "alert-triangle", text: "Wireless Mouse stock is predicted to run out in 6 days.", color: "amber" },
  { icon: "bar-chart", text: "Recommend increasing inventory before next weekend.", color: "purple" },
];

export const AI_SUGGESTIONS = [
  { icon: "trending-up", text: "Monthly revenue increased 14% versus last month", color: "green" },
  { icon: "alert-triangle", text: "Three inventory alerts need your attention", color: "amber" },
  { icon: "clock", text: "Two approvals pending — leave requests awaiting review", color: "blue" },
  { icon: "file-text", text: "Finance report ready for Q4 review", color: "purple" },
];
