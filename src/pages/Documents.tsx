import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, FileCheck, FileSignature, FileSpreadsheet, FilePen, File } from "lucide-react";
import { cn } from "@/utils/cn";
import { DOCUMENTS } from "@/data";
import type { DocumentItem } from "@/types";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { DocumentGenerator } from "@/components/documents/DocumentGenerator";
import { Skeleton } from "@/components/common/Skeleton";

const TYPE_STATS = [
  { label: "Reports", count: DOCUMENTS.filter((d) => d.type === "report").length, icon: FileText, color: "text-blue-500" },
  { label: "Policies", count: DOCUMENTS.filter((d) => d.type === "policy").length, icon: FileCheck, color: "text-violet-500" },
  { label: "Invoices", count: DOCUMENTS.filter((d) => d.type === "invoice").length, icon: FileSpreadsheet, color: "text-green-500" },
  { label: "Contracts", count: DOCUMENTS.filter((d) => d.type === "contract").length, icon: FileSignature, color: "text-amber-500" },
  { label: "Memos", count: DOCUMENTS.filter((d) => d.type === "memo").length, icon: FilePen, color: "text-rose-500" },
  { label: "Proposals", count: DOCUMENTS.filter((d) => d.type === "proposal").length, icon: File, color: "text-cyan-500" },
];

export function Documents() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DocumentItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
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
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Documents</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Browse, preview, and generate business documents.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {TYPE_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-surface p-3 text-center"
          >
            <stat.icon className={cn("mx-auto h-4 w-4", stat.color)} />
            <p className="mt-1 text-lg font-semibold text-text-primary">{stat.count}</p>
            <p className="text-[10px] text-text-tertiary">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DocumentList documents={DOCUMENTS} onSelect={setSelected} />
        </div>
        <div>
          <DocumentGenerator />
        </div>
      </div>

      <DocumentPreview document={selected} onClose={() => setSelected(null)} />
    </motion.div>
  );
}
