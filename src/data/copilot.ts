import type { ChatConversation, SuggestedPrompt, BusinessTemplate } from "@/types";

export const CHAT_HISTORY: ChatConversation[] = [
  { id: "1", title: "Monthly Business Report", lastMessage: "Generated June 2026 report with AI insights", timestamp: "Today", isFavorite: true },
  { id: "2", title: "Email Draft — Client Meeting", lastMessage: "Drafted follow-up email for TechCorp", timestamp: "Yesterday", isFavorite: true },
  { id: "3", title: "Inventory Analysis", lastMessage: "Identified 3 low-stock items needing reorder", timestamp: "2 days ago" },
  { id: "4", title: "Sales Performance Q2", lastMessage: "Analyzed Q2 sales with growth projections", timestamp: "3 days ago" },
  { id: "5", title: "Supplier Quotation", lastMessage: "Created quotation for office equipment", timestamp: "1 week ago" },
  { id: "6", title: "Team Meeting Notes", lastMessage: "Summarized weekly team standup meeting", timestamp: "1 week ago" },
];

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { id: "1", label: "Generate Monthly Report", icon: "file-text", description: "AI-powered business summary", responseKey: "report" },
  { id: "2", label: "Draft Client Email", icon: "mail", description: "Professional email template", responseKey: "email" },
  { id: "3", label: "Analyze Sales Performance", icon: "bar-chart", description: "Data-driven sales insights", responseKey: "sales" },
  { id: "4", label: "Create Sales Quotation", icon: "credit-card", description: "Professional quotation", responseKey: "quotation" },
  { id: "5", label: "Summarize Team Meeting", icon: "users", description: "Meeting notes and action items", responseKey: "meeting" },
  { id: "6", label: "Recommend Inventory Restocking", icon: "package", description: "Smart inventory analysis", responseKey: "inventory" },
];

export const AI_RESPONSES: Record<string, string> = {
  report: `Here's your **Monthly Business Report** for **NovaTech Solutions**.

---

## Executive Summary — June 2026

| Metric | Value | Change |
|--------|-------|--------|
| Revenue | $82,450 | +14% vs last month |
| Orders | 47 | +8.2% vs yesterday |
| Active Employees | 48 | +4 this quarter |
| Inventory Value | $182.4K | -3.1% vs last month |

### Key Highlights

1. **Revenue Growth** — Monthly revenue hit $82,450, the highest this year. The 14% increase is driven primarily by the Electronics category.
2. **Order Volume** — 47 orders today reflects steady demand. Average order value is $1,754.
3. **Inventory Alert** — Wireless Mouse Pro stock is at 23 units, below the 30-unit threshold. Predicted stockout in **6 days**.

### AI Recommendations

> 1. Approve pending leave requests before noon to avoid workflow delays.
> 2. Restock Wireless Mouse inventory today — lead time is 5 days.
> 3. Review the monthly report with your team in the morning standup.

Would you like me to generate a PDF version or dive deeper into any specific metric?`,

  email: `Here's a professional email draft for your client communication:

---

**Subject:** Follow-Up on Our Recent Discussion — Q4 Collaboration Opportunities

**To:** Client Team

Dear Team,

It was a pleasure discussing how NovaTech Solutions can support your growing business needs.

Based on our conversation, here's a summary of the key points:

- **Projected Timeline**: Implementation within 3 weeks of agreement
- **Budget Range**: $24,000 — $35,000 depending on scope
- **Deliverables**: Custom dashboard, AI Copilot integration, workflow automation

**Next Steps:**

1. Review the attached proposal document
2. Schedule a follow-up call for next Tuesday
3. Finalize scope and timeline

Please let me know if you'd like any adjustments before we proceed.

Best regards,
Sumith Kumar
NovaTech Solutions

---

Would you like me to adjust the tone, add specific details, or format it differently?`,

  sales: `## Sales Performance Analysis — Q2 2026

### Overview

| Quarter | Revenue | Orders | Avg Order Value |
|---------|---------|--------|-----------------|
| Q1 2026 | $189,400 | 112 | $1,691 |
| Q2 2026 | $213,600 | 126 | $1,695 |

### Growth Breakdown

- **Revenue Growth**: +12.8% quarter-over-quarter
- **Order Growth**: +12.5% quarter-over-quarter
- **Best Month**: June ($82,450)

### Top Performing Categories

| Category | Revenue | Growth |
|----------|---------|--------|
| Electronics | $98,450 | +18% |
| Furniture | $52,300 | +9% |
| Food & Beverage | $38,200 | +7% |
| Office Supplies | $24,650 | +5% |

### Insights

1. **Electronics** continues to drive growth, contributing 46% of total revenue.
2. **Customer acquisition cost** decreased 8% due to improved referral program.
3. **Repeat customer rate** is now 64%, up from 58% last quarter.

### Forecast

Based on current trajectory, Q3 2026 revenue is projected at **$248,000** (+16% growth).

Would you like me to break this down by region, product line, or sales representative?`,

  quotation: `Here's a professional quotation for **TechCorp India**:

---

## QUOTATION — #Q-2026-0042

**Date:** July 4, 2026
**Valid Until:** August 3, 2026
**Prepared For:** TechCorp India

| # | Item Description | Qty | Unit Price | Total |
|---|-----------------|-----|-----------|-------|
| 1 | AI Copilot License (Annual) | 1 | $12,000 | $12,000 |
| 2 | Workflow Automation Setup | 1 | $5,500 | $5,500 |
| 3 | Custom Dashboard Integration | 1 | $4,000 | $4,000 |
| 4 | Training & Onboarding | 3 days | $1,000/day | $3,000 |

| | Subtotal | $24,500 |
|---|----------|---------|
| | Discount (10%) | -$2,450 |
| | **Total** | **$22,050** |

### Payment Terms

- **Deposit**: 40% upon agreement ($8,820)
- **Milestone 1**: 30% upon completion of setup ($6,615)
- **Final**: 30% upon go-live ($6,615)

### Timeline

- **Day 1-5**: Discovery & Requirements
- **Day 6-12**: Implementation & Configuration
- **Day 13-18**: Testing & Training
- **Day 19**: Go-Live

---

Would you like me to adjust pricing, add line items, or send this directly from the system?`,

  meeting: `## Weekly Team Standup — Summary

**Date:** July 4, 2026
**Attendees:** Sumith (Manager), Priya (HR), Rahul (Finance), Amit (Operations)

---

### Key Updates

**Priya — HR**
- ✅ Processed 2 leave requests for next week
- ✅ New hire onboarding scheduled for July 15
- ⏳ Finalizing Q3 team building event

**Rahul — Finance**
- ✅ Monthly closing completed for June
- ✅ Tax filings submitted for Q2
- ⏳ Processing vendor payments for office equipment

**Amit — Operations**
- ✅ Inventory audit completed — 3 items below threshold
- ✅ Supplier negotiation completed for wireless mice
- ⏳ Restock order to be placed by EOD

### Action Items

| Task | Owner | Due |
|------|-------|-----|
| Approve leave requests | Sumith | Today |
| Place restock order | Amit | Today |
| Review Q3 budget | Rahul | Tomorrow |
| Confirm onboarding date | Priya | July 10 |

### Next Meeting

**Monday, July 11** — 9:00 AM

---

Would you like me to send this summary to the team or create action items in the workflow system?`,

  inventory: `## Inventory Restocking Recommendation

### Current Status

| Product | Stock | Min Threshold | Status |
|---------|-------|-------------|--------|
| Wireless Mouse Pro | 23 | 30 | ⚠️ Low Stock |
| USB-C Hub 7-in-1 | 0 | 25 | 🚫 Out of Stock |
| Premium Coffee Beans | 5 | 15 | ⚠️ Low Stock |
| Standing Desk Converter | 8 | 10 | ⚠️ Low Stock |

### Urgent Recommendations

1. **Wireless Mouse Pro** — Order 50 units immediately. Current stock will last **6 days**. Lead time from supplier is 5 days.
2. **USB-C Hub 7-in-1** — Order 30 units. Stockout is affecting customer orders.
3. **Premium Coffee Beans** — Order 20 units. Popular item with consistent weekly demand.
4. **Standing Desk Converter** — Order 15 units. Low stock but slower-moving item.

### Estimated Restock Cost

| Item | Qty | Unit Cost | Total |
|------|-----|-----------|-------|
| Wireless Mouse Pro | 50 | $18.50 | $925 |
| USB-C Hub 7-in-1 | 30 | $14.00 | $420 |
| Premium Coffee Beans | 20 | $9.50 | $190 |
| Standing Desk Converter | 15 | $89.00 | $1,335 |

**Estimated Total: $2,870**

### Auto-Restock Recommendation

I recommend enabling **auto-restock** for Wireless Mouse Pro and Premium Coffee Beans to prevent future stockouts.

Would you like me to create purchase orders for these items?`,
};

export const BUSINESS_TEMPLATES: BusinessTemplate[] = [
  { id: "t1", category: "reports", label: "Monthly Business Report", description: "Full revenue, orders, and growth analysis", icon: "file-text", prompt: "Generate a detailed monthly business report with revenue breakdown, order statistics, and growth analysis", color: "blue" },
  { id: "t2", category: "reports", label: "Sales Performance Analysis", description: "Deep dive into sales trends and forecasts", icon: "bar-chart", prompt: "Analyze our sales performance this quarter with category breakdowns and growth trends", color: "green" },
  { id: "t3", category: "reports", label: "Inventory Status Report", description: "Stock levels, alerts, and restock needs", icon: "package", prompt: "Generate an inventory status report showing current stock levels, low-stock alerts, and restock recommendations", color: "amber" },
  { id: "t4", category: "communications", label: "Professional Client Email", description: "Polished email for client communication", icon: "mail", prompt: "Draft a professional email to a client regarding our recent discussion about business collaboration", color: "purple" },
  { id: "t5", category: "communications", label: "Sales Quotation", description: "Detailed pricing and service quote", icon: "credit-card", prompt: "Create a professional sales quotation for TechCorp India with pricing for AI Copilot license, workflow automation setup, and training", color: "brand" },
  { id: "t6", category: "communications", label: "Meeting Summary", description: "Notes, decisions, and action items", icon: "users", prompt: "Summarize our weekly team standup meeting with key updates, decisions, and action items", color: "blue" },
  { id: "t7", category: "operations", label: "Leave Request Review", description: "Evaluate pending leave applications", icon: "check-circle", prompt: "Review pending leave requests and provide recommendations for approval based on team coverage", color: "green" },
  { id: "t8", category: "operations", label: "Purchase Order Approval", description: "Review PO details and approve", icon: "file-text", prompt: "Review the purchase order for office equipment worth ₹85,000 and provide approval recommendation", color: "amber" },
  { id: "t9", category: "operations", label: "Expense Report Audit", description: "Review and validate expenses", icon: "credit-card", prompt: "Review the travel reimbursement request for ₹12,500 and validate the expenses against company policy", color: "purple" },
];
