import { motion } from "framer-motion";
import { FileText, FileCheck, FileSignature, FileSpreadsheet, FilePen, File, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import type { DocumentItem } from "@/types";
import { Badge } from "@/components/common/Badge";

const TYPE_ICONS: Record<string, typeof FileText> = {
  report: FileText,
  policy: FileCheck,
  invoice: FileSpreadsheet,
  contract: FileSignature,
  memo: FilePen,
  proposal: File,
};

const TYPE_COLORS: Record<string, string> = {
  report: "text-blue-500 bg-blue-500/10",
  policy: "text-violet-500 bg-violet-500/10",
  invoice: "text-green-500 bg-green-500/10",
  contract: "text-amber-500 bg-amber-500/10",
  memo: "text-rose-500 bg-rose-500/10",
  proposal: "text-cyan-500 bg-cyan-500/10",
};

const TYPE_LABELS: Record<string, string> = {
  report: "Report",
  policy: "Policy",
  invoice: "Invoice",
  contract: "Contract",
  memo: "Memo",
  proposal: "Proposal",
};

interface DocumentCardProps {
  document: DocumentItem;
  onSelect: (doc: DocumentItem) => void;
}

export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  const Icon = TYPE_ICONS[document.type] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer rounded-xl border border-border bg-surface p-4 transition-all hover:border-brand-500/30 hover:shadow-sm"
      onClick={() => onSelect(document)}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", TYPE_COLORS[document.type])}>
          <Icon className="h-5 w-5" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="rounded-lg p-1 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-tertiary hover:text-text-primary"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <h3 className="mt-3 text-sm font-medium text-text-primary line-clamp-2">{document.title}</h3>

      <div className="mt-2 flex items-center gap-2 text-xs text-text-tertiary">
        <span>{TYPE_LABELS[document.type]}</span>
        <span>·</span>
        <span>{document.updatedAt}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {document.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
        ))}
        {document.tags.length > 2 && (
          <Badge variant="secondary" size="sm">+{document.tags.length - 2}</Badge>
        )}
      </div>
    </motion.div>
  );
}
