import { Check, ChevronDown, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ADMIN_ROLE_LIST,
  AdminRoleId,
  useAdminRole,
} from "@/contexts/AdminRoleContext";
import { cn } from "@/lib/utils";

export function RoleSelector() {
  const { role, roleId, setRoleId } = useAdminRole();
  const RoleIcon = role.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 h-9 pl-2 pr-3 border-border",
            "hover:bg-muted/60",
          )}
          aria-label="Выбор роли (демо)"
        >
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-md border",
              role.badgeClass,
            )}
          >
            <RoleIcon className="h-3.5 w-3.5" />
          </span>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Демо-роль
            </span>
            <span className="text-xs font-medium text-foreground">
              {role.shortLabel}
            </span>
          </div>
          <span className="sm:hidden text-xs font-medium">
            {role.shortLabel}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span>Просмотр под ролью</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Демо-режим: переключение прав доступа
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ADMIN_ROLE_LIST.map((r) => {
          const Icon = r.icon;
          const active = r.id === roleId;
          return (
            <DropdownMenuItem
              key={r.id}
              onSelect={() => setRoleId(r.id as AdminRoleId)}
              className={cn(
                "flex items-start gap-3 py-2 cursor-pointer",
                active && "bg-accent/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                  r.badgeClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {r.label}
                  </span>
                  {active && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {r.description}
                </p>
                <p className="text-[11px] mt-0.5 text-muted-foreground/80 italic">
                  {r.scopeLabel}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
