import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Bot, GitBranch, Package, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Bot, title: "AI Employee Copilot", desc: "Generate reports, draft emails, and get business insights instantly." },
  { icon: GitBranch, title: "Workflow Automation", desc: "Auto-approve leave, expenses, and purchase orders with AI validation." },
  { icon: Package, title: "Smart Inventory", desc: "Real-time stock tracking with predictive alerts before you run out." },
  { icon: BarChart3, title: "Predictive Analytics", desc: "Revenue forecasts and growth insights powered by AI." },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="text-sm font-semibold text-text-primary">NovaOS</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign in</Link>
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-text-secondary mb-6">
            <Sparkles className="h-3 w-3 text-brand-500" />
            AI-Powered Business Operating System
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
            Run Your Business.
            <br />
            <span className="text-brand-600">Not Your Busywork.</span>
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            NovaOS automates reports, approvals, inventory, and insights — 
            so your team can focus on growing the business, not managing tools.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/login">
                Launch Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="#features">See How It Works</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          id="features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-5 hover:shadow-sm transition-shadow">
              <f.icon className="h-5 w-5 text-brand-600 mb-3" />
              <h3 className="text-sm font-semibold text-text-primary mb-1">{f.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
