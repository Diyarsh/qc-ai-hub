import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatasetManager, Dataset } from "@/modules/laboratory2/data/components/DatasetManager";
import { DataPrep, DataPrepStep } from "@/modules/laboratory2/data/components/DataPrep";
import { FeatureStore, Feature } from "@/modules/laboratory2/data/components/FeatureStore";
import { AutoML, AutoMLTask } from "@/modules/laboratory2/data/components/AutoML";
import { ModelServe, ServedModel } from "@/modules/laboratory2/data/components/ModelServe";
import { DatasetService } from "@/modules/laboratory2/data/services/dataset.service";
import { AutoMLService } from "@/modules/laboratory2/data/services/automl.service";

export function Laboratory2Data() {
  const [datasets, setDatasets] = useState<Dataset[]>(DatasetService.getAll());
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [dataPrepSteps, setDataPrepSteps] = useState<DataPrepStep[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [automlTasks, setAutomlTasks] = useState<AutoMLTask[]>(AutoMLService.getAll());
  const [servedModels, setServedModels] = useState<ServedModel[]>([]);

  const handleAddDataset = () => {
    const newDataset: Dataset = {
      id: `dataset-${Date.now()}`,
      name: "New Dataset",
      source: "csv",
      rows: 0,
      columns: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    DatasetService.save(newDataset);
    setDatasets([...datasets, newDataset]);
  };

  const handleSelectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
  };

  const handleAddPrepStep = (type: DataPrepStep["type"]) => {
    const newStep: DataPrepStep = {
      id: `step-${Date.now()}`,
      type,
      config: {},
      description: `${type} step`,
    };
    setDataPrepSteps([...dataPrepSteps, newStep]);
  };

  const handleRemovePrepStep = (stepId: string) => {
    setDataPrepSteps(dataPrepSteps.filter(s => s.id !== stepId));
  };

  const handleUpdatePrepStep = (stepId: string, config: Record<string, any>) => {
    setDataPrepSteps(dataPrepSteps.map(s =>
      s.id === stepId ? { ...s, config } : s
    ));
  };

  const handleSaveRecipe = () => {
    // Save recipe logic
    console.log("Recipe saved:", dataPrepSteps);
  };

  const handleAddFeature = () => {
    // Add feature logic
  };

  const handleSelectFeature = (feature: Feature) => {
    // Select feature logic
  };

  const handleStartTask = (task: Partial<AutoMLTask>) => {
    const newTask: AutoMLTask = {
      id: `task-${Date.now()}`,
      name: task.name || "Untitled Task",
      type: task.type || "classification",
      targetColumn: task.targetColumn || "",
      datasetId: selectedDataset?.id || "",
      status: "running",
      createdAt: new Date(),
    };
    AutoMLService.save(newTask);
    setAutomlTasks([...automlTasks, newTask]);
    
    // Simulate training
    setTimeout(() => {
      AutoMLService.updateStatus(newTask.id, "completed");
      AutoMLService.updateMetrics(newTask.id, {
        accuracy: 0.85,
        f1: 0.82,
        precision: 0.88,
        recall: 0.80,
      });
      setAutomlTasks(AutoMLService.getAll());
    }, 2000);
  };

  const handleSelectTask = (task: AutoMLTask) => {
    // Select task logic
  };

  const handleDeploy = (modelId: string, config: Record<string, any>) => {
    const newModel: ServedModel = {
      id: `model-${Date.now()}`,
      name: `Model ${modelId}`,
      modelId,
      endpoint: `https://api.example.com/models/${modelId}`,
      version: "1.0.0",
      status: "active",
      schema: {
        input: { feature1: "number", feature2: "number" },
        output: { prediction: "number", probability: "number" },
      },
      token: `token-${Date.now()}`,
      createdAt: new Date(),
    };
    setServedModels([...servedModels, newModel]);
  };

  const handleStop = (modelId: string) => {
    setServedModels(servedModels.map(m =>
      m.id === modelId ? { ...m, status: "inactive" as const } : m
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="datasets" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="prep">Data Prep</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="automl">AutoML</TabsTrigger>
          <TabsTrigger value="serve">Model Serve</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="w-80 border-r border-border">
              <DatasetManager
                datasets={datasets}
                onSelectDataset={handleSelectDataset}
                onAddDataset={handleAddDataset}
              />
            </div>
            <div className="flex-1 p-4">
              {selectedDataset ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">{selectedDataset.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Source: {selectedDataset.source}
                  </p>
                  {selectedDataset.rows && (
                    <p className="text-sm text-muted-foreground">
                      Rows: {selectedDataset.rows.toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a dataset to view details
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prep" className="flex-1 overflow-hidden">
          <DataPrep
            steps={dataPrepSteps}
            onAddStep={handleAddPrepStep}
            onRemoveStep={handleRemovePrepStep}
            onUpdateStep={handleUpdatePrepStep}
            onSaveRecipe={handleSaveRecipe}
          />
        </TabsContent>

        <TabsContent value="features" className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="w-80 border-r border-border">
              <FeatureStore
                features={features}
                onAddFeature={handleAddFeature}
                onSelectFeature={handleSelectFeature}
              />
            </div>
            <div className="flex-1 p-4">
              <div className="text-center text-muted-foreground py-8">
                Feature details
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automl" className="flex-1 overflow-hidden">
          <AutoML
            tasks={automlTasks}
            onStartTask={handleStartTask}
            onSelectTask={handleSelectTask}
          />
        </TabsContent>

        <TabsContent value="serve" className="flex-1 overflow-hidden">
          <ModelServe
            models={servedModels}
            onDeploy={handleDeploy}
            onStop={handleStop}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

