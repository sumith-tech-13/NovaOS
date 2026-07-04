import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-tertiary",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="h-4 w-24 mt-4" />
      <Skeleton className="h-7 w-32 mt-2" />
      <Skeleton className="h-3 w-20 mt-2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}
