# BusinessOS AI — NovaOS

> An AI-powered Business Operating System for SMEs.
> "Run Your Business. Not Your Busywork."

---

## Vision

A premium, production-like AI operating system for small and medium enterprises. NovaOS replaces disjointed business tools (HR, inventory, finance, reporting) with a single intelligent workspace powered by AI. Designed for a 3-day hackathon MVP — polished enough to demo, architected to extend.

---

## Design Philosophy

Premium. Minimal. Enterprise. Calm. AI-first.

**Visual references:**
- Linear (clean typography, spacing, motion)
- OpenAI ChatGPT (AI chat experience)
- Stripe Dashboard (data density, cards, metrics)
- Notion (sidebar navigation, content hierarchy)
- Vercel (premium dark theme, gradients, polish)

**Design principles:**
- Everything has breathing room (generous padding, 8px spacing grid)
- Dark-first theme with light mode support (`.dark` / `.light` classes on `<html>`)
- No neon, no glassmorphism, no gaming/cartoon UI
- Large elegant border radius (`rounded-xl` = 12px cards, `rounded-lg` = 8px buttons)
- Subtle shadows (`shadow-sm` default, `shadow-md` on hover)
- Soft transitions (150-200ms ease, Framer Motion for entrances)
- Monospace numbers for financial data (`font-mono`)
- Every interactive element has hover, focus, and active states
- AI-powered features always denoted with `Sparkles` icon + brand-500 accent

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite 8 + React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, no config file) |
| Routing | React Router v7 |
| Animation | Framer Motion 12 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| AI SDK | `@ai-sdk/google` + `ai` (future) |
| Markdown | react-markdown + remark-gfm |
| Radix UI | dialog, dropdown-menu, select, tabs, tooltip, accordion, alert-dialog, checkbox, progress, switch, toast, label, separator, slot |
| Path alias | `@/` → `src/` |

---

## Theme & Design Tokens

Defined in `src/styles/globals.css` using CSS custom properties.

### Brand Colors
| Token | Value (Dark) | Usage |
|-------|-------------|-------|
| `--brand-50` | `#eef2ff` | Badge bg |
| `--brand-500` | `#6366f1` | Primary actions, links |
| `--brand-600` | `#4f46e5` | Button bg, hover |
| `--brand-700` | `#4338ca` | Button hover dark |

### Surface Colors
| Token | Dark | Light |
|-------|------|-------|
| `--surface` | `#0a0a0b` | `#ffffff` |
| `--surface-secondary` | `#18181b` | `#fafafa` |
| `--surface-tertiary` | `#27272a` | `#f4f4f5` |
| `--border` | `#27272a` | `#e4e4e7` |
| `--border-hover` | `#3f3f46` | `#d4d4d8` |
| `--border-light` | `#18181b` | `#f4f4f5` |

### Text Colors
| Token | Dark | Light |
|-------|------|-------|
| `--text-primary` | `#fafafa` | `#18181b` |
| `--text-secondary` | `#a1a1aa` | `#52525b` |
| `--text-tertiary` | `#71717a` | `#a1a1aa` |

### Semantic Colors
- Success: `#22c55e` (green)
- Warning: `#f59e0b` (amber)
- Danger: `#ef4444` (red)
- Info: `#3b82f6` (blue)

### Radius
- `rounded-lg` = 8px (buttons, inputs)
- `rounded-xl` = 12px (cards, modals)
- `rounded-2xl` = 16px (hero elements)

### Shadows
- `shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
- `shadow-md`: 0 4px 6px rgba(0,0,0,0.1)
- `shadow-lg`: 0 10px 15px rgba(0,0,0,0.1)

### Animation Keyframes (globals.css)
- `fadeUp` — opacity 0→1, y 12→0
- `scaleIn` — opacity 0→1, scale 0.95→1
- `slideInRight` — x -20→0
- `slideInLeft` — x 20→0
- `pulseSubtle` — opacity pulse

---

## Component Architecture

### Common Components (`src/components/common/`)

| Component | Variants | Notes |
|-----------|----------|-------|
| `Button` | primary, secondary, ghost, danger; sm/md/lg | Uses `@radix-ui/react-slot` for `asChild` |
| `Card` | default + MetricCard, AICard, EmptyCard | `hover` prop for border animation |
| `Avatar` | sm/md/lg/xl; status dots | Auto-initials with deterministic color |
| `Badge` | default/primary/success/warning/danger/info; sm/md/lg | |
| `StatusBadge` | active/inactive/pending/approved/rejected/paid/overdue/stock | Dot indicator |
| `Alert` | success/warning/danger/info | Icon + optional close |
| `Skeleton` | + SkeletonCard, SkeletonTable | Loading states |
| `ProgressBar` | 3 variants, 2 sizes | Optional % label |
| `LoadingSpinner` | sm/md/lg + PageLoader | |
| `TextInput` | label, error, icon | Forwarded ref |
| `Textarea` | label, error | Auto-resize via CSS |
| `Select` | label, error, options, placeholder | Native select |
| `SearchInput` | Search icon, ref | |
| `Checkbox` | label | |
| `Switch` | checked, onCheckedChange, label | |
| `Modal` | title, description, open/onOpenChange | Radix Dialog + Framer Motion |
| `Toast` | success/error/warning/info; ToastProvider + useToast | Radix Toast |
| `Tooltip` | content, side | Radix Tooltip |
| `Dropdown` | trigger, items (icon, label, onClick, variant, separator) | Radix DropdownMenu |

**Pattern:** All components use `cn()` utility (`clsx` + `tailwind-merge`), receive `className` for extension, and use `forwardRef` where appropriate.

### Dashboard Components (`src/components/dashboard/`)

| Component | Purpose |
|-----------|---------|
| `CommandCenter` | Hero card: greeting, metric chips, AI recommendation, circular health score (91%), system status, action buttons |
| `KPICard` | Metric card with icon, value, % change, mini sparkline (Recharts), hover lift |
| `HealthCard` | Business health: circular progress (SVG), title, trend, description |
| `ChartsSection` | Revenue line chart + Orders bar chart (Recharts) |
| `QuickActions` | 6 action cards grid (Report, Email, Approve, Restock, Invoice, Copilot) |
| `ActivityFeed` | Timeline of 6 activities with type-colored icons |
| `RightSidebar` | Schedule, tasks, notifications, AI tip |
| `CircularProgress` | Reusable SVG circular progress with Framer Motion animation |

### Copilot Components (`src/components/copilot/`)

| Component | Purpose |
|-----------|---------|
| `WelcomeState` | Branding + 6 suggested prompt cards |
| `ChatMessage` | Per-message: avatar, name, timestamp, markdown rendering (react-markdown) with code blocks + copy button |
| `ChatInput` | Auto-resizing textarea, Enter to send, Shift+Enter newline, Send/Attach/Clear |
| `TypingIndicator` | 3 animated bouncing dots |

### Layout Components (`src/components/layouts/`)

| Component | Purpose |
|-----------|---------|
| `AppLayout` | Sidebar + Navbar + animated `<Outlet>` |
| `Sidebar` | Collapsible 64px/240px, 6 nav items with tooltips |
| `Navbar` | Search, theme toggle, notification badge, user avatar |

---

## Page Architecture

| Route | Page | Status | Description |
|-------|------|--------|-------------|
| `/landing` | Landing | ✅ | "Run Your Business" hero + 4 feature cards + CTA |
| `/login` | Login | ✅ | Clean email/password form |
| `/` | Dashboard | ✅ | Command center + KPIs + health + charts + actions + activity + sidebar |
| `/copilot` | Copilot | ✅ | Full chat workspace: sidebar, welcome, messages, markdown, code blocks |
| `/workflow` | Workflow | ✅ | 4 expandable workflow cards with timeline + approve/reject |
| `/inventory` | Inventory | ✅ | Product table + search/filter + AI recommendations |
| `/analytics` | Analytics | ✅ | Revenue/orders/quarterly charts + KPI cards + AI forecasts |
| `/settings` | Settings | ✅ | 6 tabbed panels: Profile, Company, Notifications, Billing, Security, Appearance |

### Page Layout Patterns

- **Standard pages** (Workflow, Inventory, Analytics, Settings): `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">`
- **Full-bleed pages** (Dashboard, Copilot): use `-mx-6 -mb-6` with `h-[calc(100vh-5rem)]` or nested flex layouts
- **Dashboard** uses two-column flex: main content (flex-1) + sticky right sidebar (w-80, hidden < xl)
- **Copilot** uses three-column flex: sidebar (280px, animated) + chat (flex-1) + suggestions panel (w-72, hidden < xl)

---

## Data Model

All mock data lives in `src/data/mock.ts`. Types in `src/types/index.ts`.

```typescript
interface KPI {
  label: string; value: string; change: number;
  changeLabel: string; icon: string;
}

interface Activity {
  id: string; type: string; message: string;
  timestamp: string; user: string;
}

interface Product {
  id: string; name: string; category: string;
  stock: number; minStock: number; price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface Workflow {
  id: string; type: "leave"|"expense"|"purchase"|"order";
  title: string; status: "pending"|"approved"|"rejected";
  steps: WorkflowStep[]; createdAt: string;
}

interface WorkflowStep {
  label: string; status: "completed"|"active"|"pending";
  timestamp?: string;
}

interface Insight {
  icon: string; text: string; color: string;
}

interface HealthScore {
  score: number; trend: "up"|"down"|"stable";
  label: string; description: string;
}

interface QuickAction {
  id: string; label: string; icon: string; description: string;
}

interface ScheduleItem {
  id: string; title: string; time: string;
}

interface TaskItem {
  id: string; title: string; due: string;
  priority: "high"|"medium"|"low";
}

interface NotificationItem {
  id: string; message: string; time: string;
}

interface ChatConversation {
  id: string; title: string; lastMessage: string;
  timestamp: string; isFavorite?: boolean;
}

interface ChatMessageItem {
  id: string; role: "user"|"assistant";
  content: string; timestamp: string;
}

interface SuggestedPrompt {
  id: string; label: string; icon: string;
  description: string; responseKey: string;
}
```

### Demo Company: NovaTech Solutions

| Attribute | Value |
|-----------|-------|
| Employees | 48 (displayed as 52 in some views) |
| Revenue (YTD) | $624,450 |
| Monthly Revenue | $82,450 |
| Revenue Change | +14% |
| Orders Today | 47 |
| Products | 10 (inventory) |
| Inventory Value | $182.4K |
| Inventory Alerts | 3 |
| Pending Approvals | 2 |
| Annual Run Rate | ~$989K |

---

## AI Features

### Key Manager (`src/services/key-manager.ts`)
- 6 Gemini API keys from `.env.local` (`VITE_GEMINI_KEYS=key1,key2,...`)
- Auto-rotation on 429/403 errors
- Per-key daily cap tracking (1500 requests)
- Exponential cooldown on consecutive failures
- Daily automatic reset

### Planned AI Integrations (not yet connected)
| Feature | Route | Status |
|---------|-------|--------|
| Business Reports | Copilot | Mock data ready |
| Email Drafting | Copilot | Mock data ready |
| Meeting Summaries | Copilot | Mock data ready |
| Sales Analysis | Copilot | Mock data ready |
| Inventory Recommendations | Copilot + Inventory | Mock data ready |
| Workflow Approvals | Workflow | UI complete, AI pending |

---

## Coding Rules

1. **Reusable components first** — Never duplicate UI. Extract to `common/` if used in 2+ places.
2. **Strict TypeScript** — No `any` unless unavoidable (Recharts tooltip props are exempt). All props typed.
3. **Tailwind CSS** — No CSS modules, no styled-components, no inline styles. Use `cn()` for class merging.
4. **Framer Motion** — Page entrances (`initial`/`animate`), card fade-ups, hover/tap animations. Keep subtle (no bouncy springs on production elements).
5. **No backend until MVP** — All data from `src/data/mock.ts`. No API calls. No authentication.
6. **No hardcoded strings** — Labels, names, metrics come from mock data or constants.
7. **Accessibility basics** — `label` elements for form fields, `aria-label` for icon-only buttons, `role` attributes where needed.
8. **Component file structure** — One component per file, named export, co-located in appropriate folder (`common/`, `dashboard/`, `copilot/`, `layouts/`).
9. **Barrel exports** — `index.ts` in each component folder re-exports all components.
10. **Dark-first** — Default theme is dark. Light mode via `.light` class. Test both.

---

## Current Project Structure

```
src/
├── App.tsx                    # Routes
├── main.tsx                   # Entry point
├── styles/
│   └── globals.css            # Design tokens, Tailwind, animations, base styles
├── types/
│   └── index.ts               # All TypeScript interfaces
├── data/
│   └── mock.ts                # All mock data + AI mock responses
├── utils/
│   └── cn.ts                  # clsx + tailwind-merge
├── hooks/
│   └── useTheme.ts            # Theme toggle with localStorage + OS detection
├── services/
│   └── key-manager.ts         # Multi-key Gemini failover
├── components/
│   ├── common/                # 16 reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Skeleton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Input.tsx          # TextInput, Textarea, Select, SearchInput, Checkbox, Switch
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx          # ToastProvider + useToast
│   │   ├── Tooltip.tsx
│   │   ├── Dropdown.tsx
│   │   └── index.ts           # Barrel exports
│   ├── layouts/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navbar.tsx
│   ├── dashboard/
│   │   ├── CommandCenter.tsx
│   │   ├── KPICard.tsx
│   │   ├── HealthCard.tsx
│   │   ├── ChartsSection.tsx
│   │   ├── QuickActions.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── RightSidebar.tsx
│   │   ├── CircularProgress.tsx
│   │   └── AIInsights.tsx     # Kept for reference, not used in current Dashboard
│   └── copilot/
│       ├── WelcomeState.tsx
│       ├── ChatMessage.tsx
│       ├── ChatInput.tsx
│       ├── TypingIndicator.tsx
│       └── index.ts
└── pages/
    ├── Landing.tsx
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Copilot.tsx
    ├── Workflow.tsx
    ├── Inventory.tsx
    ├── Analytics.tsx
    └── Settings.tsx
```

---

## Design Patterns

### Chat Patterns (Copilot)
- Enter to send, Shift+Enter for newline
- Typing indicator with 1.2-2s simulated delay
- Auto-scroll to bottom on new messages
- 6 predefined prompt cards → mapped to realistic mock responses
- Generic fallback for custom text input

### Workflow Patterns
- Expandable cards with timeline (vertical line + step circles)
- Status indicators: completed (green check), active (blue clock), pending (gray x)
- Approve/Reject buttons on pending workflows
- Status color mapping: approved→success, rejected→danger, pending→warning

### Dashboard Patterns
- Sticky right sidebar on xl+ screens
- Sparklines on KPI cards (Recharts tiny LineChart, no axes/grid)
- CircularProgress SVG component (stroke-dasharray animation via Framer Motion)
- CommandCenter: 5 metric chips in flex-wrap row, AI recommendation with left brand-500 border

### Analytics Patterns
- AreaChart with gradient fill for revenue (brand-600)
- Multiple chart types: Line, Bar, Area, stacked Bar
- Custom tooltip component shared across charts
- Metric summary cards above charts

---

## Environment

```env
# .env.local (gitignored via *.local)
VITE_GEMINI_KEYS=key1,key2,key3,key4,key5,key6
```

- All env variables must be prefixed `VITE_` for Vite client exposure
- Dev server: `localhost:5173` (Vite default)
- Build: `npx vite build` (output: `dist/`)

---

## MVP Goal

A polished, production-like business operating system suitable for a 5-minute hackathon demo.

**Demo story (6 scenes):**
1. Landing → User arrives at NovaOS
2. Login → User signs in
3. Dashboard → AI Command Center shows business intelligence (91 health score, KPIs, charts, AI insights)
4. Copilot → User asks for monthly report → AI generates markdown response with tables
5. Workflow → User reviews and approves pending requests
6. Analytics → User views revenue trends and forecasts

**Post-MVP priorities:**
- Connect Gemini API to Copilot (real AI responses via KeyManager)
- Connect Workflow approvals to actual state changes
- Add real-time data (WebSocket or polling)
- Add user authentication
- Port event hub + webhook system from old Next.js project

---

> **For AI agents:** Read this file before making any changes. It defines the design system, component architecture, data model, and coding conventions. All new code must follow these patterns. If something is unclear or missing, check existing files in the same category for reference.
