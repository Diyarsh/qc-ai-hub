import { ReactNode, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useTheme } from "next-themes";

export function AdminLayout({ role = "ROLE_ADMIN", children }: { children: ReactNode; role?: string }) {
  const { setTheme } = useTheme();
  
  // Force dark mode for admin panel on mount
  useEffect(() => {
    if (setTheme) {
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <div className="flex bg-background min-h-screen dark">
      <AdminSidebar role={role} />
      <div className="flex-1 flex flex-col min-h-screen relative">
        <AdminHeader />
        <main className="flex-1 bg-background p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
