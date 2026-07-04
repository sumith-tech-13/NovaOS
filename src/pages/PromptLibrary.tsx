import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Bot, Settings2, Users, Receipt, LayoutGrid, Pencil, Trash2, Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { PROMPT_LIBRARY } from "@/data";
import { TextInput, Textarea, Select } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Skeleton } from "@/components/common/Skeleton";
import type { PromptLibraryItem } from "@/types";

const CATEGORIES = [
  { value: "all", label: "All Prompts", icon: LayoutGrid },
  { value: "operations", label: "Operations", icon: Settings2 },
  { value: "sales", label: "Sales & Marketing", icon: Bot },
  { value: "hr", label: "HR & Team", icon: Users },
  { value: "finance", label: "Finance", icon: Receipt },
  { value: "custom", label: "Custom", icon: Sparkles },
];

const CATEGORY_COLORS: Record<string, string> = {
  operations: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  sales: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  hr: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
  finance: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  custom: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20",
};

let nextId = 100;

function generateId() {
  return `p${nextId++}`;
}

function getInitials(): PromptLibraryItem[] {
  try {
    const stored = localStorage.getItem("prompt_library");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const copy = PROMPT_LIBRARY.map((p) => ({ ...p }));
  localStorage.setItem("prompt_library", JSON.stringify(copy));
  return copy;
}

const emptyPrompt: Omit<PromptLibraryItem, "id" | "createdAt" | "updatedAt"> = {
  category: "custom",
  title: "",
  content: "",
  description: "",
};

export function PromptLibrary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<PromptLibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PromptLibraryItem | null>(null);
  const [form, setForm] = useState<Omit<PromptLibraryItem, "id" | "createdAt" | "updatedAt">>({ ...emptyPrompt });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const t = setTimeout(() => {
      setPrompts(getInitials());
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  function persist(data: PromptLibraryItem[]) {
    setPrompts(data);
    localStorage.setItem("prompt_library", JSON.stringify(data));
  }

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const matchesSearch = search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [prompts, search, activeCategory]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyPrompt });
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(prompt: PromptLibraryItem) {
    setEditing(prompt);
    setForm({ category: prompt.category, title: prompt.title, content: prompt.content, description: prompt.description });
    setFormErrors({});
    setModalOpen(true);
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.content.trim()) errors.content = "Prompt content is required";
    if (!form.description.trim()) errors.description = "Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      const updated = prompts.map((p) =>
        p.id === editing.id
          ? { ...p, ...form, updatedAt: now }
          : p,
      );
      persist(updated);
    } else {
      const created: PromptLibraryItem = {
        id: generateId(),
        ...form,
        createdAt: now,
        updatedAt: now,
      };
      persist([created, ...prompts]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    persist(prompts.filter((p) => p.id !== id));
  }

  function handleUsePrompt(prompt: PromptLibraryItem) {
    localStorage.setItem("copilot_prompt", prompt.content);
    navigate("/copilot");
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Prompt Library</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create, manage, and use AI prompts for your business workflows.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  activeCategory === cat.value
                    ? "bg-surface-tertiary text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="h-9 w-full rounded-lg border border-border bg-surface-secondary pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary">
            <Search className="h-6 w-6 text-text-tertiary" />
          </div>
          <p className="mt-4 text-sm font-medium text-text-primary">No prompts found</p>
          <p className="mt-1 text-sm text-text-secondary">
            {search ? "Try a different search term." : "Create your first prompt to get started."}
          </p>
          {!search && (
            <Button className="mt-4" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create Prompt
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((prompt, i) => {
              const catInfo = CATEGORIES.find((c) => c.value === prompt.category);
              return (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="group relative rounded-xl border border-border bg-surface p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", CATEGORY_COLORS[prompt.category])}>
                        {catInfo && <catInfo.icon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-text-primary truncate">{prompt.title}</h3>
                        <span className="text-[10px] text-text-tertiary capitalize">{catInfo?.label || prompt.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => openEdit(prompt)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary line-clamp-2 flex-1">{prompt.description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-[10px] text-text-tertiary">Updated {prompt.updatedAt}</span>
                    <button
                      onClick={() => handleUsePrompt(prompt)}
                      className="flex items-center gap-1 rounded-md bg-brand-500/10 px-2 py-1 text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      Use in Copilot
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Prompt" : "New Prompt"}
        description={editing ? "Update your saved prompt." : "Create a reusable AI prompt for your team."}
      >
        <div className="space-y-4">
          <TextInput
            label="Title"
            placeholder="e.g. Weekly Sales Report"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={formErrors.title}
          />
          <TextInput
            label="Description"
            placeholder="Brief description of what this prompt does"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={formErrors.description}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as PromptLibraryItem["category"] })}
            options={[
              { value: "operations", label: "Operations" },
              { value: "sales", label: "Sales & Marketing" },
              { value: "hr", label: "HR & Team" },
              { value: "finance", label: "Finance" },
              { value: "custom", label: "Custom" },
            ]}
          />
          <Textarea
            label="Prompt Content"
            placeholder="Write the full prompt text that will be sent to the AI..."
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            error={formErrors.content}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {editing ? "Save Changes" : "Create Prompt"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}