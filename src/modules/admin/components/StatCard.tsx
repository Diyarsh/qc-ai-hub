import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
}

const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
  blue: {
    bg: "bg-primary/5 dark:bg-primary/10",
    icon: "text-primary",
    text: "text-foreground",
  },
  green: {
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    text: "text-foreground",
  },
  orange: {
    bg: "bg-orange-500/5 dark:bg-orange-500/10",
    icon: "text-orange-600 dark:text-orange-400",
    text: "text-foreground",
  },
  red: {
    bg: "bg-red-500/5 dark:bg-red-500/10",
    icon: "text-red-600 dark:text-red-400",
    text: "text-foreground",
  },
};

export function StatCard({ label, value, icon: Icon, color = "blue" }: StatCardProps) {
  const c = colorClasses[color];
  return (
    <div
      className={cn(
        "rounded-lg p-5 border border-border/60 bg-card flex flex-col relative min-w-[160px] transition-colors",
        c.bg
      )}
    >
      <Icon className={cn("w-7 h-7 absolute right-3 top-5 opacity-80", c.icon)} />
      <div className={cn("text-2xl font-semibold mb-1", c.text)}>{value}</div>
      <div className="font-medium text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
