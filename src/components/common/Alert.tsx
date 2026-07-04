import { cn } from "@/utils/cn";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { forwardRef } from "react";

const variants = {
  success: {
    container: "border-success-500/20 bg-success-50/50 dark:bg-success-900/10",
    icon: CheckCircle2,
    iconColor: "text-success-600 dark:text-success-400",
    textColor: "text-success-800 dark:text-success-300",
  },
  warning: {
    container: "border-warning-500/20 bg-warning-50/50 dark:bg-warning-900/10",
    icon: AlertTriangle,
    iconColor: "text-warning-600 dark:text-warning-400",
    textColor: "text-warning-800 dark:text-warning-300",
  },
  danger: {
    container: "border-danger-500/20 bg-danger-50/50 dark:bg-danger-900/10",
    icon: AlertCircle,
    iconColor: "text-danger-600 dark:text-danger-400",
    textColor: "text-danger-800 dark:text-danger-300",
  },
  info: {
    container: "border-info-500/20 bg-info-50/50 dark:bg-info-900/10",
    icon: Info,
    iconColor: "text-info-600 dark:text-info-400",
    textColor: "text-info-800 dark:text-info-300",
  },
} as const;

interface AlertProps {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", title, children, onClose, className }, ref) => {
    const config = variants[variant];
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-start gap-3 rounded-lg border p-4",
          config.container,
          className,
        )}
      >
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn("text-sm font-medium", config.textColor)}>{title}</p>
          )}
          <div className={cn("text-xs", config.textColor, title && "mt-0.5")}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";
