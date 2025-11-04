import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Switch } from "@/components/ui/switch";

export function DevModeToggle() {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <span className="text-xs sm:text-sm font-medium">Dev Mode</span>
      <Switch checked={isDeveloperMode} onCheckedChange={toggleDeveloperMode} />
    </div>
  );
}






