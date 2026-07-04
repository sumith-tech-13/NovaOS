import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2, Clock, XCircle, ChevronDown, GitBranch, Building2, Plane, Package, ShoppingCart, Plus, AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import { Modal } from "@/components/common/Modal";
import { TextInput, Select } from "@/components/common/Input";
import { WORKFLOWS } from "@/data";
import { cn } from "@/utils/cn";
import type { Workflow, WorkflowStep } from "@/types";

const typeConfig = {
  leave: { icon: Plane, label: "Leave Request", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" },
  expense: { icon: Package, label: "Expense Claim", color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20" },
  purchase: { icon: ShoppingCart, label: "Purchase Order", color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20" },
  order: { icon: Building2, label: "Customer Order", color: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20" },
};

const stepIcons = {
  completed: CheckCircle2,
  active: Clock,
  pending: XCircle,
};

const DEFAULT_STEPS: Record<string, WorkflowStep[]> = {
  leave: [
    { label: "Submitted", status: "completed" },
    { label: "AI Validation", status: "active" },
    { label: "Manager Review", status: "pending" },
    { label: "Approved", status: "pending" },
    { label: "Notification Sent", status: "pending" },
  ],
  expense: [
    { label: "Submitted", status: "completed" },
    { label: "AI Validation", status: "active" },
    { label: "Finance Review", status: "pending" },
    { label: "Approved", status: "pending" },
    { label: "Payment Initiated", status: "pending" },
  ],
  purchase: [
    { label: "Submitted", status: "completed" },
    { label: "AI Validation", status: "active" },
    { label: "Manager Review", status: "pending" },
    { label: "Finance Approval", status: "pending" },
    { label: "PO Generated", status: "pending" },
  ],
  order: [
    { label: "Order Placed", status: "completed" },
    { label: "AI Verification", status: "active" },
    { label: "Inventory Check", status: "pending" },
    { label: "Packing", status: "pending" },
    { label: "Shipped", status: "pending" },
  ],
};

function loadWorkflows(): Workflow[] {
  try {
    const stored = localStorage.getItem("workflows_data");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const copy = WORKFLOWS.map((w) => ({ ...w, steps: w.steps.map((s) => ({ ...s })) }));
  localStorage.setItem("workflows_data", JSON.stringify(copy));
  return copy;
}

let nextWfId = 100;
function generateWfId() {
  return `wf${nextWfId++}`;
}

export function Workflow() {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<Workflow["type"]>("leave");
  const [titleError, setTitleError] = useState("");

  const wfStatusData = useMemo(() => {
    const map: Record<string, number> = {};
    workflows.forEach((w) => { map[w.status] = (map[w.status] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));
  }, [workflows]);

  const wfTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    workflows.forEach((w) => { map[typeConfig[w.type].label] = (map[typeConfig[w.type].label] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [workflows]);

  useEffect(() => {
    const t = setTimeout(() => {
      const data = loadWorkflows();
      setWorkflows(data);
      if (data.length > 0) setExpanded(data[0].id);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && workflows.length > 0) {
      localStorage.setItem("workflows_data", JSON.stringify(workflows));
    }
  }, [workflows, loading]);

  const handleApprove = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: "approved" as const,
              steps: w.steps.map((s) =>
                s.status === "active" || s.status === "pending"
                  ? { ...s, status: "completed" as const, timestamp: s.timestamp || "Just now" }
                  : s,
              ),
            }
          : w,
      ),
    );
  };

  const handleReject = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: "rejected" as const }
          : w,
      ),
    );
  };

  const handleCreate = () => {
    if (!newTitle.trim()) {
      setTitleError("Title is required");
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const workflow: Workflow = {
      id: generateWfId(),
      type: newType,
      title: newTitle.trim(),
      status: "pending",
      steps: DEFAULT_STEPS[newType].map((s) => ({ ...s })),
      createdAt: now,
    };
    setWorkflows((prev) => [workflow, ...prev]);
    setExpanded(workflow.id);
    setModalOpen(false);
    setNewTitle("");
    setNewType("leave");
    setTitleError("");
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Workflows</h1>
          <p className="text-sm text-text-secondary mt-0.5">Automate and track business processes</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
          <GitBranch className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-surface">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary">
            <AlertCircle className="h-6 w-6 text-text-tertiary" />
          </div>
          <p className="mt-4 text-sm font-medium text-text-primary">No workflows yet</p>
          <p className="mt-1 text-sm text-text-secondary">Create your first workflow to start tracking business processes.</p>
          <Button className="mt-4" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => {
            const config = typeConfig[wf.type];
            const Icon = config.icon;
            const isExpanded = expanded === wf.id;

            return (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all",
                    wf.status === "rejected" && "border-danger-500/30",
                    wf.status === "approved" && "border-success-500/30",
                  )}
                  onClick={() => setExpanded(isExpanded ? null : wf.id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between mb-0">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.color)}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{wf.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{config.label} · {wf.createdAt}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          wf.status === "approved" ? "success" :
                          wf.status === "rejected" ? "danger" : "warning"
                        }
                        size="sm"
                      >
                        {wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}
                      </Badge>
                      <ChevronDown className={cn("h-4 w-4 text-text-tertiary transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="mt-4">
                      <div className="relative pl-6 space-y-0">
                        <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />
                        {wf.steps.map((step, i) => {
                          const StepIcon = stepIcons[step.status];
                          return (
                            <div key={i} className="relative flex items-start gap-3 pb-6 last:pb-0">
                              <div
                                className={cn(
                                  "absolute -left-[19px] flex h-5 w-5 items-center justify-center rounded-full border-2 z-10",
                                  step.status === "completed"
                                    ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                                    : step.status === "active"
                                    ? "border-brand-500 bg-surface"
                                    : "border-border bg-surface",
                                )}
                              >
                                <StepIcon
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    step.status === "completed" && "text-success-600 dark:text-success-400",
                                    step.status === "active" && "text-brand-600 dark:text-brand-400",
                                    step.status === "pending" && "text-text-tertiary",
                                  )}
                                />
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <p
                                  className={cn(
                                    "text-sm",
                                    step.status === "completed" && "text-text-primary",
                                    step.status === "active" && "text-brand-600 dark:text-brand-400 font-medium",
                                    step.status === "pending" && "text-text-tertiary",
                                  )}
                                >
                                  {step.label}
                                </p>
                                {step.timestamp && (
                                  <p className="text-xs text-text-tertiary mt-0.5">{step.timestamp}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {wf.status === "pending" && (
                        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(wf.id); }}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleReject(wf.id); }}>
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* --- Charts --- */}
      <WorkflowCharts statusData={wfStatusData} typeData={wfTypeData} />

      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) { setModalOpen(false); setNewTitle(""); setNewType("leave"); setTitleError(""); } }}
        title="New Workflow"
        description="Create a new automated business workflow."
      >
        <div className="space-y-4">
          <TextInput
            label="Title"
            placeholder="e.g. Annual Leave — John Doe"
            value={newTitle}
            onChange={(e) => { setNewTitle(e.target.value); setTitleError(""); }}
            error={titleError}
          />
          <Select
            label="Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value as Workflow["type"])}
            options={[
              { value: "leave", label: "Leave Request" },
              { value: "expense", label: "Expense Claim" },
              { value: "purchase", label: "Purchase Order" },
              { value: "order", label: "Customer Order" },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => { setModalOpen(false); setNewTitle(""); setNewType("leave"); setTitleError(""); }}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              <GitBranch className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

const WF_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444"];
const wfAxisStyle = { fontSize: 11, fill: "var(--color-text-tertiary)" };

function WFChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-medium">{entry.value}</p>
      ))}
    </div>
  );
}

function WorkflowCharts({ statusData, typeData }: { statusData: { name: string; count: number }[]; typeData: { name: string; count: number }[] }) {
  if (statusData.length === 0 && typeData.length === 0) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Workflow Status</h3>
            <p className="text-xs text-text-secondary mt-0.5">{statusData.reduce((s, d) => s + d.count, 0)} total workflows</p>
          </div>
        </div>
        <div className="h-64 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={WF_COLORS[i % WF_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<WFChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: WF_COLORS[i % WF_COLORS.length] }} />
                {d.name}: {d.count}
              </div>
            ))}
          </div>
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
            <h3 className="text-sm font-semibold text-text-primary">Workflows by Type</h3>
            <p className="text-xs text-text-secondary mt-0.5">Breakdown by workflow category</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={wfAxisStyle} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={wfAxisStyle} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<WFChartTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {typeData.map((_, i) => (
                  <Cell key={i} fill={WF_COLORS[i % WF_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
