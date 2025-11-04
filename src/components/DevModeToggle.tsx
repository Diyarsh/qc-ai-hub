import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DevModeToggleProps {
  compact?: boolean;
}

export function DevModeToggle({ compact = false }: DevModeToggleProps) {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor="dev-mode-toggle" className="text-xs font-medium cursor-pointer">
          Dev Mode
        </Label>
        <Switch 
          id="dev-mode-toggle"
          checked={isDeveloperMode} 
          onCheckedChange={toggleDeveloperMode} 
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <span className="text-xs sm:text-sm font-medium">Dev Mode</span>
      <Switch checked={isDeveloperMode} onCheckedChange={toggleDeveloperMode} />
    </div>
  );
}






