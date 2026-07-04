import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, LayoutDashboard, Bot, Users, GitBranch, Package, BarChart3, FileText, Settings, User, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { EMPLOYEES, DOCUMENTS } from "@/data";

const PAGE_ACTIONS = [
  { id: "page-dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard, keywords: "home overview" },
  { id: "page-copilot", label: "AI Copilot", path: "/copilot", icon: Bot, keywords: "chat ai assistant" },
  { id: "page-employees", label: "Employees", path: "/employees", icon: Users, keywords: "people team staff" },
  { id: "page-workflow", label: "Workflow", path: "/workflow", icon: GitBranch, keywords: "approval process" },
  { id: "page-inventory", label: "Inventory", path: "/inventory", icon: Package, keywords: "products stock" },
  { id: "page-documents", label: "Documents", path: "/documents", icon: FileText, keywords: "files reports" },
  { id: "page-analytics", label: "Analytics", path: "/analytics", icon: BarChart3, keywords: "charts metrics" },
  { id: "page-settings", label: "Settings", path: "/settings", icon: Settings, keywords: "preferences config" },
];

interface SearchResult {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: typeof LayoutDashboard;
  type: "page" | "employee" | "document";
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results: SearchResult[] = (() => {
    if (!query.trim()) return PAGE_ACTIONS.map((p) => ({ ...p, description: `Go to ${p.label}`, type: "page" as const }));

    const q = query.toLowerCase();
    const r: SearchResult[] = [];

    PAGE_ACTIONS.forEach((p) => {
      if (p.label.toLowerCase().includes(q) || p.keywords.includes(q)) {
        r.push({ ...p, description: `Go to ${p.label}`, type: "page" });
      }
    });

    EMPLOYEES.forEach((e) => {
      if (e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) {
        r.push({
          id: e.id,
          label: e.name,
          description: `${e.role} · ${e.department}`,
          path: "/employees",
          icon: User,
          type: "employee",
        });
      }
    });

    DOCUMENTS.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q))) {
        r.push({
          id: d.id,
          label: d.title,
          description: `${d.type} · ${d.author}`,
          path: "/documents",
          icon: FileText,
          type: "document",
        });
      }
    });

    return r;
  })();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleSelect(item: SearchResult) {
    navigate(item.path);
    onClose();
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIndex, onClose]
  );

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, employees, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-surface-secondary px-1.5 py-0.5 text-[10px] text-text-tertiary">
            <Command className="h-3 w-3" />
            K
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-text-tertiary">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <span className="text-xs">No results found</span>
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={`${item.type}-${item.id}-${i}`}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === selectedIndex
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-text-secondary hover:bg-surface-secondary"
                )}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm truncate", i === selectedIndex ? "font-medium" : "")}>{item.label}</p>
                  <p className="text-xs text-text-tertiary truncat">{item.description}</p>
                </div>
                <span className={cn(
                  "text-[10px] uppercase text-text-tertiary shrink-0",
                  i === selectedIndex && "text-brand-500"
                )}>
                  {item.type}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↵</kbd> Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">Esc</kbd> Close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
