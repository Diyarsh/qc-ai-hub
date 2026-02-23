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
    bg: "bg-primary/10 dark:bg-primary/15 border-primary/20",
    icon: "text-primary",
    text: "text-foreground",
  },
  green: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    text: "text-foreground",
  },
  orange: {
    bg: "bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/20",
    icon: "text-orange-600 dark:text-orange-400",
    text: "text-foreground",
  },
  red: {
    bg: "bg-red-500/10 dark:bg-red-500/15 border-red-500/20",
    icon: "text-red-600 dark:text-red-400",
    text: "text-foreground",
  },
};

export function StatCard({ label, value, icon: Icon, color = "blue" }: StatCardProps) {
  const c = colorClasses[color];
  return (
    <div
      className={cn(
        "rounded-xl p-6 border flex flex-col relative min-w-[180px] transition-colors",
        c.bg
      )}
    >
      <Icon className={cn("w-8 h-8 absolute right-4 top-6", c.icon)} />
      <div className={cn("text-3xl font-bold mb-2", c.text)}>{value}</div>
      <div className="font-medium text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
