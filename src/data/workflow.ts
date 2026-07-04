import type { Workflow } from "@/types";

export const WORKFLOWS: Workflow[] = [
  {
    id: "1",
    type: "leave",
    title: "Annual Leave — Priya Sharma",
    status: "pending",
    createdAt: "2026-07-02",
    steps: [
      { label: "Submitted", status: "completed", timestamp: "Jul 2, 9:30 AM" },
      { label: "AI Validation", status: "completed", timestamp: "Jul 2, 9:31 AM" },
      { label: "Manager Review", status: "active" },
      { label: "Approved", status: "pending" },
      { label: "Notification Sent", status: "pending" },
    ],
  },
  {
    id: "2",
    type: "expense",
    title: "Travel Reimbursement — ₹12,500",
    status: "pending",
    createdAt: "2026-07-01",
    steps: [
      { label: "Submitted", status: "completed", timestamp: "Jul 1, 2:15 PM" },
      { label: "AI Validation", status: "active" },
      { label: "Finance Review", status: "pending" },
      { label: "Approved", status: "pending" },
      { label: "Payment Initiated", status: "pending" },
    ],
  },
  {
    id: "3",
    type: "purchase",
    title: "Office Equipment — ₹85,000",
    status: "pending",
    createdAt: "2026-06-30",
    steps: [
      { label: "Submitted", status: "completed", timestamp: "Jun 30, 11:00 AM" },
      { label: "AI Validation", status: "completed", timestamp: "Jun 30, 11:01 AM" },
      { label: "Manager Review", status: "completed", timestamp: "Jun 30, 3:30 PM" },
      { label: "Finance Approval", status: "active" },
      { label: "PO Generated", status: "pending" },
    ],
  },
  {
    id: "4",
    type: "order",
    title: "Customer Order #1042 — TechCorp",
    status: "active",
    createdAt: "2026-07-03",
    steps: [
      { label: "Order Placed", status: "completed", timestamp: "Jul 3, 10:00 AM" },
      { label: "AI Verification", status: "completed", timestamp: "Jul 3, 10:01 AM" },
      { label: "Inventory Check", status: "active" },
      { label: "Packing", status: "pending" },
      { label: "Shipped", status: "pending" },
    ],
  },
];
