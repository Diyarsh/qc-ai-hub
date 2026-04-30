import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { Crown, Building2, Users, User, LucideIcon } from "lucide-react";

export type AdminRoleId =
  | "SUPER_ADMIN"
  | "COMPANY_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "USER";

export type AdminScope = "all" | "company" | "department" | "none";

export interface AdminPermissions {
  companies: AdminScope;
  departments: AdminScope;
  users: AdminScope;
  grantAdminRights: AdminScope;
  llmModels: AdminScope;
  viewAIAgents: AdminScope;
  createAIAgent: AdminScope;
  editAIAgent: AdminScope;
  assignAIAgents: AdminScope;
  analytics: AdminScope;
  monitoring: AdminScope;
  reports: AdminScope;
  viewKnowledge: AdminScope;
  manageKnowledge: AdminScope;
}

export interface AdminRoleDefinition {
  id: AdminRoleId;
  label: string;
  shortLabel: string;
  description: string;
  scopeLabel: string;
  icon: LucideIcon;
  accent: string;
  badgeClass: string;
  permissions: AdminPermissions;
}

export const ADMIN_ROLES: Record<AdminRoleId, AdminRoleDefinition> = {
  SUPER_ADMIN: {
    id: "SUPER_ADMIN",
    label: "Суперадмин",
    shortLabel: "Суперадмин",
    description: "Администратор от команды разработки",
    scopeLabel: "Без ограничений",
    icon: Crown,
    accent: "text-[#A17436]",
    badgeClass:
      "bg-[#A17436]/10 text-[#A17436] border-[#A17436]/30",
    permissions: {
      companies: "all",
      departments: "all",
      users: "all",
      grantAdminRights: "all",
      llmModels: "all",
      viewAIAgents: "all",
      createAIAgent: "all",
      editAIAgent: "all",
      assignAIAgents: "all",
      analytics: "all",
      monitoring: "all",
      reports: "all",
      viewKnowledge: "all",
      manageKnowledge: "all",
    },
  },
  COMPANY_ADMIN: {
    id: "COMPANY_ADMIN",
    label: "Администратор компании",
    shortLabel: "Адм. компании",
    description: "Ответственный администратор организации Заказчика",
    scopeLabel: "В рамках организации",
    icon: Building2,
    accent: "text-sky-500",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    permissions: {
      companies: "none",
      departments: "company",
      users: "company",
      grantAdminRights: "company",
      llmModels: "none",
      viewAIAgents: "company",
      createAIAgent: "company",
      editAIAgent: "company",
      assignAIAgents: "company",
      analytics: "company",
      monitoring: "none",
      reports: "company",
      viewKnowledge: "company",
      manageKnowledge: "company",
    },
  },
  DEPARTMENT_ADMIN: {
    id: "DEPARTMENT_ADMIN",
    label: "Администратор департамента",
    shortLabel: "Адм. департамента",
    description: "Ответственный администратор подразделения организации",
    scopeLabel: "В рамках департамента",
    icon: Users,
    accent: "text-violet-500",
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
    permissions: {
      companies: "none",
      departments: "none",
      users: "department",
      grantAdminRights: "none",
      llmModels: "none",
      viewAIAgents: "department",
      createAIAgent: "department",
      editAIAgent: "department",
      assignAIAgents: "department",
      analytics: "department",
      monitoring: "none",
      reports: "department",
      viewKnowledge: "department",
      manageKnowledge: "department",
    },
  },
  USER: {
    id: "USER",
    label: "Пользователь",
    shortLabel: "Пользователь",
    description: "Пользователь организации Заказчика",
    scopeLabel: "Нет доступа к админ-панели",
    icon: User,
    accent: "text-muted-foreground",
    badgeClass:
      "bg-muted text-muted-foreground border-border",
    permissions: {
      companies: "none",
      departments: "none",
      users: "none",
      grantAdminRights: "none",
      llmModels: "none",
      viewAIAgents: "none",
      createAIAgent: "none",
      editAIAgent: "none",
      assignAIAgents: "none",
      analytics: "none",
      monitoring: "none",
      reports: "none",
      viewKnowledge: "none",
      manageKnowledge: "none",
    },
  },
};

export const ADMIN_ROLE_LIST: AdminRoleDefinition[] = [
  ADMIN_ROLES.SUPER_ADMIN,
  ADMIN_ROLES.COMPANY_ADMIN,
  ADMIN_ROLES.DEPARTMENT_ADMIN,
  ADMIN_ROLES.USER,
];

export const SCOPE_LABEL: Record<AdminScope, string> = {
  all: "Без ограничений",
  company: "В рамках организации",
  department: "В рамках департамента",
  none: "Нет доступа",
};

interface AdminRoleContextType {
  roleId: AdminRoleId;
  role: AdminRoleDefinition;
  setRoleId: (id: AdminRoleId) => void;
  hasAccess: (permission: keyof AdminPermissions) => boolean;
  getScope: (permission: keyof AdminPermissions) => AdminScope;
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "admin.role";

export function AdminRoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleIdState] = useState<AdminRoleId>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as AdminRoleId | null;
      if (saved && saved in ADMIN_ROLES) return saved;
    }
    return "SUPER_ADMIN";
  });

  const setRoleId = (id: AdminRoleId) => {
    setRoleIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  const value = useMemo<AdminRoleContextType>(() => {
    const role = ADMIN_ROLES[roleId];
    return {
      roleId,
      role,
      setRoleId,
      hasAccess: (permission) => role.permissions[permission] !== "none",
      getScope: (permission) => role.permissions[permission],
    };
  }, [roleId]);

  return (
    <AdminRoleContext.Provider value={value}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const ctx = useContext(AdminRoleContext);
  if (!ctx) {
    throw new Error("useAdminRole must be used within an AdminRoleProvider");
  }
  return ctx;
}
