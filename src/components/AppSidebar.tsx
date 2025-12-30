import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles, FolderOpen, History, Terminal, ChevronRight, User, Settings, Clock, Shield, LogOut, Palette, HelpCircle, Workflow } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import qcLogo from "@/assets/QC_Black_icon.svg";
import qcLogoLight from "@/assets/QC_White_icon.svg";
import { UserSettingsDialog } from "@/components/UserSettingsDialog";
import { useAuth } from "@/main/webapp/app/shared/hooks/useAuth";

// Static history data (same as History.tsx) - B2B Enterprise Platform examples
const staticHistory = [{
  text: "Проанализировать GDPR требования для корпоративного сектора",
  time: "2 часа назад",
  type: "chat",
  model: "LLM-Ultra"
}, {
  text: "Создать шаблон онбординга для новых сотрудников",
  time: "5 часов назад",
  type: "chat",
  model: "Assistant Pro"
}, {
  text: "Извлечь ключевые требования из договора поставки",
  time: "1 день назад",
  type: "chat",
  model: "Doc AI"
}, {
  text: "Перевести техническую документацию на казахский",
  time: "1 день назад",
  type: "chat",
  model: "Translation Master"
}, {
  text: "Написать функцию валидации ИИН на TypeScript",
  time: "2 дня назад",
  type: "chat",
  model: "Code Assistant"
}, {
  text: "Проанализировать продажи за Q3 2025 и выявить тренды",
  time: "3 дня назад",
  type: "chat",
  model: "Data Analyst"
}, {
  text: "Проанализировать договор на соответствие законодательству РК",
  time: "4 дня назад",
  type: "chat",
  model: "Legal Advisor"
}, {
  text: "Написать пост для LinkedIn о новых возможностях AI",
  time: "5 дней назад",
  type: "chat",
  model: "Content Creator"
}, {
  text: "Проанализировать финансовую отчетность компании за год",
  time: "1 неделю назад",
  type: "chat",
  model: "Financial Advisor"
}, {
  text: "Клиент спрашивает о возврате товара, как помочь?",
  time: "1 неделю назад",
  type: "chat",
  model: "Customer Support"
}, {
  text: "Подготовить обзор современных методов машинного обучения",
  time: "2 недели назад",
  type: "chat",
  model: "Research Assistant"
}, {
  text: "Проверить код на уязвимости безопасности",
  time: "2 недели назад",
  type: "chat",
  model: "Security Auditor"
}];

const menuItems = [{
  title: "sidebar.chat",
  url: "/dashboard",
  icon: MessageCircle
}, {
  title: "AI-Studio",
  url: "/ai-studio-3",
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
  title: "sidebar.lab2",
  url: "/laboratory2",
  icon: Workflow
}, {
  title: "sidebar.lab3",
  url: "/laboratory3",
  icon: Workflow
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
    theme,
    setTheme
  } = useTheme();
  const [openHistoryMenu, setOpenHistoryMenu] = useState(true);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const { isAdmin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dynamicHistory, setDynamicHistory] = useState<Array<{ text: string; time: string; type: string; model: string }>>([]);

  // Load history data from localStorage and listen for changes
  useEffect(() => {
    const loadHistory = () => {
      try {
        const ls = JSON.parse(localStorage.getItem('dashboard.history') || '[]');
        setDynamicHistory(ls);
      } catch {}
    };

    loadHistory();

    // Listen for storage changes (from other tabs/windows or same tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard.history') {
        loadHistory();
      }
    };

    // Listen for custom storage events (from same tab)
    const handleCustomStorage = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboard.history.updated', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard.history.updated', handleCustomStorage);
    };
  }, []);

  // Merge static and dynamic history, then group by time
  const historyItems = useMemo(() => {
    const merged = [...dynamicHistory.map(i => ({...i, time: '2 часа назад'})), ...staticHistory];
    const sorted = [...merged].sort((a, b) => {
      const parseTime = (time: string) => {
        // Russian time parsing
        const hoursMatch = time.match(/(\d+)\s*час(?:а|ов)?\s*назад/);
        if (hoursMatch) return parseInt(hoursMatch[1]);
        const daysMatch = time.match(/(\d+)\s*дн(?:я|ей|ень)?\s*назад/);
        if (daysMatch) return parseInt(daysMatch[1]) * 24;
        const weeksMatch = time.match(/(\d+)\s*недел(?:и|ь|ю|ей)?\s*назад/);
        if (weeksMatch) return parseInt(weeksMatch[1]) * 7 * 24;
        // English fallback
        const hoursMatchEn = time.match(/(\d+)\s*hours?\s*ago/);
        if (hoursMatchEn) return parseInt(hoursMatchEn[1]);
        const weeksMatchEn = time.match(/(\d+)\s*weeks?\s*ago/);
        if (weeksMatchEn) return parseInt(weeksMatchEn[1]) * 7 * 24;
        const daysMatchEn = time.match(/(\d+)\s*days?\s*ago/);
        if (daysMatchEn) return parseInt(daysMatchEn[1]) * 24;
        return 0;
      };
      // Sort from newest to oldest (desc)
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
      // Group by time period (Russian and English)
      if (item.time.includes('час') || item.time.includes('день') || item.time.includes('недел') || 
          item.time.includes('hours ago') || item.time.includes('week ago') || item.time.includes('day ago')) {
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
        <div className={`relative ${collapsed ? "flex items-center justify-center" : "flex items-center gap-3"}`}>
          <div className={collapsed ? "w-8 h-8 flex items-center justify-center" : "w-7 h-7 flex items-center justify-center flex-shrink-0"}>
            <img 
              src={theme === "dark" ? qcLogoLight : qcLogo} 
              alt="QazCloud AI-HUB" 
              className="h-full w-auto object-contain"
              style={{ transform: 'rotate(-90deg)' }} 
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-base font-semibold tracking-tight">AI-HUB</span>
              <span className="text-[11px] text-muted-foreground">Enterprise Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-0.5">
          {menuItems.filter(item => {
            // Show Lab, Laboratory2.0 and Laboratory3.0 only when Dev Mode is enabled
            if ((item.url === "/lab" || item.url === "/laboratory2" || item.url === "/laboratory3") && !isDeveloperMode) {
              return false;
            }
            return true;
          }).map(item => {
            // Special handling for "Новый чат" (New chat)
            if (item.url === "/dashboard" && item.title === "sidebar.chat") {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? t(item.title) : undefined}>
                    <NavLink 
                      to={item.url} 
                      onClick={(e) => {
                        // If already on dashboard, trigger new chat event
                        if (currentPath === "/dashboard") {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent('dashboard.new-chat'));
                        }
                      }}
                      className={({ isActive }) => `flex items-center gap-3 flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="font-medium text-sm">{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            return item.hasSubItems ? (
              <Collapsible key={item.title} open={openHistoryMenu} onOpenChange={setOpenHistoryMenu} asChild>
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
                                className="block px-3 py-1.5 text-sm font-light text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
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
                                className="block px-3 py-1.5 text-sm font-light text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors truncate"
                              >
                                {historyItem.title}
                              </NavLink>
                            ))}
                          </>
                        )}
                        <NavLink 
                          to="/history" 
                          className="block px-3 py-1.5 text-sm font-light text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
                          {t('history.see-all')}
                        </NavLink>
                      </div>
                    </CollapsibleContent>}
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={collapsed ? (item.title.startsWith("sidebar.") ? t(item.title) : item.title) : undefined}>
                  <NavLink to={item.url} className={({
                    isActive
                  }) => `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"} ${collapsed ? "justify-center" : ""}`}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">{item.title.startsWith("sidebar.") ? t(item.title) : item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 w-full ${collapsed ? "justify-center" : ""}`}
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-sm font-semibold">RL</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Roman Lefarov</p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Roman Lefarov</p>
                <p className="text-xs leading-none text-muted-foreground">roman.lefarov@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUserSettingsOpen(true)}>
              <Palette className="mr-2 h-4 w-4" />
              <span>Персонализация</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Администрирование</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Справка</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              logout();
              navigate('/');
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <UserSettingsDialog open={userSettingsOpen} onOpenChange={setUserSettingsOpen} />
    </Sidebar>;
}