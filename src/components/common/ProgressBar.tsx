import { cn } from "@/utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const variantColors = {
  default: "bg-brand-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

const sizes = {
  sm: "h-1.5",
  md: "h-2",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("flex-1 rounded-full bg-surface-tertiary overflow-hidden", sizes[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", variantColors[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-tertiary font-mono min-w-[3ch] text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
