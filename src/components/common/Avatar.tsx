import { cn } from "@/utils/cn";
import { forwardRef } from "react";

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
} as const;

interface AvatarProps {
  src?: string;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  status?: "online" | "offline" | "away";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const bgColors = [
  "bg-brand-500",
  "bg-success-500",
  "bg-warning-500",
  "bg-danger-500",
  "bg-info-500",
  "bg-purple-500",
  "bg-pink-500",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

const statusDots: Record<string, string> = {
  online: "bg-success-500",
  offline: "bg-text-tertiary",
  away: "bg-warning-500",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, name, size = "md", className, status }, ref) => {
    return (
      <div ref={ref} className={cn("relative inline-flex shrink-0", className)}>
        {src ? (
          <img
            src={src}
            alt={name}
            className={cn("rounded-full object-cover", sizes[size])}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-full font-medium text-white",
              sizes[size],
              getColor(name),
            )}
          >
            {getInitials(name)}
          </div>
        )}
        {status && (
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface",
              statusDots[status],
            )}
          />
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";
