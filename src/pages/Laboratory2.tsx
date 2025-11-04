import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperMode } from "@/contexts/DeveloperModeContext";
import { useNavigate } from "react-router-dom";
import { Laboratory2Agents } from "./Laboratory2Agents";
import { Laboratory2Data } from "./Laboratory2Data";
import { Workflow, Database } from "lucide-react";

export default function Laboratory2() {
  const { t } = useLanguage();
  const { isDeveloperMode } = useDeveloperMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"agents" | "data">("agents");

  // Require developer mode to access Laboratory2.0
  useEffect(() => {
    if (!isDeveloperMode) {
      navigate('/dashboard');
    }
  }, [isDeveloperMode, navigate]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Laboratory2.0" 
        subtitle="AI/ML Workflow Platform"
      />

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as "agents" | "data")}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-4 w-auto">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Structured Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="flex-1 overflow-hidden mt-0">
          <Laboratory2Agents />
        </TabsContent>

        <TabsContent value="data" className="flex-1 overflow-hidden mt-0">
          <Laboratory2Data />
        </TabsContent>
      </Tabs>
    </div>
  );
}
