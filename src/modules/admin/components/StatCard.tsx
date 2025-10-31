import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
}

export function StatCard({ label, value, icon: Icon, color = "blue" }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-700 to-blue-500",
    green: "from-green-600 to-green-400",
    orange: "from-orange-600 to-orange-400",
    red: "from-red-600 to-red-400"
  };
  return (
    <div className={`rounded-lg p-6 bg-gradient-to-br ${colorMap[color]} shadow text-white flex flex-col relative min-w-[180px]`}>
      <Icon className="w-8 h-8 mb-2 opacity-80 absolute right-4 top-6" />
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="font-medium text-sm opacity-80">{label}</div>
    </div>
  );
}
