import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAdminRole } from "@/contexts/AdminRoleContext";

export function NoAccess({ section }: { section?: string }) {
  const { role } = useAdminRole();
  const RoleIcon = role.icon;

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-lg w-full p-8 text-center bg-card border-border">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Раздел недоступен
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {section
            ? `Раздел «${section}» недоступен для вашей роли.`
            : "Этот раздел недоступен для вашей роли."}
        </p>
        <div
          className={`mx-auto inline-flex items-center gap-3 rounded-lg border px-4 py-2 ${role.badgeClass}`}
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background/40">
            <RoleIcon className="h-4 w-4" />
          </span>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-wider opacity-80">
              Текущая роль
            </p>
            <p className="text-sm font-semibold">{role.label}</p>
            <p className="text-[11px] opacity-80">{role.scopeLabel}</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Чтобы увидеть доступные разделы, переключите роль в верхней панели.
        </p>
      </Card>
    </div>
  );
}
