import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Database, Clock, User } from "lucide-react";

export interface Feature {
  id: string;
  name: string;
  description: string;
  type: string;
  owner: string;
  updateFrequency: "real-time" | "hourly" | "daily" | "weekly";
  datasetId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FeatureStoreProps {
  features: Feature[];
  onAddFeature: () => void;
  onSelectFeature: (feature: Feature) => void;
}

export function FeatureStore({
  features,
  onAddFeature,
  onSelectFeature,
}: FeatureStoreProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFrequencyColor = (frequency: Feature["updateFrequency"]) => {
    switch (frequency) {
      case "real-time":
        return "bg-green-500";
      case "hourly":
        return "bg-blue-500";
      case "daily":
        return "bg-yellow-500";
      case "weekly":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Feature Store</h3>
          <p className="text-xs text-muted-foreground">
            Manage your feature sets
          </p>
        </div>
        <Button size="sm" onClick={onAddFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredFeatures.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No features found
            </div>
          ) : (
            filteredFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectFeature(feature)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm">{feature.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {feature.owner}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <Badge
                        variant="outline"
                        className={`text-xs ${getFrequencyColor(feature.updateFrequency)} text-white`}
                      >
                        {feature.updateFrequency}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

