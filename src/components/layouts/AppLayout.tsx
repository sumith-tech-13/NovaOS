import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useTheme } from "@/hooks/useTheme";
import { TimelineProvider } from "@/contexts/TimelineContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CommandPalette } from "@/components/search/CommandPalette";
import { cn } from "@/utils/cn";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <TimelineProvider>
      <NotificationProvider>
        <div className="flex h-screen overflow-hidden bg-surface">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <div
            className={cn(
              "flex flex-1 flex-col min-w-0 transition-all duration-300",
            )}
          >
            <Navbar
              theme={theme}
              onToggleTheme={toggle}
              onOpenSearch={() => setPaletteOpen(true)}
              onToggleMobileSidebar={() => setMobileSidebarOpen((p) => !p)}
            />
            <main className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </NotificationProvider>
    </TimelineProvider>
  );
}
