import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { EMPLOYEES, DEPARTMENTS, LEAVE_REQUESTS } from "@/data";
import { EmployeeStats } from "@/components/employees/EmployeeStats";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { DepartmentBreakdown } from "@/components/employees/DepartmentBreakdown";
import { LeaveRequests } from "@/components/employees/LeaveRequests";
import { Skeleton, SkeletonTable } from "@/components/common/Skeleton";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { TextInput, Textarea, Select } from "@/components/common/Input";
import type { Employee, Department, LeaveRequest } from "@/types";

const STORAGE_KEYS = {
  employees: "employees_data",
  leaveRequests: "leave_requests_data",
};

function loadEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.employees);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const copy = EMPLOYEES.map((e) => ({ ...e }));
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(copy));
  return copy;
}

function loadLeaveRequests(): LeaveRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.leaveRequests);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const copy = LEAVE_REQUESTS.map((r) => ({ ...r }));
  localStorage.setItem(STORAGE_KEYS.leaveRequests, JSON.stringify(copy));
  return copy;
}

let nextEmpId = 100;
function generateEmpId() {
  return `e${nextEmpId++}`;
}

let nextLrId = 100;
function generateLrId() {
  return `lr${nextLrId++}`;
}

const emptyEmployeeForm = {
  name: "",
  email: "",
  department: "Engineering",
  role: "Employee" as Employee["role"],
  status: "active" as Employee["status"],
  phone: "",
  performanceScore: 50,
  joinDate: new Date().toISOString().slice(0, 10),
};

export function Employees() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyEmployeeForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = setTimeout(() => {
      setEmployees(loadEmployees());
      setLeaveRequests(loadLeaveRequests());
      setLoading(false);
    }, 550);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && employees.length > 0) {
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
    }
  }, [employees, loading]);

  useEffect(() => {
    if (!loading && leaveRequests.length > 0) {
      localStorage.setItem(STORAGE_KEYS.leaveRequests, JSON.stringify(leaveRequests));
    }
  }, [leaveRequests, loading]);

  const addEmployee = useCallback((emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    setSelected((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setSelected((prev) => (prev?.id === id ? null : prev));
  }, []);

  const addLeaveRequest = useCallback((req: LeaveRequest) => {
    setLeaveRequests((prev) => [req, ...prev]);
  }, []);

  const updateLeaveRequest = useCallback((id: string, status: "approved" | "rejected") => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
    if (form.performanceScore < 0 || form.performanceScore > 100) errors.performanceScore = "Must be 0-100";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAddSubmit() {
    if (!validateForm()) return;
    const now = new Date().toISOString().slice(0, 10);
    const employee: Employee = {
      id: generateEmpId(),
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      role: form.role,
      status: form.status,
      phone: form.phone.trim() || undefined,
      performanceScore: form.performanceScore,
      joinDate: editingEmployee ? editingEmployee.joinDate : now,
    };
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employee);
    } else {
      addEmployee(employee);
    }
    setAddModalOpen(false);
    setEditingEmployee(null);
    setForm(emptyEmployeeForm);
    setFormErrors({});
  }

  function openAddModal() {
    setEditingEmployee(null);
    setForm(emptyEmployeeForm);
    setFormErrors({});
    setAddModalOpen(true);
  }

  function openEditModal(employee: Employee) {
    setEditingEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      status: employee.status,
      phone: employee.phone || "",
      performanceScore: employee.performanceScore,
      joinDate: employee.joinDate,
    });
    setFormErrors({});
    setAddModalOpen(true);
  }

  function handleCloseModal() {
    setAddModalOpen(false);
    setEditingEmployee(null);
    setForm(emptyEmployeeForm);
    setFormErrors({});
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
            <SkeletonTable rows={6} />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Employees</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your team, view performance, and handle leave requests.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeStats employees={employees} departments={DEPARTMENTS} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmployeeTable
            employees={employees}
            onSelect={setSelected}
            onEdit={openEditModal}
            onDelete={(id) => deleteEmployee(id)}
          />
        </div>
        <div className="space-y-6">
          <DepartmentBreakdown departments={DEPARTMENTS} />
          <LeaveRequests
            requests={leaveRequests}
            employees={employees}
            onAddRequest={addLeaveRequest}
            onAction={updateLeaveRequest}
          />
        </div>
      </div>

      <EmployeeCard
        employee={selected}
        onClose={() => setSelected(null)}
        onEdit={openEditModal}
        onDelete={(id) => deleteEmployee(id)}
      />

      {/* --- Charts --- */}
      <PerformanceChartSection employees={employees} departments={DEPARTMENTS} />

      <Modal
        open={addModalOpen}
        onOpenChange={(open) => { if (!open) handleCloseModal(); }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        description={editingEmployee ? "Update employee information." : "Add a new team member to the organization."}
      >
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
          />
          <TextInput
            label="Email Address"
            placeholder="e.g. john@novatech.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={formErrors.email}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              options={DEPARTMENTS.map((d) => ({ value: d.name, label: d.name }))}
            />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Employee["role"] })}
              options={[
                { value: "Employee", label: "Employee" },
                { value: "Manager", label: "Manager" },
                { value: "Admin", label: "Admin" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Employee["status"] })}
              options={[
                { value: "active", label: "Active" },
                { value: "on-leave", label: "On Leave" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <TextInput
              label="Performance Score"
              type="number"
              min={0}
              max={100}
              placeholder="0-100"
              value={String(form.performanceScore)}
              onChange={(e) => setForm({ ...form, performanceScore: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
              error={formErrors.performanceScore}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Phone (optional)"
              placeholder="e.g. +1 (555) 123-4567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextInput
              label="Join Date"
              type="date"
              value={form.joinDate}
              onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddSubmit}>
              {editingEmployee ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

const CHART_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];
const chartAxisStyle = { fontSize: 11, fill: "var(--color-text-tertiary)" };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">
          {entry.value}
        </p>
      ))}
    </div>
  );
}

function PerformanceChartSection({ employees, departments }: { employees: Employee[]; departments: Department[] }) {
  const perfData = useMemo(
    () => employees.map((e) => ({ name: e.name.split(" ")[0], score: e.performanceScore })),
    [employees]
  );

  const deptData = useMemo(
    () => departments.map((d) => ({ name: d.name, headcount: d.headCount })),
    [departments]
  );

  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => { map[e.status] = (map[e.status] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));
  }, [employees]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border bg-surface p-5 shadow-sm lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Performance Scores</h3>
            <p className="text-xs text-text-secondary mt-0.5">Individual performance ratings</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perfData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={chartAxisStyle} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={chartAxisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {perfData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Team Status</h3>
              <p className="text-xs text-text-secondary mt-0.5">Employee status breakdown</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                {d.name}: {d.count}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Departments</h3>
              <p className="text-xs text-text-secondary mt-0.5">Headcount by team</p>
            </div>
          </div>
          <div className="space-y-2">
            {deptData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-xs text-text-secondary flex-1">{d.name}</span>
                <span className="text-xs font-semibold text-text-primary">{d.headcount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
