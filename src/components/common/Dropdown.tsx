import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";

interface DropdownItem {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "end" | "center";
}

export function Dropdown({ trigger, items, align = "end" }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={4}
          className={cn(
            "z-50 min-w-[180px] rounded-lg border border-border bg-surface-secondary p-1 shadow-lg",
            "animate-in",
          )}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.separator && i > 0 && (
                <div className="my-1 border-t border-border" />
              )}
              <DropdownMenu.Item
                disabled={item.disabled}
                onClick={item.onClick}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer transition-colors",
                  "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
                  item.variant === "danger"
                    ? "text-danger-500 data-[highlighted]:bg-danger-50 dark:data-[highlighted]:bg-danger-900/20"
                    : "text-text-secondary data-[highlighted]:bg-surface-tertiary data-[highlighted]:text-text-primary",
                )}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                {item.label}
              </DropdownMenu.Item>
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
