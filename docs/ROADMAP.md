# Product Roadmap — NovaOS

> Strategic plan from MVP hackathon to production-ready product.

---

## Phase 1: MVP (Hackathon — Day 1-3)

**Theme:** "Run Your Business. Not Your Busywork."

### Done (Day 1-2)
| Feature | Status | Notes |
|---------|--------|-------|
| Project scaffold (Vite + React + TS) | ✅ | Path aliases, Tailwind v4, all deps |
| Design system tokens (CSS vars) | ✅ | Brand, surface, text, semantic colors |
| TypeScript data model | ✅ | All interfaces defined |
| Mock data store | ✅ | Company, KPIs, products, workflows, chat |
| Theme hook (dark/light) | ✅ | useTheme + localStorage + OS detect |
| Button component | ✅ | 4 variants, 3 sizes, asChild |
| Card component | ✅ | Card, MetricCard, AICard, EmptyCard |
| Avatar component | ✅ | Auto-initials, status dots |
| Badge component | ✅ | 6 variants + StatusBadge |
| Alert component | ✅ | 4 variants with icons |
| Skeleton component | ✅ | Card + Table variants |
| ProgressBar component | ✅ | 3 variants, 2 sizes |
| LoadingSpinner component | ✅ | 3 sizes, PageLoader |
| Form components | ✅ | TextInput, Textarea, Select, SearchInput, Checkbox, Switch |
| Modal component | ✅ | Radix Dialog + Framer Motion |
| Toast system | ✅ | ToastProvider + useToast hook |
| Tooltip component | ✅ | Radix Tooltip |
| Dropdown component | ✅ | Radix DropdownMenu |
| Sidebar + Navbar layout | ✅ | Collapsible, 6 nav items |
| Landing page | ✅ | Hero + features + CTA |
| Login page | ✅ | Clean form |
| Dashboard page | ✅ | 7 sections + right sidebar |
| AI Command Center | ✅ | Health score, metrics, AI recommendation |
| KPI cards with sparklines | ✅ | Mini Recharts line charts |
| Business Health cards | ✅ | Circular progress, trends |
| Charts (Recharts) | ✅ | Revenue line + Orders bar |
| Quick Actions | ✅ | 6 action cards |
| Activity Feed | ✅ | Timeline with type icons |
| Dashboard Right Sidebar | ✅ | Schedule, tasks, notifications, AI tip |
| AI Copilot page | ✅ | Full chat workspace |
| Copilot Welcome State | ✅ | 6 prompt cards |
| Chat messages with markdown | ✅ | react-markdown, code blocks, copy button |
| Chat input area | ✅ | Auto-resize, Enter/Shift+Enter |
| Simulated AI responses | ✅ | 6 realistic business documents |
| Typing indicator | ✅ | Animated bouncing dots |
| Workflow page | ✅ | 4 cards with timeline + approve/reject |
| Inventory page | ✅ | Table + search/filters + AI recommendations |
| Analytics page | ✅ | 4 charts + KPI cards + AI insights |
| Settings page | ✅ | 6 tabbed panels |
| KeyManager service | ✅ | Multi-key Gemini failover |
| `.env.local` with 6 keys | ✅ | Gitignored |
| Full build passes | ✅ | TypeScript + Vite |

### Remaining for Hackathon
| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Project documentation | 🔴 High | 2hr | ✅ PROJECT_SPEC.md, DESIGN_SYSTEM.md, DATABASE.md, API_SPEC.md, ROADMAP.md, TASKS.md |
| Gemini integration (Copilot) | 🔴 High | 4hr | Replace mock AI_RESPONSES with real `@ai-sdk/google` streamText calls |
| Demo story script | 🔴 High | 1hr | 6-scene narrative for judges |
| Performance optimization | 🟡 Medium | 1hr | Code-split Recharts, lazy-load pages |
| Polish animations | 🟡 Medium | 1hr | Add transitions between page navigations |
| Build deployment | 🟡 Medium | 1hr | Vercel or Netlify deploy |
| README with demo video | 🟢 Low | 1hr | Project overview for judges |

---

## Phase 2: Post-Hackathon Polish (Week 1-2)

| Feature | Description |
|---------|-------------|
| Real AI responses | Connect Gemini via KeyManager for all Copilot queries |
| Streaming chat | SSE or WebSocket for real-time response streaming |
| Conversation persistence | localStorage → IndexedDB for chat history |
| Workflow AI validation | Gemini analyzes leave/expense/purchase requests |
| Real-time notifications | Polling or WebSocket for new activities |
| Loading states | Replace mock delays with actual loading skeletons |
| Error boundaries | Graceful error handling for AI failures |
| Toast notifications | AI completion events, workflow updates |
| Mobile responsiveness | Full mobile pass (sidebar drawer, compact cards) |
| Keyboard shortcuts | Cmd+K for command palette, Escape for modals |

---

## Phase 3: Beta Features (Month 1-2)

| Feature | Description |
|---------|-------------|
| User authentication | Email/password + Google OAuth |
| Company onboarding | Multi-step wizard for new companies |
| Real inventory management | CRUD for products, suppliers, categories |
| Workflow creation | Custom workflow builder |
| Email delivery | Send drafted emails via SMTP |
| Document export | PDF generation for reports and quotations |
| Team management | Invite members, roles, permissions |
| Audit log | Track all actions and changes |
| Notification preferences | Per-user notification settings |
| API key management | Self-service Gemini key configuration |

---

## Phase 4: Growth (Month 3-6)

| Feature | Description |
|---------|-------------|
| Multi-company support | Switch between organizations |
| Advanced analytics | Custom date ranges, comparison periods |
| AI forecasting | Predictive revenue/ inventory models |
| Workflow automation rules | If-this-then-that for business processes |
| Integrations | Slack, Gmail, QuickBooks, Shopify |
| Mobile apps | React Native for iOS/Android |
| Public API | Rate-limited API for third-party integrations |
| Billing & subscriptions | Stripe integration, plan tiers |
| White-label | Custom branding for enterprise clients |

---

## Key Metrics

| Metric | MVP Target | Beta Target |
|--------|------------|-------------|
| Pages | 8 | 15+ |
| Components | 20+ | 40+ |
| AI Features | 6 mock | 6 real + 3 more |
| Demo Duration | 5 min | Production-ready |
| Response Time | Instant (mock) | < 2s (real AI) |
| Browser Support | Chrome | Chrome, Firefox, Safari, Edge |
