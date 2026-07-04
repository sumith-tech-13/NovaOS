import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-text-secondary">{label}</label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className="h-4 w-4 text-text-tertiary" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-9 w-full rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors",
              "focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-9",
              error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-text-secondary">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors resize-y",
            "focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-text-secondary">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text-primary outline-none transition-colors",
            "focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-500",
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          ref={ref}
          type="text"
          className={cn(
            "h-9 w-full rounded-lg border border-border bg-surface-secondary pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors",
            "focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-border bg-surface-secondary text-brand-600 outline-none",
            "focus:ring-1 focus:ring-brand-500 focus:ring-offset-1 focus:ring-offset-surface",
            "cursor-pointer",
            className,
          )}
          {...props}
        />
        {label && <span className="text-sm text-text-primary">{label}</span>}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, label, disabled }: SwitchProps) {
  return (
    <label className={cn("flex items-center gap-2", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
      <button
        type="button"
        role="switch"
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          checked ? "bg-brand-600" : "bg-surface-tertiary",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
}
