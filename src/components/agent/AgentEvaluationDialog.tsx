import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";
import { AgentEvaluationService } from "@/services/agent-evaluation.service";
import { EvaluationRating, EvaluationOption } from "@/types/agent-evaluation";
import { AgentEvaluation } from "@/types/agent-evaluation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const evaluationOptions: EvaluationOption[] = [
  { value: 1, label: "Плохо", icon: "👎", color: "bg-red-500 hover:bg-red-600" },
  { value: 2, label: "Средне", icon: "➖", color: "bg-yellow-500 hover:bg-yellow-600" },
  { value: 3, label: "Хорошо", icon: "👍", color: "bg-green-500 hover:bg-green-600" },
];

interface AgentEvaluationDialogProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentEvaluationDialog({
  agentId,
  isOpen,
  onClose,
}: AgentEvaluationDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("rate");
  const [rating, setRating] = useState<EvaluationRating | 0>(0);
  const [allEvaluations, setAllEvaluations] = useState<AgentEvaluation[]>([]);
  const [statistics, setStatistics] = useState(AgentEvaluationService.getStatistics(agentId));
  const [userEvaluation, setUserEvaluation] = useState<AgentEvaluation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Автоматически открываем вкладку "Оценить" если у пользователя нет оценки
      const userEval = AgentEvaluationService.getEvaluation(agentId);
      setActiveTab(userEval ? "all" : "rate");
    } else {
      // Сбрасываем состояние при закрытии диалога
      setRating(0);
      setShowDeleteDialog(false);
      setIsSaving(false);
    }
  }, [isOpen, agentId]);

  const loadData = () => {
    const userEval = AgentEvaluationService.getEvaluation(agentId);
    const allEvals = AgentEvaluationService.getAllEvaluationsForAgent(agentId);
    const stats = AgentEvaluationService.getStatistics(agentId);

    setUserEvaluation(userEval);
    setAllEvaluations(allEvals);
    setStatistics(stats);
    
    if (userEval) {
      setRating(userEval.rating as EvaluationRating);
    } else {
      setRating(0);
    }
  };

  const handleSave = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Выберите оценку",
        description: "Пожалуйста, выберите один из вариантов оценки",
      });
      return;
    }

    setIsSaving(true);
    try {
      const isUpdate = !!userEvaluation;
      AgentEvaluationService.saveEvaluation(agentId, rating as EvaluationRating);
      
      // Обновляем данные сразу после сохранения
      loadData();
      
      toast({
        title: isUpdate ? "Оценка обновлена" : "Оценка сохранена",
        description: isUpdate 
          ? "Ваша оценка успешно обновлена" 
          : "Спасибо за вашу оценку!",
      });
      
      // Переключаемся на вкладку "Все оценки" после сохранения
      setTimeout(() => {
        setActiveTab("all");
        // Прокручиваем к началу списка, чтобы показать новую оценку
        const evaluationsContainer = document.querySelector('[data-evaluations-list]');
        if (evaluationsContainer) {
          evaluationsContainer.scrollTop = 0;
        }
      }, 300);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить оценку. Попробуйте еще раз.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    AgentEvaluationService.deleteEvaluation(agentId);
    loadData();
    setRating(0);
    setShowDeleteDialog(false);
    
    // Переключаемся на вкладку "Оценить" после удаления
    setActiveTab("rate");
    
    toast({
      title: "Оценка удалена",
      description: "Ваша оценка была успешно удалена",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Оценка агента: {agentId}</DialogTitle>
          <DialogDescription>
            {userEvaluation 
              ? "Вы уже оценили этого агента. Вы можете обновить свою оценку или просмотреть все оценки."
              : "Оцените качество работы агента. Ваше мнение поможет другим пользователям."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {statistics.average > 0 ? statistics.average.toFixed(1) : "—"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {statistics.total === 0 
                  ? "Нет оценок" 
                  : `${statistics.total} ${statistics.total === 1 ? "оценка" : statistics.total < 5 ? "оценки" : "оценок"}`
                }
              </div>
            </div>
            <div className="flex-1">
              {statistics.total > 0 ? (
                <div className="flex flex-col gap-2">
                  {evaluationOptions.map((option) => {
                    const count = statistics.distribution[option.value] || 0;
                    const percentage = (count / statistics.total) * 100;
                    return (
                      <div key={option.value} className="flex items-center gap-3">
                        <span className="text-sm w-16 text-left">{option.label}</span>
                        <div className="flex-1 h-3 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              option.value === 1 && "bg-red-500",
                              option.value === 2 && "bg-yellow-500",
                              option.value === 3 && "bg-green-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Будьте первым, кто оценит этого агента!
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList 
            className="grid w-full grid-cols-2"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <TabsTrigger 
              value="rate"
              onClick={(e) => e.stopPropagation()}
            >
              Оценить
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              onClick={(e) => e.stopPropagation()}
            >
              Все оценки ({allEvaluations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rate" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-4 block">
                Ваша оценка <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {evaluationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      rating === option.value
                        ? cn(
                            "border-primary bg-primary/10 scale-105",
                            option.value === 1 && "border-red-500 bg-red-500/10",
                            option.value === 2 && "border-yellow-500 bg-yellow-500/10",
                            option.value === 3 && "border-green-500 bg-green-500/10"
                          )
                        : "border-border hover:border-primary/50 hover:bg-accent"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRating(option.value);
                    }}
                  >
                    <span className="text-4xl">{option.icon}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      rating === option.value && "text-primary"
                    )}>
                      {option.label}
                    </span>
                    {rating === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Выберите один из вариантов оценки
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              {userEvaluation && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить оценку
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  disabled={isSaving}
                >
                  Отмена
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  disabled={rating === 0 || isSaving}
                  className="min-w-[140px]"
                >
                  {isSaving ? (
                    "Сохранение..."
                  ) : userEvaluation ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Обновить оценку
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Сохранить оценку
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4 mt-4">
            {allEvaluations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Пока нет оценок
              </div>
            ) : (
              <div className="space-y-4" data-evaluations-list>
                {allEvaluations.map((evaluation, index) => {
                  // Определяем, является ли это оценкой текущего пользователя
                  // В текущей реализации без userId, проверяем по agentId и отсутствию userId
                  const isUserEvaluation = !evaluation.userId && 
                    evaluation.agentId === agentId &&
                    userEvaluation &&
                    evaluation.createdAt === userEvaluation.createdAt;
                  
                  const option = evaluationOptions.find(opt => opt.value === evaluation.rating);
                  
                  return (
                    <div
                      key={`${evaluation.agentId}-${evaluation.createdAt}-${evaluation.updatedAt || ''}-${index}`}
                      className={cn(
                        "p-4 border rounded-lg space-y-2 transition-all",
                        isUserEvaluation && "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option?.icon}</span>
                          <span className="text-sm font-medium">{option?.label}</span>
                          {isUserEvaluation && (
                            <span className="ml-2 text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                              Ваша оценка
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(evaluation.updatedAt || evaluation.createdAt)}
                          {evaluation.updatedAt && evaluation.updatedAt !== evaluation.createdAt && (
                            <span className="ml-1 text-orange-600">(изменено)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить оценку?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить свою оценку? Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={(e) => e.stopPropagation()}
              >
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

