import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import { CircularProgress } from "./CircularProgress";
import type { HealthScore } from "@/types";

interface HealthCardProps {
  data: HealthScore;
  index: number;
}

export function HealthCard({ data, index }: HealthCardProps) {
  const navigate = useNavigate();
  const TrendIcon = data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;
  const trendColor = data.trend === "up" ? "text-success-500" : data.trend === "down" ? "text-danger-500" : "text-text-tertiary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08 }}
      onClick={() => data.path && navigate(data.path)}
      className="rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <CircularProgress percentage={data.score} size={64} strokeWidth={5} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-text-primary">{data.label}</h4>
            <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
          </div>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{data.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
