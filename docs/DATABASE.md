# Data Architecture — NovaOS

> Complete reference for the data model, type system, and state management.

---

## 1. Type System

All types defined in `src/types/index.ts`. Mock data in `src/data/mock.ts`.

### 1.1 Navigation

```typescript
interface NavItem {
  label: string;
  path: string;
  icon: string;
}
```

Used by `Sidebar.tsx` for 6 navigation items.

### 1.2 Dashboard

```typescript
interface KPI {
  label: string;        // "Total Revenue"
  value: string;        // "$82,450"
  change: number;       // 14 (percentage)
  changeLabel: string;  // "vs last month"
  icon: string;         // "revenue" | "orders" | "employees" | "inventory"
}

interface Activity {
  id: string;
  type: string;         // "workflow" | "analytics" | "inventory" | "order" | "invoice"
  message: string;
  timestamp: string;    // "10 min ago"
  user: string;         // "Priya Sharma"
}

interface Insight {
  icon: string;         // "trending-up" | "package" | "alert-triangle" | "bar-chart"
  text: string;
  color: string;        // "green" | "blue" | "amber" | "purple"
}

interface HealthScore {
  score: number;        // 87
  trend: "up" | "down" | "stable";
  label: string;        // "Financial Health"
  description: string;
}
```

### 1.3 Inventory

```typescript
interface Product {
  id: string;
  name: string;
  category: string;     // "Electronics" | "Furniture" | "Food & Bev" | "Office Supplies"
  stock: number;        // 23
  minStock: number;     // 30 (threshold for low-stock alert)
  price: number;        // 2499 (in INR)
  status: "in-stock" | "low-stock" | "out-of-stock";
}
```

**Status derivation:** `stock === 0 → out-of-stock`, `stock < minStock → low-stock`, else `in-stock`.

### 1.4 Workflows

```typescript
interface Workflow {
  id: string;
  type: "leave" | "expense" | "purchase" | "order";
  title: string;                // "Annual Leave — Priya Sharma"
  status: "pending" | "approved" | "rejected";
  steps: WorkflowStep[];
  createdAt: string;            // "2026-07-02"
}

interface WorkflowStep {
  label: string;                // "Manager Review"
  status: "completed" | "active" | "pending";
  timestamp?: string;           // "Jul 2, 9:30 AM"
}
```

**Workflow types and their step sequences:**

| Type | Steps |
|------|-------|
| Leave | Submitted → AI Validation → Manager Review → Approved → Notification Sent |
| Expense | Submitted → AI Validation → Finance Review → Approved → Payment Initiated |
| Purchase | Submitted → AI Validation → Manager Review → Finance Approval → PO Generated |
| Order | Order Placed → AI Verification → Inventory Check → Packing → Shipped |

**Status transitions:** Only `pending` workflows can be approved or rejected. Approval advances the active step to completed. Rejection sets workflow status to rejected.

### 1.5 Copilot

```typescript
interface ChatConversation {
  id: string;
  title: string;              // "Monthly Business Report"
  lastMessage: string;        // Preview text
  timestamp: string;          // "Today" | "Yesterday" | "2 days ago"
  isFavorite?: boolean;
}

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;            // Markdown-formatted text
  timestamp: string;          // "10:30 AM"
}

interface SuggestedPrompt {
  id: string;
  label: string;              // "Generate Monthly Report"
  icon: string;               // "file-text" | "mail" | "bar-chart" | ...
  description: string;
  responseKey: string;        // Maps to AI_RESPONSES[responseKey]
}
```

### 1.6 Quick Actions, Schedule, Tasks, Notifications

```typescript
interface QuickAction {
  id: string;
  label: string;              // "Generate Report"
  icon: string;               // "file-text" | "mail" | "check-circle" | ...
  description: string;        // "Monthly business summary"
}

interface ScheduleItem {
  id: string;
  title: string;              // "Team Standup"
  time: string;               // "9:00 AM - 9:30 AM"
}

interface TaskItem {
  id: string;
  title: string;              // "Review leave requests"
  due: string;                // "Today" | "Tomorrow"
  priority: "high" | "medium" | "low";
}

interface NotificationItem {
  id: string;
  message: string;
  time: string;               // "10 min ago"
}
```

---

## 2. Mock Data Store

All data is centralized in `src/data/mock.ts` and imported where needed.

### 2.1 Company Constants

```typescript
export const COMPANY = {
  name: "NovaTech Solutions",
  tagline: "Run Your Business. Not Your Busywork.",
  employees: 48,
  founded: "2021",
};

export const USER_NAME = "Sumith";

export const COMMAND_CENTER = {
  greeting: "Good Morning, Sumith",
  revenue: "$82,450",
  revenueChange: "+14%",
  ordersToday: 47,
  inventoryAlerts: 3,
  pendingApprovals: 2,
  aiSummary: "I've analyzed your company data...",
  recommendation: "Approve pending leave requests before noon...",
};
```

### 2.2 Dashboard Data

```typescript
export const KPI_DATA: KPI[] = [ /* 4 items */ ];
export const REVENUE_CHART_DATA = [ /* 12 months */ ];
export const ORDERS_CHART_DATA = [ /* 12 months */ ];
export const ACTIVITIES: Activity[] = [ /* 6 items */ ];
export const AI_INSIGHTS: Insight[] = [ /* 4 items */ ];
export const HEALTH_DATA: { financial: HealthScore, operational: HealthScore, employee: HealthScore };
export const SPARKLINES: { revenue: number[], orders: number[], employees: number[], inventoryValue: number[] };
export const QUICK_ACTIONS: QuickAction[] = [ /* 6 items */ ];
export const SCHEDULE: ScheduleItem[] = [ /* 3 items */ ];
export const TASKS: TaskItem[] = [ /* 3 items */ ];
export const NOTIFICATIONS_LIST: NotificationItem[] = [ /* 3 items */ ];
```

### 2.3 Chart Data Shape

```typescript
// Revenue chart (12 months)
REVENUE_CHART_DATA = [
  { month: "Jan", revenue: 38500, forecast: 36000 },
  // ...
  { month: "Dec", revenue: 82450, forecast: 74000 },
];

// Orders chart (12 months)
ORDERS_CHART_DATA = [
  { month: "Jan", orders: 28 },
  // ...
  { month: "Dec", orders: 47 },
];

// Quarterly growth
growthData = [
  { quarter: "Q1 2025", revenue: 123000, cost: 98000, profit: 25000 },
  // ...
  { quarter: "Q2 2026 (est)", revenue: 248000, cost: 132000, profit: 116000 },
];
```

### 2.4 Inventory Data

```typescript
export const PRODUCTS: Product[] = [
  // 10 products across 4 categories
  // 6 in-stock, 3 low-stock, 1 out-of-stock
];
```

### 2.5 Workflow Data

```typescript
export const WORKFLOWS: Workflow[] = [
  // 4 workflows: 1 leave (pending), 1 expense (pending), 1 purchase (pending), 1 order (active)
];
```

### 2.6 Copilot Data

```typescript
export const CHAT_HISTORY: ChatConversation[] = [ /* 6 conversations, 2 favorites */ ];
export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [ /* 6 prompts */ ];

export const AI_RESPONSES: Record<string, string> = {
  report: "## Monthly Business Report\n\n...",   // Tables, metrics, recommendations
  email: "Subject: Follow-Up...\n\nDear...",      // Professional email template
  sales: "## Sales Performance Analysis\n\n...",  // Tables, breakdowns, forecasts
  quotation: "## QUOTATION — #Q-2026-0042\n\n...", // Line items, pricing, terms
  meeting: "## Weekly Team Standup — Summary\n\n...", // Updates, action items, next meeting
  inventory: "## Inventory Restocking\n\n...",     // Table, recommendations, costs
};
```

---

## 3. Relationships

```
Company (1) ──── has ────> KPI[] (many)
Company (1) ──── has ────> Activity[] (many)
Company (1) ──── has ────> Product[] (many)
Company (1) ──── has ────> Workflow[] (many)
                    └── Workflow (1) ──── has ────> WorkflowStep[] (many)
Company (1) ──── has ────> ChatConversation[] (many)
                    └── ChatConversation (1) ──── has ────> ChatMessageItem[] (many)
```

All data is flat and synchronous (no async, no database) for the MVP. Relationships are implicit through IDs.

---

## 4. State Management Strategy

For MVP, all state is local React state (`useState`, `useCallback`) within each page. No global store.

| Page | State | Type |
|------|-------|------|
| Dashboard | None (static mock data) | Constant |
| Copilot | `messages[]`, `isTyping`, `input`, `activeConv` | useState |
| Workflow | `workflows[]`, `expandedId` | useState |
| Inventory | `search`, `category` | useState |
| Analytics | None (static mock data) | Constant |
| Settings | `activeTab` | useState |
| Theme | `theme` | useTheme hook (localStorage + class on html) |

**Post-MVP state management candidates:**
- Zustand for global app state (theme, user, notifications)
- React Query for server data (inventory, workflows)
- URL search params for list filters (inventory search, category)

---

## 5. Gemini Integration Points

The KeyManager (`src/services/key-manager.ts`) manages 6 API keys with auto-failover. Integration points for real AI:

| Feature | Current | Future |
|---------|---------|--------|
| Copilot responses | Mock `AI_RESPONSES` | `ai-sdk/google` streamText |
| Workflow AI Validation | Mock step status | Gemini content analysis |
| Inventory recommendations | Static text | Gemini inventory analysis |
| Dashboard insights | Static `AI_INSIGHTS` | Gemini business analysis |

**KeyManager API:**
```typescript
// Returns an available key, rotating on 429/403
getKey(): string | null

// Reports errors back for tracking
reportError(key: string): void

// Tracks daily usage per key (cap: 1500)
requestsToday: Map<string, number>
```
