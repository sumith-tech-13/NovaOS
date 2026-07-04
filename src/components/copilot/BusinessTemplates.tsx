import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, BarChart3, Package, Mail, CreditCard, Users, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { BUSINESS_TEMPLATES } from "@/data";
import type { BusinessTemplate } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  "file-text": FileText,
  "bar-chart": BarChart3,
  package: Package,
  mail: Mail,
  "credit-card": CreditCard,
  users: Users,
  "check-circle": CheckCircle,
};

const categoryColors: Record<string, string> = {
  reports: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  communications: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  operations: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
};

const categoryLabels: Record<string, string> = {
  reports: "Reports",
  communications: "Communications",
  operations: "Operations",
};

interface BusinessTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

export function BusinessTemplates({ onSelectTemplate }: BusinessTemplatesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", "reports", "communications", "operations"];
  const filtered = activeCategory === "all"
    ? BUSINESS_TEMPLATES
    : BUSINESS_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div>
      <div className="mb-3 flex gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              activeCategory === cat
                ? "bg-surface-tertiary text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary",
            )}
          >
            {cat === "all" ? "All" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((template, i) => {
          const Icon = iconMap[template.icon] || Sparkles;
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelectTemplate(template.prompt)}
              className="w-full text-left flex items-start gap-2.5 rounded-lg border border-border bg-surface-secondary p-2.5 hover:border-border-hover hover:shadow-sm transition-all duration-200"
            >
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", categoryColors[template.category])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-text-primary">{template.label}</span>
                <p className="text-[10px] text-text-tertiary mt-0.5 leading-snug line-clamp-1">{template.description}</p>
              </div>
              <ArrowRight className="h-3 w-3 text-text-tertiary shrink-0 mt-1" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
