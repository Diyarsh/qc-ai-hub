import { ReactNode } from "react";
import {
  AdminPermissions,
  useAdminRole,
} from "@/contexts/AdminRoleContext";
import { NoAccess } from "./NoAccess";

interface RoleGuardedRouteProps {
  permission: keyof AdminPermissions;
  children: ReactNode;
}

export function RoleGuardedRoute({ permission, children }: RoleGuardedRouteProps) {
  const { hasAccess } = useAdminRole();
  if (!hasAccess(permission)) {
    return <NoAccess />;
  }
  return <>{children}</>;
}
