import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, MoreHorizontal, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Employee } from "@/types";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";

const STATUS_VARIANTS: Record<string, "success" | "warning" | "secondary"> = {
  active: "success",
  "on-leave": "warning",
  inactive: "secondary",
};

const ROLE_VARIANTS: Record<string, "info" | "primary" | "default"> = {
  Admin: "info",
  Manager: "primary",
  Employee: "default",
};

interface EmployeeTableProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeTable({ employees, onSelect, onEdit, onDelete }: EmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "department" | "performanceScore">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const departments = useMemo(() => [...new Set(employees.map((e) => e.department))], [employees]);

  const filtered = useMemo(() => {
    let result = [...employees];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    if (deptFilter !== "all") result = result.filter((e) => e.department === deptFilter);
    if (statusFilter !== "all") result = result.filter((e) => e.status === statusFilter);

    result.sort((a, b) => {
      let va: string | number = a[sortField];
      let vb: string | number = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, search, deptFilter, statusFilter, sortField, sortDir]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface-secondary pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-surface-secondary pl-3 pr-8 text-sm text-text-primary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-surface-secondary pl-3 pr-8 text-sm text-text-primary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-text-tertiary">
              <th
                className="cursor-pointer select-none px-4 py-3 text-left hover:text-text-primary"
                onClick={() => toggleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Employee
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th
                className="cursor-pointer select-none px-4 py-3 text-left hover:text-text-primary"
                onClick={() => toggleSort("department")}
              >
                <span className="inline-flex items-center gap-1">
                  Department
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th
                className="cursor-pointer select-none px-4 py-3 text-right hover:text-text-primary"
                onClick={() => toggleSort("performanceScore")}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  Performance
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="px-4 py-3 text-right">Joined</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((employee, i) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="cursor-pointer border-b border-border transition-colors hover:bg-surface-secondary last:border-0"
                onClick={() => onSelect(employee)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={employee.name} size="sm" />
                    <span className="font-medium text-text-primary">{employee.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{employee.email}</td>
                <td className="px-4 py-3 text-text-secondary">{employee.department}</td>
                <td className="px-4 py-3">
                  <Badge variant={ROLE_VARIANTS[employee.role]} size="sm">{employee.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANTS[employee.status]} size="sm" dot>
                    {employee.status === "on-leave" ? "On Leave" : employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-tertiary">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          employee.performanceScore >= 90 ? "bg-green-500" :
                          employee.performanceScore >= 75 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${employee.performanceScore}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-text-tertiary">{employee.performanceScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-text-secondary">{employee.joinDate}</td>
                <td className="px-4 py-3 text-right relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === employee.id ? null : employee.id); }}
                    className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenuId === employee.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-4 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-surface py-1 shadow-lg"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(employee); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-surface-secondary transition-colors text-left"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(employee.id); setOpenMenuId(null); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors text-left"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-text-tertiary">
            No employees found matching your filters.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-text-tertiary">
        <span>{filtered.length} of {employees.length} employees</span>
      </div>
    </div>
  );
}
