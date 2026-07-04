import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Clock, FileText, CheckCircle, ArrowRight, Zap, Sun, Moon, Cloud } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { CircularProgress } from "./CircularProgress";
import { COMMAND_CENTER } from "@/data";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", icon: Sun };
  if (h < 17) return { text: "Good Afternoon", icon: Cloud };
  if (h < 21) return { text: "Good Evening", icon: Cloud };
  return { text: "Good Night", icon: Moon };
}

const metrics = [
  { label: "Revenue", value: COMMAND_CENTER.revenue, change: COMMAND_CENTER.revenueChange, icon: TrendingUp, color: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20" },
  { label: "Orders", value: String(COMMAND_CENTER.ordersToday), subtitle: "Today", icon: Clock, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" },
  { label: "Alerts", value: String(COMMAND_CENTER.inventoryAlerts), subtitle: "Inventory", icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20" },
  { label: "Approvals", value: String(COMMAND_CENTER.pendingApprovals), subtitle: "Pending", icon: CheckCircle, color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20" },
  { label: "Report", value: "Ready", subtitle: "Monthly", icon: FileText, color: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10" },
];

export function CommandCenter() {
  const navigate = useNavigate();
  const { text: greeting, icon: GreetIcon } = getGreeting();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex gap-8">
        <div className="flex-1 min-w-0 space-y-5">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">
              <Sparkles className="h-3 w-3" />
              Business Intelligence
            </Badge>
            <h2 className="text-lg font-semibold text-text-primary">
              {greeting}, Sumith
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Here's today's business intelligence report.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2.5 rounded-lg border border-border-light bg-surface-secondary px-3 py-2"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.color}`}>
                  <m.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-text-tertiary leading-none">{m.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-text-primary">{m.value}</span>
                    {m.change && <span className="text-[11px] font-medium text-success-500">{m.change}</span>}
                    {m.subtitle && <span className="text-[10px] text-text-tertiary">{m.subtitle}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border-l-2 border-brand-500 bg-surface-secondary p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-brand-500" />
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">AI Recommendation</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
              {COMMAND_CENTER.aiSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={() => navigate("/copilot")}>
              Resolve with AI
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/analytics")}>
              View Full Report
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-48 shrink-0 border-l border-border pl-8">
          <CircularProgress percentage={91} size={120} strokeWidth={7} label="Health Score" />
          <div className="mt-4 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success-500" />
            <span className="text-xs font-medium text-text-primary">System Healthy</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-0.5 text-center">All systems operational</p>
        </div>
      </div>
    </motion.div>
  );
}
