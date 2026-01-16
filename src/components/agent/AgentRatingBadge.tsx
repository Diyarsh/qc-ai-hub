import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AgentEvaluationService } from "@/services/agent-evaluation.service";
import { AgentEvaluationDialog } from "./AgentEvaluationDialog";

interface AgentRatingBadgeProps {
  agentId: string;
}

export const AgentRatingBadge: React.FC<AgentRatingBadgeProps> = ({ agentId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);

  const updateStats = React.useCallback(() => {
    const stats = AgentEvaluationService.getStatistics(agentId);
    setAverageRating(stats.average > 0 ? stats.average : null);
    setRatingCount(stats.total);
  }, [agentId]);

  useEffect(() => {
    updateStats();
  }, [agentId, updateStats]);

  useEffect(() => {
    if (!isDialogOpen) {
      // Обновляем статистику после закрытия диалога
      updateStats();
    }
  }, [isDialogOpen, updateStats]);

  if (averageRating === null && ratingCount === 0) {
    return (
      <>
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-accent text-xs"
          data-rating-badge
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsDialogOpen(true);
          }}
        >
          Оценить
        </Badge>
        <AgentEvaluationDialog
          agentId={agentId}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            updateStats();
          }}
        />
      </>
    );
  }

  return (
    <>
      <Badge
        variant="outline"
        className="cursor-pointer hover:bg-accent text-xs flex items-center gap-1"
        data-rating-badge
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDialogOpen(true);
        }}
      >
        <span>{averageRating?.toFixed(1)}/3</span>
        {ratingCount > 0 && <span className="text-muted-foreground">({ratingCount})</span>}
      </Badge>
      <AgentEvaluationDialog
        agentId={agentId}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          updateStats();
        }}
      />
    </>
  );
};
