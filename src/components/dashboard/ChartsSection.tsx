import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { REVENUE_CHART_DATA, ORDERS_CHART_DATA, PRODUCTS, DEPARTMENTS } from "@/data";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];
const axisStyle = { fontSize: 11, fill: "var(--color-text-tertiary)" };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {typeof entry.value === "number" && entry.value > 1000
            ? `$${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
}

export function ChartsSection() {
  const categoryValue = useMemo(() => {
    const map: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + p.stock * p.price;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const departmentData = useMemo(
    () => DEPARTMENTS.map((d) => ({ name: d.name, headcount: d.headCount })),
    []
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Charts & Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Revenue Trend</h3>
              <p className="text-xs text-text-secondary mt-0.5">Last 12 months</p>
            </div>
            <span className="text-xs font-medium text-success-500">+14% vs last year</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
                <Line type="monotone" dataKey="forecast" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Orders by Month</h3>
              <p className="text-xs text-text-secondary mt-0.5">Last 12 months</p>
            </div>
            <span className="text-xs font-medium text-success-500">+8% vs last year</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ORDERS_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Stock Value by Category</h3>
              <p className="text-xs text-text-secondary mt-0.5">Current inventory valuation</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryValue} layout="vertical" barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryValue.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Team Distribution</h3>
              <p className="text-xs text-text-secondary mt-0.5">Headcount by department</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="headcount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {departmentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              {departmentData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name}: {d.headcount}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
