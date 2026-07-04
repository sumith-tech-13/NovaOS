import { motion } from "framer-motion";
import type { Department } from "@/types";

const DEPT_COLORS = [
  "bg-brand-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-cyan-500",
];

interface DepartmentBreakdownProps {
  departments: Department[];
}

export function DepartmentBreakdown({ departments }: DepartmentBreakdownProps) {
  const total = departments.reduce((s, d) => s + d.headCount, 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text-primary">Department Breakdown</h3>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-tertiary">
        {departments.map((dept, i) => (
          <motion.div
            key={dept.id}
            initial={{ width: 0 }}
            animate={{ width: `${(dept.headCount / total) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className={DEPT_COLORS[i % DEPT_COLORS.length]}
          />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {departments.map((dept, i) => (
          <div key={dept.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${DEPT_COLORS[i % DEPT_COLORS.length]}`} />
              <span className="text-text-primary">{dept.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">{dept.headCount}</span>
              <span className="text-xs text-text-tertiary">
                ({Math.round((dept.headCount / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
