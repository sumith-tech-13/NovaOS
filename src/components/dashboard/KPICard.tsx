import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { KPI } from "@/types";
import { SPARKLINES } from "@/data";

const iconMap: Record<string, React.ElementType> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  employees: Users,
  inventory: Package,
};

const sparklineColors: Record<string, string> = {
  revenue: "#22c55e",
  orders: "#6366f1",
  employees: "#3b82f6",
  inventory: "#f59e0b",
};

const iconBgColors: Record<string, string> = {
  revenue: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  orders: "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400",
  employees: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  inventory: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
};

interface KPICardProps {
  data: KPI;
  index: number;
}

export function KPICard({ data, index }: KPICardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[data.icon] || DollarSign;
  const isPositive = data.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const color = sparklineColors[data.icon] || "#6366f1";
  const bgColor = iconBgColors[data.icon] || iconBgColors.orders;
  const sparkData = (SPARKLINES[data.icon as keyof typeof SPARKLINES] || []).map((v: number, i: number) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={() => data.path && navigate(data.path)}
      className="rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md hover:border-border-hover transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", bgColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isPositive
              ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
              : "bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400",
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {Math.abs(data.change)}%
        </span>
      </div>

      <p className="text-xs text-text-secondary">{data.label}</p>
      <p className="mt-0.5 text-xl font-semibold text-text-primary tracking-tight">{data.value}</p>
      <p className="text-xs text-text-tertiary mt-0.5">{data.changeLabel}</p>

      <div className="mt-3 h-9 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
