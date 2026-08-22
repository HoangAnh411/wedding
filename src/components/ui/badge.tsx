import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "default";
  children: string;
}

const variants = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/50",
  danger: "bg-rose-50 text-rose-700 border border-rose-200/50",
  info: "bg-blue-50 text-blue-700 border border-blue-200/50",
  default: "bg-primary/5 text-primary border border-primary/20",
};

export function Badge({ variant = "default", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}