import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Stream } from "@/types";

export const StreamCard = ({
  name,
  description,
  progress,
  color,
  icon,
  tasksRemaining,
  nextDeadline,
}: Stream) => {
  return (
    <div className="clean-card p-5 cursor-pointer group">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground mb-1">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold" style={{ color }}>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="text-xs font-normal">
            {tasksRemaining} tasks
          </Badge>
          {nextDeadline && (
            <span className="text-muted-foreground">Due {nextDeadline}</span>
          )}
        </div>
      </div>
    </div>
  );
};