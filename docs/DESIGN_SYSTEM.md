# Design System — NovaOS

> The complete reference for every visual token, component API, and layout pattern.

---

## 1. Design Tokens

All tokens defined in `src/styles/globals.css` as CSS custom properties on `:root` (light) and `.dark` (dark).

### 1.1 Brand Colors

```css
--brand-50:  #eef2ff;  /* Light badge bg, icon bg */
--brand-100: #e0e7ff;
--brand-200: #c7d2fe;  /* Forecast line color */
--brand-500: #6366f1;  /* Primary actions, links, chart line */
--brand-600: #4f46e5;  /* Button bg, active states */
--brand-700: #4338ca;  /* Button hover */
```

**Usage pattern:** Use `text-brand-600` for text, `bg-brand-600` for filled buttons, `border-brand-500/20` for AI cards, `bg-brand-50 dark:bg-brand-500/10` for icon containers.

### 1.2 Surface Colors

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--surface` | `#0a0a0b` | `#ffffff` | Page bg, card bg |
| `--surface-secondary` | `#18181b` | `#fafafa` | Input bg, sidebar, secondary cards |
| `--surface-tertiary` | `#27272a` | `#f4f4f5` | Hover states, skeleton, code blocks |

### 1.3 Border Colors

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--border` | `#27272a` | `#e4e4e7` | Default card/input borders |
| `--border-hover` | `#3f3f46` | `#d4d4d8` | Card hover border |
| `--border-light` | `#18181b` | `#f4f4f5` | Subtle dividers, light containers |

### 1.4 Text Colors

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--text-primary` | `#fafafa` | `#18181b` | Headings, body text |
| `--text-secondary` | `#a1a1aa` | `#52525b` | Descriptions, labels |
| `--text-tertiary` | `#71717a` | `#a1a1aa` | Placeholders, timestamps, hints |

### 1.5 Semantic Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Success | `#22c55e` | `success-500` | Positive changes, approved status, healthy indicators |
| Warning | `#f59e0b` | `warning-500` | Low stock, pending items, alerts |
| Danger | `#ef4444` | `danger-500` | Negative changes, rejected, out of stock, delete |
| Info | `#3b82f6` | `info-500` | Informational badges, active workflows |

Each semantic color has dark/light token pairs:
- `--success-50` / `--success-700` — badge bg/text (dark: `--success-900/20` / `--success-400`)
- Same pattern for `warning`, `danger`, `info`

### 1.6 Typography

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Font sizes:**
| Size | Tailwind | Usage |
|------|----------|-------|
| 10px | `text-[10px]` | Key hints, sidebar timestamps |
| 11px | `text-[11px]` | Secondary metadata, suggestion text |
| 12px | `text-xs` | Descriptions, badge text, table cells |
| 13px | `text-sm` | Body text, buttons (default) |
| 14px | `text-sm` (also) | Card titles |
| 16px | `text-base` | Section headings |
| 18px | `text-lg` | Page titles, greeting |
| 20px | `text-xl` | KPI values, modal titles |
| 24px | `text-2xl` | Circular progress percentage |

**Font weights:** `font-medium` (500) for body, `font-semibold` (600) for headings, `font-bold` (700) for page titles.

### 1.7 Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | 8px | Buttons, inputs, badges, icon containers |
| `rounded-xl` | 12px | Cards, modals, sidebar sections |
| `rounded-2xl` | 16px | Hero elements, command center icon |
| `rounded-full` | 9999px | Badges, status dots, pills |

### 1.8 Shadows

| Class | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Default card shadow |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Hover state, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modals, toasts |

### 1.9 Spacing

8px base spacing grid. Use Tailwind spacing scale:
- `gap-1` = 4px, `gap-2` = 8px, `gap-3` = 12px, `gap-4` = 16px, `gap-5` = 20px, `gap-6` = 24px
- `p-4` = 16px (card padding), `p-5` = 20px, `p-6` = 24px
- Cards: p-5 default. Sidebar sections: p-3. Compact cards: p-4.

---

## 2. Component API Reference

### 2.1 Button (`src/components/common/Button.tsx`)

```tsx
<Button
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" (h-8, text-xs) | "md" (h-9, text-sm) | "lg" (h-10, text-sm)
  asChild={boolean}    // Uses Radix Slot for Link wrapping
  disabled={boolean}
  className="..."
/>
```

**States:** Default, hover (opacity/scale), active (scale[0.98]), disabled (opacity-50, pointer-events-none), focus-visible (ring-2 ring-brand-500)

**Pattern:** Always use `gap-2` for icon+text combos. Never nest `<button>` inside `<Link>` — use `asChild` with `<Button asChild><Link to="...">text</Link></Button>`.

### 2.2 Card (`src/components/common/Card.tsx`)

```tsx
<Card hover={true} className="..." onClick={...}>
  // Base card: rounded-xl, border, bg-surface, p-5, shadow-sm
  // hover: border-border-hover transition
</Card>

// Sub-components:
<CardHeader>   // mb-4 container
<CardTitle>    // text-sm font-semibold text-text-primary
<CardDescription>  // text-xs text-text-secondary mt-0.5
<CardContent>  // bare container
<CardFooter>   // mt-4 flex items-center gap-2
```

**Specialized variants:**

```tsx
<MetricCard
  label="Total Revenue"
  value="$82,450"
  change={14}
  changeLabel="vs last month"
  icon={DollarSign}
  trend="up" | "down"
/>

<AICard title="AI Insight">
  {/* Brand-500/20 border, sparkles header */}
</AICard>

<EmptyCard icon={Inbox} title="No data" description="..." />
```

### 2.3 Avatar (`src/components/common/Avatar.tsx`)

```tsx
<Avatar
  name="Sumith Kumar"       // Auto-initials
  src="url"                 // Optional image
  size="sm" (24px) | "md" (32px) | "lg" (40px) | "xl" (48px)
  status="online" | "offline" | "away"
  className="..."
/>
```

Auto-generated deterministic background color from name hash. Initials derived from first + last name.

### 2.4 Badge (`src/components/common/Badge.tsx`)

```tsx
<Badge
  variant="default" | "primary" | "success" | "warning" | "danger" | "info"
  size="sm" | "md" | "lg"
>
  label
</Badge>

<StatusBadge
  status="active" | "inactive" | "pending" | "approved" | "rejected"
         | "paid" | "overdue" | "low-stock" | "out-of-stock" | "in-stock"
/>
```

StatusBadge auto-maps status → variant + label + dot color.

### 2.5 Form Components (`src/components/common/Input.tsx`)

```tsx
<TextInput label="Email" error="Required" icon={Mail} placeholder="..." {...inputProps} />
<Textarea label="Description" error="..." rows={3} {...textareaProps} />
<Select label="Category" options={[{value, label}]} placeholder="Choose..." {...selectProps} />
<SearchInput placeholder="Search..." onChange={...} />
<Checkbox label="Remember me" checked={...} onChange={...} />
<Switch label="Notifications" checked={...} onCheckedChange={...} />
```

All form components: `rounded-lg`, `border-border`, `bg-surface-secondary`, focus: `border-brand-500 ring-1 ring-brand-500`, error: `border-danger-500`.

### 2.6 Modal (`src/components/common/Modal.tsx`)

```tsx
<Modal open={open} onOpenChange={setOpen} title="Title" description="Optional subtitle">
  {/* content */}
</Modal>

// Access trigger/close via:
<ModalTrigger asChild><Button>Open</Button></ModalTrigger>
<ModalClose />
```

Uses Radix Dialog + Framer Motion (scale + opacity animation). Overlay: `bg-black/60 backdrop-blur-sm`.

### 2.7 Toast (`src/components/common/Toast.tsx`)

```tsx
// Wrap app in provider:
<ToastProvider>
  <App />
</ToastProvider>

// Use anywhere:
const { addToast } = useToast();
addToast("Saved successfully", { description: "Your changes were saved", variant: "success" });
// variant: "success" | "error" | "warning" | "info"
```

Auto-dismiss after 4 seconds. Swipe to dismiss. Spring animation. Fixed bottom-right position.

### 2.8 Tooltip (`src/components/common/Tooltip.tsx`)

```tsx
<Tooltip content="Settings" side="top" | "bottom" | "left" | "right">
  <button><SettingsIcon /></button>
</Tooltip>
```

Radix Tooltip with 200ms delay. Rounded-md border, surface-secondary bg, shadow-sm.

### 2.9 Dropdown (`src/components/common/Dropdown.tsx`)

```tsx
<Dropdown
  trigger={<Button>...</Button>}
  align="start" | "end" | "center"
  items={[
    { label: "Edit", icon: Edit, onClick: handleEdit },
    { label: "Delete", icon: Trash, variant: "danger", onClick: handleDelete },
    { separator: true },
    { label: "Share", icon: Share, onClick: handleShare, disabled: true },
  ]}
/>
```

Radix DropdownMenu. Min-w-[180px], rounded-lg, border, p-1. Items: rounded-md px-2.5 py-1.5 text-xs.

### 2.10 Progress & Loading

```tsx
<ProgressBar value={75} variant="primary" | "success" | "warning" size="sm" | "md" showLabel />

<Skeleton className="h-4 w-full" />
<SkeletonCard />      // Card-shaped skeleton with 3 lines
<SkeletonTable rows={5} />  // Table skeleton with rows

<LoadingSpinner size="sm" | "md" | "lg" />
<PageLoader />        // Full-page spinner overlay
```

### 2.11 CircularProgress (`src/components/dashboard/CircularProgress.tsx`)

```tsx
<CircularProgress
  percentage={91}
  size={120}           // px diameter
  strokeWidth={7}
  label="Health Score"  // shown below percentage
/>
```

SVG circle with stroke-dasharray animation (Framer Motion, 1s ease-out, 0.2s delay). Gradient fill. Rotated -90deg so progress starts at 12 o'clock.

---

## 3. Layout Patterns

### 3.1 Standard Page

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="space-y-6 max-w-7xl mx-auto"
>
  <!-- Page header -->
  <!-- Content sections -->
</motion.div>
```

Used by: Login, Landing, Workflow, Inventory, Analytics, Settings.

### 3.2 Dashboard Page (Two-Column)

```tsx
<div className="space-y-6 max-w-7xl mx-auto">
  <CommandCenter />  {/* Full-width hero */}
  <div className="flex gap-6">
    <div className="flex-1 min-w-0 space-y-6">
      {/* KPI Grid, Health, Charts, Actions, Activity */}
    </div>
    <div className="w-80 shrink-0 hidden xl:block sticky top-6">
      <RightSidebar />
    </div>
  </div>
</div>
```

### 3.3 Copilot Page (Three-Column Full-Bleed)

```tsx
<div className="flex h-[calc(100vh-5rem)] -mx-6 -mb-6">
  <SidebarPanel />    {/* Animated 280px, collapsible */}
  <ChatArea />         {/* flex-1, min-w-0 */}
  <SuggestionsPanel /> {/* w-72, hidden < xl */}
</div>
```

### 3.4 Grid Patterns

```tsx
// 4-column KPI grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// 3-column health grid
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

// 2-column charts
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

// 3-column quick actions
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
```

---

## 4. Animation Conventions

### 4.1 Page Entrances

```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

### 4.2 Card Stagger

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.08 }}
>
```

### 4.3 Hover Effects

- **Cards:** `hover:shadow-md hover:border-border-hover` (Tailwind classes)
- **Clickable cards:** `whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}` (Framer Motion)
- **Buttons:** `active:scale-[0.98]` (Tailwind)

### 4.4 Page Transitions

Wrap `<Outlet>` in AppLayout with Framer Motion:
```tsx
<AnimatePresence mode="wait">
  <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
    <Outlet />
  </motion.div>
</AnimatePresence>
```

### 4.5 Chat Messages

```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

---

## 5. Icon Conventions

- All icons from `lucide-react`
- Icon sizes: `h-4 w-4` (16px) default, `h-4.5 w-4.5` (18px) for card icons, `h-5 w-5` (20px) for feature icons, `h-6 w-6` (24px) for hero icons
- AI features always use `Sparkles` icon
- Icon containers: 32px (h-8 w-8) for list items, 36px (h-9 w-9) for metric cards, 48px (h-12 w-12) for hero
- Icon container color: `bg-{color}-50 dark:bg-{color}-500/10 text-{color}-600 dark:text-{color}-400`

### Icon Mapping Pattern

```tsx
const iconMap: Record<string, React.ElementType> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  employees: Users,
  inventory: Package,
};
// Usage: const Icon = iconMap[key] || FallbackIcon;
```

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Default | < 640px | Single column, stacked layout |
| `sm` | 640px+ | 2-column grids appear |
| `lg` | 1024px+ | 4-column KPI grid, 3-column actions |
| `xl` | 1280px+ | Right sidebar visible, 3-column copilot |

---

## 7. Dark/Light Mode

- Default: dark (matches `prefers-color-scheme: dark`)
- Toggle via `useTheme()` hook
- Classes: `.dark` or `.light` on `<html>`
- All tokens switch via CSS custom properties
- Test both modes before shipping

**Pattern for conditional styling:**
```tsx
className="bg-white dark:bg-surface text-gray-900 dark:text-text-primary"
// Or use semantic tokens which auto-switch:
className="bg-surface text-text-primary"
```
