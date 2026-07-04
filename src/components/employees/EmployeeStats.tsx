import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Employee, Department } from "@/types";

interface EmployeeStatsProps {
  employees: Employee[];
  departments: Department[];
}

export function EmployeeStats({ employees, departments }: EmployeeStatsProps) {
  const active = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on-leave").length;

  const stats = [
    { label: "Total Employees", value: employees.length, icon: Users, color: "text-brand-500" },
    { label: "Active", value: active, icon: UserCheck, color: "text-green-500" },
    { label: "On Leave", value: onLeave, icon: UserX, color: "text-amber-500" },
    { label: "Departments", value: departments.length, icon: Building2, color: "text-violet-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-tertiary">{stat.label}</span>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-text-primary">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
