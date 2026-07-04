import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, CalendarDays, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Employee, LeaveRequest } from "@/types";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { TextInput, Textarea, Select } from "@/components/common/Input";

const TYPE_LABELS: Record<string, string> = {
  annual: "Annual",
  sick: "Sick",
  personal: "Personal",
};

const emptyForm = {
  employeeId: "",
  type: "annual" as LeaveRequest["type"],
  startDate: "",
  endDate: "",
  reason: "",
};

interface LeaveRequestsProps {
  requests: LeaveRequest[];
  employees: Employee[];
  onAddRequest: (request: LeaveRequest) => void;
  onAction: (id: string, action: "approved" | "rejected") => void;
}

export function LeaveRequests({ requests, employees, onAddRequest, onAction }: LeaveRequestsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const pending = requests.filter((r) => r.status === "pending");
  const history = requests.filter((r) => r.status !== "pending");

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.employeeId) errors.employeeId = "Select an employee";
    if (!form.startDate) errors.startDate = "Start date is required";
    if (!form.endDate) errors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.startDate > form.endDate) errors.endDate = "End must be after start";
    if (!form.reason.trim()) errors.reason = "Reason is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) return;
    const employee = employees.find((e) => e.id === form.employeeId);
    const now = new Date().toISOString().slice(0, 10);
    const request: LeaveRequest = {
      id: crypto.randomUUID(),
      employeeId: form.employeeId,
      employeeName: employee?.name || "Unknown",
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "pending",
      reason: form.reason.trim(),
      submittedAt: now,
    };
    onAddRequest(request);
    setModalOpen(false);
    setForm(emptyForm);
    setFormErrors({});
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Leave Requests</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-md bg-surface-secondary px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <Plus className="h-3 w-3" />
          New
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-text-tertiary">Pending ({pending.length})</p>
          {pending.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-secondary p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10">
                  <CalendarDays className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{req.employeeName}</p>
                  <p className="text-xs text-text-tertiary">
                    {TYPE_LABELS[req.type]} · {req.startDate} → {req.endDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAction(req.id, "approved")}
                  className="rounded-lg p-1.5 text-green-500 hover:bg-green-500/10 transition-colors"
                  title="Approve"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onAction(req.id, "rejected")}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Reject"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="mt-4 flex items-center justify-center rounded-lg bg-surface-secondary py-6 text-sm text-text-tertiary">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          All requests resolved
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-xs font-medium text-text-tertiary">History ({history.length})</p>
          {history.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-text-primary">{req.employeeName}</span>
                <span className="text-xs text-text-tertiary">{TYPE_LABELS[req.type]}</span>
              </div>
              <Badge variant={req.status === "approved" ? "success" : "danger"} size="sm">
                {req.status === "approved" ? "Approved" : "Rejected"}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setForm(emptyForm); setFormErrors({}); } }}
        title="New Leave Request"
        description="Submit a leave request for an employee."
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            placeholder="Select employee..."
            options={employees.map((e) => ({ value: e.id, label: e.name }))}
            error={formErrors.employeeId}
          />
          <Select
            label="Leave Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as LeaveRequest["type"] })}
            options={[
              { value: "annual", label: "Annual Leave" },
              { value: "sick", label: "Sick Leave" },
              { value: "personal", label: "Personal Leave" },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              error={formErrors.startDate}
            />
            <TextInput
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              error={formErrors.endDate}
            />
          </div>
          <Textarea
            label="Reason"
            placeholder="Reason for leave..."
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            error={formErrors.reason}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => { setModalOpen(false); setForm(emptyForm); setFormErrors({}); }}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
