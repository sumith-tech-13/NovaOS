import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Calendar, Building2, ShieldCheck, Award, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Employee } from "@/types";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/common/ProgressBar";

interface EmployeeCardProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeCard({ employee, onClose, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <AnimatePresence>
      {employee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl"
          >
            <div className="absolute right-4 top-4 flex items-center gap-1">
              <button
                onClick={() => onEdit(employee)}
                className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => { onDelete(employee.id); onClose(); }}
                className="rounded-lg p-1.5 text-text-tertiary hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Avatar name={employee.name} size="lg" />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{employee.name}</h2>
                <p className="text-sm text-text-secondary">{employee.email}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-secondary p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                  <Building2 className="h-3.5 w-3.5" />
                  Department
                </div>
                <p className="mt-1 text-sm font-medium text-text-primary">{employee.department}</p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Role
                </div>
                <p className="mt-1 text-sm font-medium text-text-primary">{employee.role}</p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </div>
                <p className="mt-1 text-sm font-medium text-text-primary">{employee.phone || "—"}</p>
              </div>
              <div className="rounded-lg bg-surface-secondary p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined
                </div>
                <p className="mt-1 text-sm font-medium text-text-primary">{employee.joinDate}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant={employee.status === "active" ? "success" : employee.status === "on-leave" ? "warning" : "secondary"}
                size="sm"
                dot
              >
                {employee.status === "on-leave" ? "On Leave" : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </Badge>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
                  <Award className="h-3.5 w-3.5" />
                  Performance Score
                </span>
                <span className={cn(
                  "text-xs font-semibold",
                  employee.performanceScore >= 90 ? "text-green-500" :
                  employee.performanceScore >= 75 ? "text-amber-500" : "text-red-500"
                )}>
                  {employee.performanceScore}/100
                </span>
              </div>
              <ProgressBar
                value={employee.performanceScore}
                max={100}
                variant={employee.performanceScore >= 90 ? "success" : employee.performanceScore >= 75 ? "warning" : "danger"}
                size="md"
                className="mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
