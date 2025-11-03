import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, Sparkles, FolderOpen, History, Terminal, ChevronRight, User, Settings, Clock, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTheme } from "next-themes";
import qcLogo from "@/assets/QC-logo.svg";
import qcLogoLight from "@/assets/QC-logo-light.svg";
import { UserSettingsDialog } from "@/components/UserSettingsDialog";
import { useAuth } from "@/main/webapp/app/shared/hooks/useAuth";

// Static history data (same as History.tsx)
const staticHistory = [{
  text: "Analyze quantum computing algorithms",
  time: "17 hours ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Create AI-powered data visualization",
  time: "1 week ago",
  type: "chat",
  model: "Claude 3"
}, {
  text: "Generate video from text description",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Optimize database query performance",
  time: "1 week ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Build machine learning model pipeline",
  time: "1 week ago",
  type: "chat",
  model: "Gemini Pro"
}, {
  text: "Generate product demo video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Implement natural language processing",
  time: "1 week ago",
  type: "chat",
  model: "Claude 3"
}, {
  text: "Create animated explainer video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Develop recommendation system",
  time: "1 week ago",
  type: "chat",
  model: "GPT-4"
}, {
  text: "Generate marketing campaign video",
  time: "1 week ago",
  type: "veo",
  model: "Veo 2"
}, {
  text: "Design distributed system architecture",
  time: "2 weeks ago",
  type: "chat",
  model: "Gemini Pro"
}, {
  text: "Implement real-time data streaming",
  time: "2 weeks ago",
  type: "chat",
  model: "Claude 3"
}];

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
  hasSubItems: true
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
  const [openHistoryMenu, setOpenHistoryMenu] = useState(true);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const { isAdmin, isSuperAdmin } = useAuth();
  const [dynamicHistory, setDynamicHistory] = useState<Array<{ text: string; time: string; type: string; model: string }>>([]);

  // Load history data from localStorage (same as History.tsx)
  useEffect(() => {
    try {
      const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
      setDynamicHistory(ls);
    } catch {}
  }, []);

  // Merge static and dynamic history, then group by time
  const historyItems = useMemo(() => {
    const merged = [...dynamicHistory.map(i => ({...i, time: 'hours ago'})), ...staticHistory];
    const sorted = [...merged].sort((a, b) => {
      const parseTime = (time: string) => {
        const hoursMatch = time.match(/(\d+)\s*hours?\s*ago/);
        if (hoursMatch) return parseInt(hoursMatch[1]);
        const weeksMatch = time.match(/(\d+)\s*weeks?\s*ago/);
        if (weeksMatch) return parseInt(weeksMatch[1]) * 7 * 24;
        const daysMatch = time.match(/(\d+)\s*days?\s*ago/);
        if (daysMatch) return parseInt(daysMatch[1]) * 24;
        return 0;
      };
      return parseTime(b.time) - parseTime(a.time);
    });

    // Group by time period
    const thisWeek: Array<{ title: string; url: string }> = [];
    const older: Array<{ title: string; url: string }> = [];

    sorted.slice(0, 8).forEach((item, idx) => {
      const historyItem = {
        title: item.text.length > 35 ? item.text.substring(0, 35) + '...' : item.text,
        url: `/history-chat/${idx}`
      };
      if (item.time.includes('hours ago') || item.time.includes('week ago')) {
        thisWeek.push(historyItem);
      } else {
        older.push(historyItem);
      }
    });

    return {
      thisWeek,
      older
    };
  }, [dynamicHistory]);

  const isActive = (path: string) => currentPath === path;
  // const { user } = useAuth(); // временно убрать
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
          {menuItems.filter(item => item.url !== "/lab" || isDeveloperMode).map(item => item.hasSubItems ? <Collapsible key={item.title} open={openHistoryMenu} onOpenChange={setOpenHistoryMenu} asChild>
                <SidebarMenuItem>
                  <div className="flex items-center gap-1">
                    <SidebarMenuButton asChild tooltip={collapsed ? t(item.title) : undefined}>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => `flex items-center gap-3 flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="font-medium text-sm">{t(item.title)}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                    {!collapsed && (
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0 hover:bg-muted/50" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenHistoryMenu(!openHistoryMenu);
                          }}
                        >
                          <ChevronRight className={`h-4 w-4 transition-transform ${openHistoryMenu ? "rotate-90" : ""}`} />
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                  {!collapsed && <CollapsibleContent className="animate-accordion-down">
                      <div className="ml-3 mt-1 space-y-1">
                        {historyItems.thisWeek.length > 0 && (
                          <>
                            {historyItems.thisWeek.map((historyItem, itemIdx) => (
                              <NavLink 
                                key={itemIdx} 
                                to={historyItem.url} 
                                className="block px-3 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
                              >
                                {historyItem.title}
                              </NavLink>
                            ))}
                          </>
                        )}
                        {historyItems.older.length > 0 && (
                          <>
                            {historyItems.older.map((historyItem, itemIdx) => (
                              <NavLink 
                                key={itemIdx} 
                                to={historyItem.url} 
                                className="block px-3 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
                              >
                                {historyItem.title}
                              </NavLink>
                            ))}
                          </>
                        )}
                        <NavLink 
                          to="/history" 
                          className="block px-3 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
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
        {/* Временно всегда показываем для демонстрации админ-панели */}
        <SidebarMenuItem key="admin">
          <SidebarMenuButton asChild tooltip={collapsed ? 'Администрирование' : undefined}>
            <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}>
              <Shield className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Администрирование</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 mt-auto">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setUserSettingsOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setUserSettingsOpen(true); } }}
          className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-sm font-semibold">RL</span>
          </div>
          {!collapsed && <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Личный кабинет</p>
            </div>}
          {!collapsed && <Settings className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
      </SidebarFooter>
      <UserSettingsDialog open={userSettingsOpen} onOpenChange={setUserSettingsOpen} />
    </Sidebar>;
}