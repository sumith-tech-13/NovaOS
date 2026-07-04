import * as ToastPrimitive from "@radix-ui/react-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { useState, useCallback, createContext, useContext } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  addToast: (title: string, options?: { description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles = {
  success: "border-success-500/20",
  error: "border-danger-500/20",
  warning: "border-warning-500/20",
  info: "border-info-500/20",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (title: string, options?: { description?: string; variant?: ToastVariant }) => {
      const id = crypto.randomUUID();
      const toast: Toast = {
        id,
        title,
        description: options?.description,
        variant: options?.variant || "info",
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.variant];
            return (
              <ToastPrimitive.Root
                key={toast.id}
                open
                onOpenChange={() => removeToast(toast.id)}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={cn(
                    "pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface p-4 shadow-lg",
                    variantStyles[toast.variant],
                  )}
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0 text-text-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{toast.title}</p>
                    {toast.description && (
                      <p className="text-xs text-text-secondary mt-0.5">{toast.description}</p>
                    )}
                  </div>
                  <ToastPrimitive.Close className="shrink-0 rounded p-0.5 text-text-tertiary hover:text-text-primary">
                    <X className="h-3.5 w-3.5" />
                  </ToastPrimitive.Close>
                </motion.div>
              </ToastPrimitive.Root>
            );
          })}
        </AnimatePresence>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
