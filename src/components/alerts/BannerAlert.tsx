import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BannerVariant = "critical" | "warning" | "info";

interface BannerAlertProps {
  variant: BannerVariant;
  title: string;
  description: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantStyles = {
  critical: "border-destructive bg-destructive/10 text-destructive",
  warning: "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  info: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300",
};

const variantIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function BannerAlert({
  variant,
  title,
  description,
  onClose,
  action,
  className,
}: BannerAlertProps) {
  const Icon = variantIcons[variant];

  return (
    <Alert
      className={cn(
        "mb-4 border-2",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <AlertTitle className="font-semibold mb-1">{title}</AlertTitle>
          <AlertDescription className="text-sm">{description}</AlertDescription>
          {action && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}


