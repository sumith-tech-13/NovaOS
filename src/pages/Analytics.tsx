import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, Sparkles, ArrowUpRight, Target,
  ShoppingCart, Package, Layers,
} from "lucide-react";
import { Card, AICard } from "@/components/common/Card";
import { Badge, StatusBadge } from "@/components/common/Badge";
import { Skeleton } from "@/components/common/Skeleton";
import { REVENUE_CHART_DATA, ORDERS_CHART_DATA, PRODUCTS } from "@/data";
import { cn } from "@/utils/cn";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {entry.name === "revenue" ? `$${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
}

const growthData = [
  { quarter: "Q1 2025", revenue: 123000, cost: 98000, profit: 25000 },
  { quarter: "Q2 2025", revenue: 139500, cost: 105000, profit: 34500 },
  { quarter: "Q3 2025", revenue: 169300, cost: 112000, profit: 57300 },
  { quarter: "Q4 2025", revenue: 191400, cost: 118000, profit: 73400 },
  { quarter: "Q1 2026", revenue: 213000, cost: 125000, profit: 88000 },
  { quarter: "Q2 2026 (est)", revenue: 248000, cost: 132000, profit: 116000 },
];

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#3b82f6", "#ef4444"];

export function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const totalRevenue = REVENUE_CHART_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = ORDERS_CHART_DATA.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  const categorySales = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PRODUCTS) {
      map[p.category] = (map[p.category] || 0) + p.price * p.stock;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const stockByProduct = useMemo(() => {
    return [...PRODUCTS].sort((a, b) => a.stock - b.stock);
  }, []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
        <div><Skeleton className="h-7 w-32" /><Skeleton className="h-4 w-56 mt-2" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><Skeleton className="h-80 rounded-xl" /></div>
          <div className="space-y-4"><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-32 rounded-xl" /></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Business performance and AI insights</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: DollarSign, color: "green", label: "Total Revenue (YTD)", value: `$${totalRevenue.toLocaleString()}`, delay: 0.1 },
          { icon: BarChart3, color: "blue", label: "Total Orders (YTD)", value: totalOrders.toString(), delay: 0.15 },
          { icon: Target, color: "purple", label: "Avg Order Value", value: `$${avgOrderValue.toLocaleString()}`, delay: 0.2 },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${s.color}-50 dark:bg-${s.color}-900/20 mb-3`}>
              <s.icon className={`h-4 w-4 text-${s.color}-600 dark:text-${s.color}-400`} />
            </div>
            <p className="text-xs text-text-secondary">{s.label}</p>
            <p className="mt-0.5 text-xl font-semibold text-text-primary font-mono">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Business Analytics - Revenue & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-1">Revenue Growth</h3>
          <p className="text-xs text-text-secondary mb-4">Monthly revenue with forecast trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_CHART_DATA}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
                <Line type="monotone" dataKey="forecast" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-1">Orders Distribution</h3>
          <p className="text-xs text-text-secondary mb-4">Monthly order volume</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDERS_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sales Analytics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-text-primary" />
          <h2 className="text-base font-semibold text-text-primary">Sales Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1">Revenue by Category</h3>
            <p className="text-xs text-text-secondary mb-4">Stock value distribution</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categorySales.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {categorySales.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-text-secondary">{cat.name}</span>
                  </div>
                  <span className="text-text-primary font-medium">₹{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1">Product Performance</h3>
            <p className="text-xs text-text-secondary mb-4">Stock value by product</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium text-text-tertiary">
                    <th className="text-left px-3 py-2">Product</th>
                    <th className="text-left px-3 py-2">Category</th>
                    <th className="text-right px-3 py-2">Price</th>
                    <th className="text-right px-3 py-2">Stock</th>
                    <th className="text-right px-3 py-2">Stock Value</th>
                    <th className="text-right px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5 text-text-primary font-medium">{p.name}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{p.category}</td>
                      <td className="px-3 py-2.5 text-text-primary text-right font-mono">₹{p.price.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-text-primary text-right">{p.stock}</td>
                      <td className="px-3 py-2.5 text-text-primary text-right font-mono">₹{(p.price * p.stock).toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Inventory Analytics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-text-primary" />
          <h2 className="text-base font-semibold text-text-primary">Inventory Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1">Stock Levels</h3>
            <p className="text-xs text-text-secondary mb-4">Current stock vs minimum threshold</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByProduct} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="stock" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={16} name="Stock" />
                  <Bar dataKey="minStock" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={16} name="Min Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-1">Category Breakdown</h3>
            <p className="text-xs text-text-secondary mb-4">Products by category</p>
            <div className="space-y-3">
              {categorySales.map((cat, i) => {
                const count = PRODUCTS.filter((p) => p.category === cat.name).length;
                const pct = Math.round((count / PRODUCTS.length) * 100);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">{cat.name}</span>
                      <span className="text-text-primary font-medium">{count} items</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-tertiary">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border space-y-1.5">
              {[
                { label: "Total Products", value: PRODUCTS.length },
                { label: "Low Stock Items", value: PRODUCTS.filter((p) => p.status === "low-stock" || p.status === "out-of-stock").length },
                { label: "Total Stock Value", value: `₹${PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0).toLocaleString()}` },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{s.label}</span>
                  <span className="text-text-primary font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quarterly Growth + AI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-1">Quarterly Growth</h3>
          <p className="text-xs text-text-secondary mb-4">Revenue vs Cost vs Profit</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={20} name="Revenue" />
                <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} name="Cost" />
                <Bar dataKey="profit" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={20} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-4">
          <AICard title="AI Forecast">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Q2 2026 Revenue</span>
                <span className="text-sm font-semibold text-text-primary">$248K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Growth Rate</span>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-3 w-3" /> 16.4%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Projected Profit</span>
                <span className="text-sm font-semibold text-text-primary">$116K</span>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Based on current trajectory, NovaTech is projected to reach $1M annual revenue by Q4 2026.
                </p>
              </div>
            </div>
          </AICard>

          <AICard title="Growth Insights">
            <div className="space-y-2">
              {[
                { icon: TrendingUp, color: "text-green-500", text: "Revenue up 14% this month" },
                { icon: TrendingUp, color: "text-blue-500", text: "Orders grew 32% YoY" },
                { icon: TrendingDown, color: "text-amber-500", text: "Inventory value down 3.1%" },
              ].map((insight, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-surface-secondary p-2.5">
                  <insight.icon className={`h-3.5 w-3.5 ${insight.color} shrink-0`} />
                  <span className="text-xs text-text-primary">{insight.text}</span>
                </div>
              ))}
            </div>
          </AICard>
        </div>
      </div>
    </motion.div>
  );
}
