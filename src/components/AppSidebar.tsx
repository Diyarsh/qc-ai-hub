import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, Sparkles, FolderOpen, History, Brain, Code, ChevronRight, User, Settings } from "lucide-react";
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
  icon: Code,
  devOnly: true
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
  const {
    theme
  } = useTheme();
  const isActive = (path: string) => currentPath === path;
  return <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={theme === "dark" ? logoLight : logoDark} alt="QazCloud AI-HUB" className={collapsed ? "h-8" : "h-10"} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-0">
          {menuItems.map(item => {
            const isDevOnly = (item as any).devOnly;
            const isDisabled = isDevOnly && !isDeveloperMode;
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-9">
                  <NavLink 
                    to={isDisabled ? "#" : item.url} 
                    onClick={(e) => {
                      if (isDisabled) e.preventDefault();
                    }}
                    className={({isActive}) => 
                      `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isDisabled 
                          ? "opacity-40 cursor-not-allowed text-muted-foreground" 
                          : isActive 
                            ? "bg-muted text-foreground" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">{t(item.title)}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 mt-auto space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-sm font-semibold">RL</span>
          </div>
          {!collapsed && <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Личный кабинет</p>
            </div>}
          {!collapsed && <Settings className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
        
      </SidebarFooter>
    </Sidebar>;
}