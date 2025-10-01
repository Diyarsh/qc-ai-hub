import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, Sparkles, FolderOpen, History, Brain, Code, ChevronRight, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import logoDark from "@/assets/QC-AI-HUB-Dark.svg";
import logoLight from "@/assets/QC-AI-HUB-Light.svg";
const menuItems = [{
  title: "sidebar.chat",
  url: "/dashboard",
  icon: MessageCircle
}, {
  title: "sidebar.ai-studio",
  url: "/ai-studio",
  icon: Sparkles
}, {
  title: "sidebar.projects",
  url: "/projects",
  icon: FolderOpen
}, {
  title: "sidebar.history",
  url: "/history",
  icon: History
}, {
  title: "sidebar.lab",
  url: "/lab",
  icon: Brain
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const {
    t
  } = useLanguage();
  const {
    isDeveloperMode,
    toggleDeveloperMode
  } = useDeveloperMode();
  const { theme } = useTheme();
  const isActive = (path: string) => currentPath === path;
  return <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <img 
            src={theme === "dark" ? logoLight : logoDark} 
            alt="QazCloud AI-HUB" 
            className={collapsed ? "h-8" : "h-10"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={({
                  isActive
                }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="font-medium">{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Developer Mode Toggle */}
        <SidebarGroup>
          <SidebarGroupLabel>Настройки</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {!collapsed && <span className="text-sm font-medium">Режим разработчика</span>}
                </div>
                {!collapsed && (
                  <Switch 
                    checked={isDeveloperMode} 
                    onCheckedChange={toggleDeveloperMode}
                    className="scale-75"
                  />
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            AD
          </div>
          {!collapsed && <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
            </div>}
        </div>
      </SidebarFooter>
    </Sidebar>;
}