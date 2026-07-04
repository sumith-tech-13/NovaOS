import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { DocumentItem } from "@/types";
import { DocumentCard } from "./DocumentCard";

const DOC_TYPES = ["all", "report", "policy", "invoice", "contract", "memo", "proposal"] as const;
const TYPE_LABELS: Record<string, string> = {
  all: "All Types",
  report: "Reports",
  policy: "Policies",
  invoice: "Invoices",
  contract: "Contracts",
  memo: "Memos",
  proposal: "Proposals",
};

interface DocumentListProps {
  documents: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
}

export function DocumentList({ documents, onSelect }: DocumentListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = [...documents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.title.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)));
    }
    if (typeFilter !== "all") result = result.filter((d) => d.type === typeFilter);
    return result;
  }, [documents, search, typeFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-surface-secondary pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-surface-secondary pl-3 pr-8 text-sm text-text-primary focus:border-brand-500 focus:outline-none"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onSelect={onSelect} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-16 text-sm text-text-tertiary">
          No documents found matching your search.
        </div>
      )}
    </div>
  );
}
