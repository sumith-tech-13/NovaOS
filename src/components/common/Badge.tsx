import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const variants = {
  default: "bg-surface-tertiary text-text-secondary",
  primary: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",
  secondary: "bg-surface-secondary text-text-secondary border border-border",
  success: "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400",
  info: "bg-info-50 text-info-700 dark:bg-info-900/20 dark:text-info-400",
} as const;

const sizes = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
} as const;

interface BadgeProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", children, className, dot }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variants[variant],
          sizes[size],
          className,
        )}
      >
        {dot && <span className={cn("h-1.5 w-1.5 rounded-full mr-1", variant === "success" ? "bg-success-500" : variant === "warning" ? "bg-warning-500" : variant === "danger" ? "bg-danger-500" : "bg-text-tertiary")} />}
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "approved" | "rejected" | "paid" | "overdue" | "low-stock" | "out-of-stock" | "in-stock";
  className?: string;
}

const statusConfig: Record<string, { variant: keyof typeof variants; label: string }> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "default", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
  paid: { variant: "success", label: "Paid" },
  overdue: { variant: "danger", label: "Overdue" },
  "low-stock": { variant: "warning", label: "Low Stock" },
  "out-of-stock": { variant: "danger", label: "Out of Stock" },
  "in-stock": { variant: "success", label: "In Stock" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: "default" as const, label: status };
  return (
    <Badge variant={config.variant} size="sm" className={cn("gap-1", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "active" || status === "approved" || status === "paid" || status === "in-stock" ? "bg-success-500" : status === "pending" || status === "low-stock" ? "bg-warning-500" : status === "rejected" || status === "overdue" || status === "out-of-stock" ? "bg-danger-500" : "bg-text-tertiary")} />
      {config.label}
    </Badge>
  );
}
