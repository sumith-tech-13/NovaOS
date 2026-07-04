import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CommandCenter } from "@/components/dashboard/CommandCenter";
import { KPICard } from "@/components/dashboard/KPICard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { TimelineFeed } from "@/components/timeline/TimelineFeed";
import { HealthCard } from "@/components/dashboard/HealthCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { KPI_DATA, HEALTH_DATA, PRODUCTS } from "@/data";
import { Skeleton } from "@/components/common/Skeleton";
import { StatusBadge } from "@/components/common/Badge";
import { ArrowRight, Package } from "lucide-react";

function TopProducts() {
  const navigate = useNavigate();
  const sorted = [...PRODUCTS].sort((a, b) => b.stock * b.price - a.stock * a.price).slice(0, 5);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Top Products by Value</h3>
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors"
        >
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      >
        <div className="space-y-3">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="w-5 text-xs text-text-tertiary shrink-0">{i + 1}</span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                <Package className="h-4 w-4 text-text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                <p className="text-xs text-text-tertiary">{p.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-text-primary">₹{(p.stock * p.price).toLocaleString()}</p>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-36 w-full rounded-xl" />
        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-28 mt-3" />
                  <Skeleton className="h-3 w-16 mt-2" />
                  <Skeleton className="h-9 w-full mt-3" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-48 w-full mt-3" />
                </div>
              ))}
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="w-80 shrink-0 hidden xl:block space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-48 mt-3" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <CommandCenter />

      <div className="flex items-center justify-between -mt-2">
        <p className="text-xs text-text-tertiary">Last updated {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Key Metrics</h3>
              <button onClick={() => navigate("/analytics")} className="text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors">View Analytics</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KPI_DATA.map((kpi, i) => (
                <KPICard key={kpi.label} data={kpi} index={i} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Business Health</h3>
              <button onClick={() => navigate("/analytics")} className="text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors">View Reports</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <HealthCard data={HEALTH_DATA.financial} index={0} />
              <HealthCard data={HEALTH_DATA.operational} index={1} />
              <HealthCard data={HEALTH_DATA.employee} index={2} />
            </div>
          </div>

          <ChartsSection />

          <AIInsights />

          <TopProducts />

          <QuickActions />

          <TimelineFeed />
        </div>

        <div className="w-80 shrink-0 hidden xl:block">
          <div className="sticky top-6">
            <RightSidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
