import type { NotificationItem } from "@/types";

export const NOTIFICATIONS_LIST: NotificationItem[] = [
  { id: "n1", type: "approval", title: "Leave Request", message: "Jessica Brown submitted a leave request (Jul 10-14)", time: "5 min ago", read: false, actionPath: "/employees" },
  { id: "n2", type: "alert", title: "Low Stock Alert", message: "Wireless Mouse stock dropped to 23 units", time: "15 min ago", read: false, actionPath: "/inventory" },
  { id: "n3", type: "update", title: "New Order", message: "Order #ORD-2025-0891 received ($3,240)", time: "32 min ago", read: false, actionPath: "/analytics" },
  { id: "n4", type: "reminder", title: "Report Ready", message: "Q2 revenue report is ready for review", time: "1 hour ago", read: false, actionPath: "/documents" },
  { id: "n5", type: "approval", title: "Expense Report", message: "David Miller submitted an expense claim ($450)", time: "2 hours ago", read: true, actionPath: "/workflow" },
  { id: "n6", type: "system", title: "Backup Complete", message: "Daily system backup completed successfully", time: "5 hours ago", read: true },
  { id: "n7", type: "update", title: "Invoice Sent", message: "Invoice #INV-2025-0042 sent to Acme Corp", time: "4 hours ago", read: true, actionPath: "/documents" },
  { id: "n8", type: "alert", title: "Performance Alert", message: "Server response time increased by 12%", time: "6 hours ago", read: true },
];
