import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, Sparkles, FolderOpen, History, Terminal, ChevronRight, User, Settings, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTheme } from "next-themes";
import qcLogo from "@/assets/QC-logo.svg";
import qcLogoLight from "@/assets/QC-logo-light.svg";

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
  title: "sidebar.lab",
  url: "/lab",
  icon: Terminal
}, {
  title: "sidebar.history",
  url: "/history",
  icon: History,
  subItems: [
    { group: "history.this-week", items: [
      { title: "Российский ИТ-форум: тренд", url: "/history#1" },
      { title: "Higgsfield AI: Breakthrough in", url: "/history#2" }
    ]},
    { group: "history.october", items: [
      { title: "Қазақстан: центр ИИ через т", url: "/history#3" }
    ]},
    { group: "history.september", items: [
      { title: "Lovable vs BlueMint: Лучший", url: "/history#4" },
      { title: "Mental Health Support and St", url: "/history#5" }
    ]}
  ]
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
  const [openHistoryMenu, setOpenHistoryMenu] = useState(false);
  const isActive = (path: string) => currentPath === path;
  return <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarHeader className="px-3 py-4">
        <div className={`relative ${collapsed ? "flex items-center justify-center" : "flex items-center justify-start"}`}>
          <img src={theme === "dark" ? qcLogoLight : qcLogo} alt="QazCloud AI-HUB" className={collapsed ? "h-6 w-6 object-contain" : "h-8"} />
          {!collapsed && (
            <div className="ml-3 flex flex-col justify-center leading-tight">
              <span className="text-base font-semibold tracking-tight">AI-HUB</span>
              <span className="text-[11px] text-muted-foreground">Enterprise Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-0.5">
          {menuItems.filter(item => item.url !== "/lab" || isDeveloperMode).map(item => item.subItems ? <Collapsible key={item.title} open={openHistoryMenu} onOpenChange={setOpenHistoryMenu} asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={collapsed ? t(item.title) : undefined}>
                    <NavLink to={item.url} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="font-medium text-sm">{t(item.title)}</span>}
                      {!collapsed && (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-transparent ml-auto" onClick={(e) => e.stopPropagation()}>
                            <ChevronRight className={`h-4 w-4 transition-transform ${openHistoryMenu ? "rotate-90" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                  {!collapsed && <CollapsibleContent className="animate-accordion-down">
                      <div className="ml-3 mt-1 space-y-3">
                        {item.subItems.map((subGroup: any, idx: number) => <div key={idx} className="space-y-1">
                            <p className="text-xs text-muted-foreground px-3 py-1 font-medium">{t(subGroup.group)}</p>
                            {subGroup.items.map((historyItem: any, itemIdx: number) => <NavLink key={itemIdx} to={historyItem.url} className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate">
                                {historyItem.title}
                              </NavLink>)}
                          </div>)}
                        <NavLink to="/history" className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                          {t('history.see-all')}
                        </NavLink>
                      </div>
                    </CollapsibleContent>}
                </SidebarMenuItem>
              </Collapsible> : <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={collapsed ? t(item.title) : undefined}>
                <NavLink to={item.url} className={({
              isActive
            }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="font-medium text-sm">{t(item.title)}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>)}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 mt-auto">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 ${collapsed ? "justify-center" : ""}`}>
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