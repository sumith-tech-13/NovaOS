import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Sparkles, Inbox } from "lucide-react";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-surface p-5 shadow-sm",
          hover && "transition-all duration-200 hover:border-border-hover",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-semibold text-text-primary", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-text-secondary mt-0.5", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex items-center gap-2", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ElementType;
  trend?: "up" | "down";
}

export function MetricCard({ label, value, change, changeLabel, icon: Icon, trend }: MetricCardProps) {
  const isPositive = trend === "up";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-surface p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
            <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
          </div>
        )}
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                : "bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400",
            )}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-text-primary tracking-tight font-mono">{value}</p>
        {changeLabel && <p className="mt-0.5 text-xs text-text-tertiary">{changeLabel}</p>}
      </div>
    </motion.div>
  );
}

interface AICardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AICard({ title = "AI Insight", children, className }: AICardProps) {
  return (
    <Card className={cn("border-brand-500/20", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/10">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
        </div>
        <span className="text-xs font-medium text-brand-400">{title}</span>
      </div>
      {children}
    </Card>
  );
}

export function EmptyCard({ icon: Icon = Inbox, title, description }: { icon?: React.ElementType; title: string; description?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center" hover={false}>
      {Icon && <Icon className="h-8 w-8 text-text-tertiary mb-3" />}
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && <p className="text-xs text-text-secondary mt-1 max-w-xs">{description}</p>}
    </Card>
  );
}
