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
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, CheckCircle2 } from "lucide-react";
import { AgentEvaluationService } from "@/services/agent-evaluation.service";
import { EvaluationRating } from "@/types/agent-evaluation";
import { AgentEvaluation } from "@/types/agent-evaluation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
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
      setComment("");
      setHoveredRating(0);
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
      setComment(userEval.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
  };

  const handleSave = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Выберите оценку",
        description: "Пожалуйста, выберите оценку от 1 до 5 звезд",
      });
      return;
    }

    setIsSaving(true);
    try {
      const isUpdate = !!userEvaluation;
      AgentEvaluationService.saveEvaluation(agentId, rating as EvaluationRating, comment);
      
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
    setComment("");
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
              : "Оцените качество работы агента и оставьте отзыв. Ваше мнение поможет другим пользователям."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold flex items-center justify-center gap-1">
                {statistics.average > 0 ? (
                  <>
                    {statistics.average.toFixed(1)}
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </>
                ) : (
                  "—"
                )}
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
                <div className="flex flex-col gap-1.5">
                  {[5, 4, 3, 2, 1].map((value) => {
                    const count = statistics.distribution[value] || 0;
                    const percentage = (count / statistics.total) * 100;
                    return (
                      <div key={value} className="flex items-center gap-2">
                        <span className="text-xs w-6 text-right">{value}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-left">
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
              <label className="text-sm font-medium mb-2 block">
                Ваша оценка <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRating(value as EvaluationRating);
                    }}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    aria-label={`Оценить ${value} из 5`}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 transition-all duration-200",
                        (hoveredRating >= value || rating >= value)
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-muted-foreground hover:text-yellow-300"
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <div className="ml-3 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {rating} из 5
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              {rating === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Наведите курсор на звезды и выберите оценку
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  Комментарий (необязательно)
                </label>
                {comment.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {comment.length} / 500
                  </span>
                )}
              </div>
              <Textarea
                id="comment"
                placeholder="Оставьте отзыв о работе агента... (максимум 500 символов)"
                value={comment}
                onChange={(e) => {
                  e.stopPropagation();
                  if (e.target.value.length <= 500) {
                    setComment(e.target.value);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                rows={4}
                maxLength={500}
                className={cn(
                  comment.length >= 450 && "border-orange-300 focus-visible:ring-orange-300"
                )}
              />
              {comment.length >= 450 && (
                <p className="text-xs text-orange-600 mt-1">
                  Осталось {500 - comment.length} символов
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
                  
                  return (
                    <div
                      key={`${evaluation.agentId}-${evaluation.createdAt}-${evaluation.updatedAt || ''}-${index}`}
                      className={cn(
                        "p-4 border rounded-lg space-y-2 transition-all",
                        isUserEvaluation && "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                              key={value}
                              className={cn(
                                "h-4 w-4",
                                evaluation.rating >= value
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
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
                      {evaluation.comment && (
                        <p className="text-sm text-foreground mt-2">{evaluation.comment}</p>
                      )}
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

