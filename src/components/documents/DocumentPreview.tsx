import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/utils/cn";
import type { DocumentItem } from "@/types";
import { Badge } from "@/components/common/Badge";

const TYPE_LABELS: Record<string, string> = {
  report: "Report",
  policy: "Policy",
  invoice: "Invoice",
  contract: "Contract",
  memo: "Memo",
  proposal: "Proposal",
};

interface DocumentPreviewProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  return (
    <AnimatePresence>
      {document && (
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
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-text-primary truncate">{document.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {document.author}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {document.updatedAt}
                  </span>
                  <span>·</span>
                  <Badge variant="secondary" size="sm">{TYPE_LABELS[document.type]}</Badge>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.content}
                </ReactMarkdown>
              </div>
            </div>

            {document.tags.length > 0 && (
              <div className="flex items-center gap-1.5 border-t border-border px-5 py-3">
                <Tag className="h-3.5 w-3.5 text-text-tertiary" />
                {document.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
