import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Users, UserCircle, Building2, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";

const roleInfo = [
  { role: "manager" as const, label: "Manager", icon: Building2, email: "sumith@novatech.com", desc: "Full access to operations, employees, inventory, analytics, and settings" },
  { role: "hr" as const, label: "HR", icon: Users, email: "priya@novatech.com", desc: "Manage employees, documents, and HR workflows" },
  { role: "employee" as const, label: "Employee", icon: UserCircle, email: "arjun@novatech.com", desc: "Dashboard, AI Copilot, documents, and personal settings" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  function handleLogin(role: (typeof roleInfo)[number]) {
    setSelected(role.role);
    setTimeout(() => {
      login(role.email);
      navigate("/", { replace: true });
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 mb-3">
            <Lock className="h-6 w-6 text-brand-500" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">NovaOS</h1>
          <p className="text-xs text-text-tertiary mt-0.5">Run Your Business. Not Your Busywork.</p>
          <p className="text-sm text-text-secondary mt-4">Choose a role to preview the dashboard</p>
        </div>

        <div className="space-y-3">
          {roleInfo.map((r) => (
            <button
              key={r.role}
              onClick={() => handleLogin(r)}
              disabled={selected !== null}
              className={cn(
                "w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all",
                selected === r.role
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-border bg-surface hover:border-brand-500/30 hover:bg-surface-secondary",
                selected !== null && selected !== r.role && "opacity-40 pointer-events-none",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                <r.icon className="h-5 w-5 text-text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{r.label}</span>
                  <span className="rounded bg-surface-tertiary px-1.5 py-0.5 text-[10px] text-text-tertiary">{r.email}</span>
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">{r.desc}</p>
              </div>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                selected === r.role ? "bg-brand-500 text-white" : "bg-surface-tertiary text-text-tertiary",
              )}>
                <LogIn className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-text-tertiary">
          No password required — pick a role to enter the demo
        </p>
      </motion.div>
    </div>
  );
}
