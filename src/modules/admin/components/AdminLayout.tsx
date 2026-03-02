import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout({ role = "ROLE_ADMIN", children }: { children: ReactNode; role?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-background min-h-screen text-foreground">
      <AdminSidebar role={role} collapsed={!sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex-1 flex flex-col min-h-screen relative min-w-0">
        <AdminHeader />
        <main className="flex-1 bg-background p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
