import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const variants = {
  default: "border-gray-200 bg-white",
  success: "border-green-200 bg-green-50",
  warning: "border-yellow-200 bg-yellow-50",
  danger: "border-red-200 bg-red-50",
};

const valueColors = {
  default: "text-gray-900",
  success: "text-green-700",
  warning: "text-yellow-700",
  danger: "text-red-700",
};

export function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border p-5", variants[variant])}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={cn("mt-3 text-2xl font-bold", valueColors[variant])}>{value}</p>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}