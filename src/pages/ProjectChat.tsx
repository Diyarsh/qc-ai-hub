import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Paperclip, Send, FolderOpen, Bot, Menu } from "lucide-react";
import { ProjectSettingsDialog } from "@/components/ProjectSettingsDialog";

export default function ProjectChat() {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <div className="flex h-full w-full overflow-hidden">.
      {/* Project Sidebar */}
      <div className="w-72 border-r bg-card flex flex-col">
        <button 
          onClick={() => setSettingsOpen(true)}
          className="mx-4 mt-4 mb-1 p-4 border rounded-lg text-left hover:bg-accent hover:border-primary/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Инструкции</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Настройте инструкции для AI-HUB в этом проекте
          </p>
        </button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-4 mb-2">
            <TabsTrigger value="files" className="text-xs">Файлы</TabsTrigger>
            <TabsTrigger value="conversations" className="text-xs">Чаты</TabsTrigger>
          </TabsList>

          {activeTab === "files" && <div className="flex-1 p-4">
              <Button variant="outline" className="w-full justify-center gap-2 mb-4">
                <Paperclip className="h-4 w-4" />
                Прикрепить
              </Button>
              
              <div className="flex flex-col items-center justify-center py-6 text-center border border-border rounded-lg">`
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-medium mb-2 text-sm">Файлов пока нет</h3>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Начните с прикрепления файлов к вашему проекту. Они будут использоваться во всех чатах этого проекта.
                </p>
              </div>
            </div>}

          {activeTab === "conversations" && <ScrollArea className="flex-1 p-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Нет активных бесед
              </div>
            </ScrollArea>}
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-6 overflow-y-auto">.
          <div className="max-w-3xl mx-auto">.
            <div className="flex flex-col items-center justify-center h-full text-center py-20">.
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">.
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Начать беседу</h2>
              <p className="text-muted-foreground max-w-md">
                Задавайте вопросы, получайте помощь или обсуждайте ваш проект
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input placeholder="Начните беседу в этом проекте" value={message} onChange={e => setMessage(e.target.value)} className="flex-1" />
              <Button size="icon" className="flex-shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProjectSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>;
}