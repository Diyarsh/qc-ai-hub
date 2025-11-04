import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { DevModeToggle } from "@/components/DevModeToggle";

export function AdminLayout({ role = "ROLE_ADMIN", children }: { children: ReactNode; role?: string }) {
  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar role={role} />
      <div className="flex-1 flex flex-col min-h-screen relative">
        <AdminHeader />
        <main className="flex-1 bg-gray-900 p-8">
          {children}
        </main>
        <DevModeToggle />
      </div>
    </div>
  );
}
