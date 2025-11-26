import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Play } from "lucide-react";
import { priorityColors } from "@/lib/utils";
import type { Task } from "@/types";

interface TodaysFocusProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onStartFocus: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

export const TodaysFocus = ({ tasks, onToggleTask, onStartFocus, onTaskClick }: TodaysFocusProps) => {
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed).length;
  
  return (
    <Card className="cosmic-card p-5">
      {/* Header with Stats */}
      <div className="mb-5 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Today's Tasks</h3>
          <Badge variant={completedToday === tasks.length ? "default" : "secondary"} className="text-xs">
            {completedToday}/{tasks.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {incompleteTasks.length === 0 ? "All tasks completed! 🎉" : `${incompleteTasks.length} remaining`}
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks scheduled for today</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={(e) => {
                // Don't trigger if clicking checkbox or button
                if ((e.target as HTMLElement).closest('button, [role="checkbox"]')) return;
                onTaskClick?.(task);
              }}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
                className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium leading-tight mb-1.5 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {task.stream}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: priorityColors[task.priority] }}
                    title={`${task.priority} priority`}
                  />
                  {task.tags && task.tags.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {task.tags[0]}
                    </Badge>
                  )}
                </div>
              </div>

              {!task.completed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onStartFocus(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};