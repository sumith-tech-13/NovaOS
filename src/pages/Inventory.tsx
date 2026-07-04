import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import {
  Search, Sparkles, TrendingUp, TrendingDown,
  Plus, Pencil, Trash2, MoreHorizontal, Inbox,
  AlertTriangle, PackageCheck, RotateCcw, X, ChevronDown,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, AICard, EmptyCard } from "@/components/common/Card";
import { Badge, StatusBadge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Skeleton, SkeletonTable } from "@/components/common/Skeleton";
import { Modal } from "@/components/common/Modal";
import { TextInput, Select } from "@/components/common/Input";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { PRODUCTS } from "@/data";
import { cn } from "@/utils/cn";
import type { Product } from "@/types";

const CATEGORIES = ["All", "Electronics", "Furniture", "Food & Bev", "Office Supplies"];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem("products_data");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const copy = PRODUCTS.map((p) => ({ ...p }));
  localStorage.setItem("products_data", JSON.stringify(copy));
  return copy;
}

let nextProdId = 100;
function generateProdId() {
  return `p${nextProdId++}`;
}

const emptyForm = {
  name: "",
  category: "Electronics",
  price: 0,
  stock: 0,
  minStock: 0,
};

export function Inventory() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [restockModal, setRestockModal] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setProducts(loadProducts());
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem("products_data", JSON.stringify(products));
    }
  }, [products, loading]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, search, category, statusFilter]);

  const lowStock = useMemo(
    () => products.filter((p) => p.status === "low-stock" || p.status === "out-of-stock"),
    [products],
  );

  const totalValue = useMemo(
    () => products.reduce((sum, p) => sum + p.stock * p.price, 0),
    [products],
  );

  const warnLevel = useMemo(() => {
    const ratio = products.length > 0 ? lowStock.length / products.length : 0;
    if (ratio > 0.3) return "danger";
    if (ratio > 0.1) return "warning";
    return "success";
  }, [products, lowStock]);

  function computeStatus(stock: number, minStock: number): Product["status"] {
    if (stock === 0) return "out-of-stock";
    if (stock < minStock) return "low-stock";
    return "in-stock";
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.price <= 0) errors.price = "Price must be greater than 0";
    if (form.stock < 0) errors.stock = "Stock cannot be negative";
    if (form.minStock < 0) errors.minStock = "Min stock cannot be negative";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;
    const status = computeStatus(form.stock, form.minStock);
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...form, status }
            : p,
        ),
      );
    } else {
      const product: Product = {
        id: generateProdId(),
        name: form.name.trim(),
        category: form.category,
        price: form.price,
        stock: form.stock,
        minStock: form.minStock,
        status,
      };
      setProducts((prev) => [product, ...prev]);
    }
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
  }

  function handleRestock(product: Product, qty: number) {
    if (qty <= 0) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, stock: p.stock + qty, status: computeStatus(p.stock + qty, p.minStock) }
          : p,
      ),
    );
    setRestockModal(null);
    setRestockQty(0);
  }

  function handleAutoRestockAll() {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.status === "low-stock" || p.status === "out-of-stock") {
          const restockTo = Math.max(p.minStock * 2, p.minStock + 20);
          const added = restockTo - p.stock;
          return { ...p, stock: p.stock + added, status: "in-stock" };
        }
        return p;
      }),
    );
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setOpenMenuId(null);
  }

  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
  }

  const stockHealthPct = products.length > 0
    ? Math.round((products.filter((p) => p.status === "in-stock").length / products.length) * 100)
    : 0;

  const stockChartData = useMemo(
    () => products.map((p) => ({ name: p.name, stock: p.stock, minStock: p.minStock })),
    [products]
  );

  const categoryDistData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [products]);

  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];
  const axisStyle = { fontSize: 11, fill: "var(--color-text-tertiary)" };

  function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm text-xs">
        <p className="text-text-secondary mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name === "stock" || entry.name === "minStock" ? `${entry.value} units` : entry.value}
          </p>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">
        <div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-64 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <SkeletonTable rows={5} />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto">

      {/* --- Header --- */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Inventory</h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage products and stock levels</p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* --- Summary Stats Row --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Total Products</p>
          <p className="text-xl font-semibold text-text-primary mt-1">{products.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Total Value</p>
          <p className="text-xl font-semibold text-text-primary mt-1">₹{totalValue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Low / Out</p>
          <p className="text-xl font-semibold text-text-primary mt-1">
            <span className={lowStock.length > 0 ? "text-warning-500" : "text-text-primary"}>{lowStock.length}</span>
            <span className="text-xs text-text-tertiary ml-1 font-normal">items</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Stock Health</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  warnLevel === "danger" ? "bg-danger-500" : warnLevel === "warning" ? "bg-warning-500" : "bg-success-500",
                )}
                style={{ width: `${stockHealthPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-text-primary">{stockHealthPct}%</span>
          </div>
        </div>
      </div>

      {/* --- Low Stock Alert Banner --- */}
      <AnimatePresence>
        {lowStock.length > 0 && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4",
              warnLevel === "danger"
                ? "border-danger-500/30 bg-danger-500/5"
                : "border-warning-500/30 bg-warning-500/5",
            )}
          >
            <AlertTriangle className={cn("h-5 w-5 shrink-0 mt-0.5", warnLevel === "danger" ? "text-danger-500" : "text-warning-500")} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {lowStock.length} {lowStock.length === 1 ? "product is" : "products are"} running low on stock
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {lowStock.filter((p) => p.status === "out-of-stock").length} out of stock,{" "}
                {lowStock.filter((p) => p.status === "low-stock").length} below minimum threshold.
                {lowStock.length > 2 && <span className="text-text-tertiary"> Auto-restock recommended.</span>}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleAutoRestockAll}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Auto-Restock All
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setBannerDismissed(true)}>
                  Dismiss
                </Button>
              </div>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="shrink-0 rounded-lg p-1 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Stock Levels</h3>
              <p className="text-xs text-text-secondary mt-0.5">Current stock vs minimum threshold</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChartData} layout="vertical" barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={130} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="stock" fill="#6366f1" radius={[0, 4, 4, 0]} name="stock" />
                <Bar dataKey="minStock" fill="#f59e0b" radius={[0, 4, 4, 0]} name="minStock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-[#6366f1]" />
              Current Stock
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-[#f59e0b]" />
              Min Threshold
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Category Distribution</h3>
              <p className="text-xs text-text-secondary mt-0.5">Products by category</p>
            </div>
          </div>
          <div className="h-72 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {categoryDistData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {categoryDistData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name}: {d.count}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">

          {/* --- Filters --- */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-9 w-full rounded-lg border border-border bg-surface-secondary pl-9 pr-8 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    category === c
                      ? "bg-brand-600 text-white"
                      : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 border-l border-border pl-3">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === s.value
                      ? "bg-surface-tertiary text-text-primary"
                      : "text-text-tertiary hover:text-text-secondary",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* --- Empty / Table --- */}
          {filtered.length === 0 ? (
            <EmptyCard
              icon={Inbox}
              title="No products found"
              description={search || category !== "All" || statusFilter !== "all" ? "Try a different search or filter." : "Add your first product to get started."}
            >
              {!search && category === "All" && statusFilter === "all" && (
                <Button size="sm" onClick={openAddModal}>
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              )}
            </EmptyCard>
          ) : (
            <Card hover={false} className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary">Category</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Price</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Stock</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Min</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary">Status</th>
                      <th className="w-20 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => {
                      const stockRatio = product.minStock > 0 ? product.stock / product.minStock : 1;
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-border last:border-0 hover:bg-surface-secondary transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-text-primary">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-text-secondary">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-text-primary text-right font-mono">₹{product.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={cn(
                                "text-sm font-mono",
                                product.status === "out-of-stock" ? "text-danger-500" : product.status === "low-stock" ? "text-warning-500" : "text-text-primary",
                              )}>
                                {product.stock}
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-surface-tertiary overflow-hidden hidden sm:block">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    product.status === "out-of-stock" ? "bg-danger-500" : product.status === "low-stock" ? "bg-warning-500" : "bg-success-500",
                                  )}
                                  style={{ width: `${Math.min(stockRatio * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary text-right">{product.minStock}</td>
                          <td className="px-4 py-3 text-right">
                            <StatusBadge status={product.status} />
                          </td>
                          <td className="px-4 py-3 text-right relative">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => { setRestockModal(product); setRestockQty(Math.max(product.minStock, 10)); }}
                                className="rounded-lg p-1.5 text-text-tertiary hover:text-success-500 hover:bg-success-500/10 transition-colors"
                                title="Restock"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                            {openMenuId === product.id && (
                              <div className="absolute right-4 top-full z-50 mt-1 w-32 rounded-lg border border-border bg-surface py-1 shadow-lg">
                                <button
                                  onClick={() => { openEditModal(product); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-surface-secondary transition-colors text-left"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => { setRestockModal(product); setRestockQty(Math.max(product.minStock, 10)); setOpenMenuId(null); }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-surface-secondary transition-colors text-left"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  Restock
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors text-left"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="text-xs text-text-tertiary">{filtered.length} of {products.length} products</div>
        </div>

        {/* --- Right Sidebar --- */}
        <div className="space-y-4">
          <AICard title="Inventory Intelligence">
            <div className="space-y-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                AI detected <span className="text-warning-400 font-medium">{lowStock.length} products</span> below minimum threshold. Restocking is recommended.
              </p>
              {lowStock.length > 0 ? (
                <div className="space-y-2">
                  {lowStock.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-surface-secondary p-2.5">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">{p.name}</p>
                        <p className="text-[11px] text-text-tertiary">{p.stock} remaining (min: {p.minStock})</p>
                      </div>
                      <Badge variant={p.status === "out-of-stock" ? "danger" : "warning"} size="sm">{p.stock === 0 ? "Out" : "Low"}</Badge>
                    </div>
                  ))}
                  {lowStock.length > 3 && (
                    <p className="text-[11px] text-text-tertiary text-center">+{lowStock.length - 3} more items</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-success-500" />
                  <p className="text-xs text-success-400">All products are above minimum thresholds.</p>
                </div>
              )}
              {lowStock.length > 0 && (
                <Button size="sm" className="w-full" onClick={handleAutoRestockAll}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Auto-Restock All
                </Button>
              )}
            </div>
          </AICard>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-text-secondary" />
              <h3 className="text-xs font-semibold text-text-primary">Stock Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">In Stock</span>
                <span className="text-text-primary font-medium">{products.filter((p) => p.status === "in-stock").length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Low Stock</span>
                <span className="text-warning-500 font-medium">{products.filter((p) => p.status === "low-stock").length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Out of Stock</span>
                <span className="text-danger-500 font-medium">{products.filter((p) => p.status === "out-of-stock").length}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <CircularProgress percentage={stockHealthPct} size={80} strokeWidth={5} label="Health" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- Add/Edit Modal --- */}
      <Modal
        open={modalOpen}
        onOpenChange={(open) => { if (!open) handleCloseModal(); }}
        title={editingProduct ? "Edit Product" : "Add Product"}
        description={editingProduct ? "Update product information." : "Add a new product to inventory."}
      >
        <div className="space-y-4">
          <TextInput
            label="Product Name"
            placeholder="e.g. Wireless Keyboard"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))}
          />
          <div className="grid grid-cols-3 gap-3">
            <TextInput
              label="Price (₹)"
              type="number"
              min={0}
              placeholder="0"
              value={String(form.price)}
              onChange={(e) => setForm({ ...form, price: Math.max(0, Number(e.target.value) || 0) })}
              error={formErrors.price}
            />
            <TextInput
              label="Stock"
              type="number"
              min={0}
              placeholder="0"
              value={String(form.stock)}
              onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value) || 0) })}
              error={formErrors.stock}
            />
            <TextInput
              label="Min Stock"
              type="number"
              min={0}
              placeholder="0"
              value={String(form.minStock)}
              onChange={(e) => setForm({ ...form, minStock: Math.max(0, Number(e.target.value) || 0) })}
              error={formErrors.minStock}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- Restock Modal --- */}
      <Modal
        open={!!restockModal}
        onOpenChange={(open) => { if (!open) { setRestockModal(null); setRestockQty(0); } }}
        title={`Restock ${restockModal?.name ?? ""}`}
        description="Add units to this product's inventory."
      >
        <div className="space-y-4">
          {restockModal && (
            <>
              <div className="flex items-center gap-4 rounded-lg bg-surface-secondary p-3">
                <div className="flex-1">
                  <p className="text-xs text-text-tertiary">Current Stock</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    restockModal.status === "out-of-stock" ? "text-danger-500" : restockModal.status === "low-stock" ? "text-warning-500" : "text-text-primary",
                  )}>
                    {restockModal.stock}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-tertiary">Min Stock</p>
                  <p className="text-lg font-semibold text-text-primary">{restockModal.minStock}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-tertiary">Status</p>
                  <StatusBadge status={restockModal.status} />
                </div>
              </div>
              <TextInput
                label="Quantity to Add"
                type="number"
                min={1}
                value={String(restockQty)}
                onChange={(e) => setRestockQty(Math.max(1, Number(e.target.value) || 1))}
                placeholder="Enter quantity"
              />
              <p className="text-xs text-text-tertiary">
                After restock: <strong className="text-text-primary">{restockModal.stock + Math.max(1, restockQty)}</strong> units
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => { setRestockModal(null); setRestockQty(0); }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleRestock(restockModal, Math.max(1, restockQty))}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restock
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}