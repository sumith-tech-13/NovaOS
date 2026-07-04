import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthUser, UserRole } from "@/types";

const SEED_USERS: AuthUser[] = [
  { id: "1", name: "Sumith Kumar", email: "sumith@novatech.com", role: "manager" },
  { id: "2", name: "Priya Sharma", email: "priya@novatech.com", role: "hr" },
  { id: "3", name: "Arjun Singh", email: "arjun@novatech.com", role: "employee" },
];

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["*"],
  manager: ["/", "/copilot", "/prompts", "/employees", "/workflow", "/inventory", "/documents", "/analytics", "/settings"],
  hr: ["/", "/copilot", "/prompts", "/employees", "/documents", "/insights", "/settings"],
  employee: ["/", "/copilot", "/prompts", "/documents", "/settings"],
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => AuthUser | null;
  logout: () => void;
  canAccess: (path: string) => boolean;
  users: AuthUser[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const login = useCallback((email: string) => {
    const found = SEED_USERS.find((u) => u.email === email) ?? null;
    if (found) setUser(found);
    return found;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const canAccess = useCallback(
    (path: string) => {
      if (!user) return false;
      const perms = ROLE_PERMISSIONS[user.role];
      if (!perms) return false;
      if (perms[0] === "*") return true;
      return perms.some((p) => path === p || path.startsWith(p + "/") || (p !== "/" && path.startsWith(p)));
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, canAccess, users: SEED_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
