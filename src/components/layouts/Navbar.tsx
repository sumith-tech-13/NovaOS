import { useState, useEffect, useCallback } from "react";
import { Search, Moon, Sun, ChevronDown, Command, Menu } from "lucide-react";
import { cn } from "@/utils/cn";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  hr: "HR",
  employee: "Employee",
};

function getProfile() {
  try {
    const stored = localStorage.getItem("settings_profile");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function initials(first: string, last: string) {
  return (first?.charAt(0) ?? "") + (last?.charAt(0) ?? "");
}

export function Navbar({ theme, onToggleTheme, onOpenSearch, onToggleMobileSidebar }: NavbarProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(getProfile);

  const sync = useCallback(() => setProfile(getProfile()), []);

  useEffect(() => {
    window.addEventListener("profile-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("profile-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.name ?? "User";
  const [first, last] = profile
    ? [profile.firstName, profile.lastName]
    : (user?.name?.split(" ") ?? ["U", "s"]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-xl">
      <button
        onClick={onToggleMobileSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <button
        onClick={onOpenSearch}
        className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-1.5 text-sm text-text-tertiary hover:border-brand-500/30 hover:text-text-secondary transition-all w-full max-w-full sm:max-w-md text-left"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1">Search anything...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-tertiary">
          <Command className="h-2.5 w-2.5" />
          K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <NotificationDropdown />

        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[11px] font-medium text-white">
            {initials(first, last)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary leading-none">{displayName}</p>
            <p className="text-xs text-text-tertiary mt-0.5 capitalize">{user ? ROLE_LABELS[user.role] ?? user.role : ""}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
        </div>
      </div>
    </header>
  );
}
