import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gateway } from "./Gateway";
import { Metrics } from "./Metrics";
import { Health } from "./Health";
import { Configuration } from "./Configuration";
import { Logs } from "./Logs";

export default function System() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Системное управление</h1>
      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="gateway">Gateway</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="health">
          <Health />
        </TabsContent>
        <TabsContent value="metrics">
          <Metrics />
        </TabsContent>
        <TabsContent value="gateway">
          <Gateway />
        </TabsContent>
        <TabsContent value="configuration">
          <Configuration />
        </TabsContent>
        <TabsContent value="logs">
          <Logs />
        </TabsContent>
      </Tabs>
    </div>
  );
}

