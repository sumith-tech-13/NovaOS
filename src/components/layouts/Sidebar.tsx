import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Users,
  GitBranch,
  Package,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  X,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "AI Copilot", path: "/copilot", icon: Bot },
  { label: "Prompt Library", path: "/prompts", icon: BookOpen },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Workflow", path: "/workflow", icon: GitBranch },
  { label: "Inventory", path: "/inventory", icon: Package },
  { label: "Documents", path: "/documents", icon: FileText },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { canAccess, logout } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.path));

  const sidebar = (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        className="flex h-screen flex-col border-r border-border bg-surface"
      >
        <div className={cn("flex h-14 items-center border-b border-border px-4", collapsed ? "justify-center" : "gap-3")}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold tracking-tight text-text-primary"
            >
              NovaOS
            </motion.span>
          )}
          {collapsed && <span className="text-sm font-bold text-brand-500">B</span>}
          <button
            onClick={onMobileClose}
            className="ml-auto rounded-lg p-1 text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 h-9",
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-2 space-y-1">
          <button
            onClick={() => { logout(); onMobileClose(); }}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-colors w-full text-text-secondary hover:bg-surface-tertiary hover:text-red-500",
              collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 h-9",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign Out
              </motion.span>
            )}
          </button>
          <button
            onClick={onToggle}
            className="flex h-9 w-full items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen lg:hidden"
            >
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
