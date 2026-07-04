import type { Activity, TimelineEvent } from "@/types";

export const ACTIVITIES: Activity[] = [
  { id: "1", type: "workflow", message: "Leave request submitted by Priya Sharma — Annual Leave (Jul 10-14)", timestamp: "10 min ago", user: "Priya Sharma" },
  { id: "2", type: "analytics", message: "Monthly revenue report generated — 14% growth this month", timestamp: "25 min ago", user: "AI Copilot" },
  { id: "3", type: "inventory", message: "Wireless Mouse Pro stock updated — 23 remaining (below threshold)", timestamp: "1 hour ago", user: "System" },
  { id: "4", type: "workflow", message: "Purchase order #PO-2024-089 approved — Office Equipment ($85,000)", timestamp: "2 hours ago", user: "Rahul Verma" },
  { id: "5", type: "order", message: "Customer quotation created — TechCorp India ($24,500)", timestamp: "3 hours ago", user: "Sales Team" },
  { id: "6", type: "analytics", message: "AI recommendation generated — Restock wireless mouse inventory", timestamp: "4 hours ago", user: "AI Copilot" },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", type: "workflow", message: "Approved leave request for Jessica Brown (Jul 10-14)", timestamp: "2 min ago", user: "You", read: false },
  { id: "t2", type: "inventory", message: "Wireless Mouse stock dropped to 23 units — reorder recommended", timestamp: "15 min ago", user: "System", read: false },
  { id: "t3", type: "order", message: "New order #ORD-2025-0891 received ($3,240)", timestamp: "32 min ago", user: "System", read: false },
  { id: "t4", type: "analytics", message: "Q2 revenue report generated — $82,450 (+14% QoQ)", timestamp: "1 hour ago", user: "Priya Patel", read: true },
  { id: "t5", type: "employee", message: "David Miller submitted a personal leave request for Jul 5", timestamp: "2 hours ago", user: "David Miller", read: true },
  { id: "t6", type: "document", message: "Q3 Marketing Campaign Brief published by James Wilson", timestamp: "3 hours ago", user: "James Wilson", read: true },
  { id: "t7", type: "invoice", message: "Invoice #INV-2025-0042 sent to Acme Corp ($12,611.13)", timestamp: "4 hours ago", user: "Robert Kim", read: true },
  { id: "t8", type: "system", message: "Daily backup completed successfully", timestamp: "5 hours ago", user: "System", read: true },
  { id: "t9", type: "workflow", message: "Purchase order #PO-2025-0034 approved by Maria Garcia", timestamp: "6 hours ago", user: "Maria Garcia", read: true },
  { id: "t10", type: "inventory", message: "New shipment received: 200x Wireless Keyboards, 150x USB Hubs", timestamp: "7 hours ago", user: "System", read: true },
  { id: "t11", type: "analytics", message: "Monthly sales forecast updated: $95K projected for July", timestamp: "8 hours ago", user: "Maria Garcia", read: true },
  { id: "t12", type: "employee", message: "Sarah Chen marked 95% performance score for Q2 review", timestamp: "10 hours ago", user: "Sarah Chen", read: true },
  { id: "t13", type: "document", message: "Enterprise License Agreement signed with Acme Corp", timestamp: "1 day ago", user: "Robert Kim", read: true },
  { id: "t14", type: "workflow", message: "Expense report #EXP-2025-012 approved ($1,250)", timestamp: "1 day ago", user: "You", read: true },
  { id: "t15", type: "order", message: "47 orders processed today — highest daily volume this quarter", timestamp: "1 day ago", user: "System", read: true },
];
