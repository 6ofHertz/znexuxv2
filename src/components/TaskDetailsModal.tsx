import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, Calendar, Tag, Paperclip, CheckSquare, 
  Play, Pause, X, Plus, Upload, Download, ExternalLink,
  AlertCircle, Timer
} from "lucide-react";
import { priorityColors } from "@/lib/utils";
import type { Task, Subtask, Attachment } from "@/types";
import { toast } from "sonner";

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskDetailsModal = ({ 
  task, 
  open, 
  onOpenChange,
  onTaskUpdate 
}: TaskDetailsModalProps) => {
  const [newSubtask, setNewSubtask] = useState("");
  const [newTag, setNewTag] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize timer from task data
  useEffect(() => {
    if (task?.timeTracking) {
      setTimerSeconds(task.timeTracking.totalSeconds);
      setIsTimerRunning(task.timeTracking.isRunning);
    } else {
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  }, [task]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && task) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const newSeconds = prev + 1;
          // Auto-save every 10 seconds
          if (newSeconds % 10 === 0) {
            onTaskUpdate(task.id, {
              timeTracking: {
                totalSeconds: newSeconds,
                isRunning: true,
                startedAt: task.timeTracking?.startedAt || new Date().toISOString()
              }
            });
          }
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, task, onTaskUpdate]);

  if (!task) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerToggle = () => {
    const newIsRunning = !isTimerRunning;
    setIsTimerRunning(newIsRunning);
    
    onTaskUpdate(task.id, {
      timeTracking: {
        totalSeconds: timerSeconds,
        isRunning: newIsRunning,
        startedAt: newIsRunning ? new Date().toISOString() : task.timeTracking?.startedAt
      }
    });
    
    toast.success(newIsRunning ? 'Timer started' : 'Timer paused');
  };

  const handleTimerReset = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
    
    onTaskUpdate(task.id, {
      timeTracking: {
        totalSeconds: 0,
        isRunning: false
      }
    });
    
    toast.success('Timer reset');
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false
    };
    
    onTaskUpdate(task.id, {
      subtasks: [...(task.subtasks || []), subtask]
    });
    
    setNewSubtask("");
    toast.success('Subtask added');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    onTaskUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtaskId);
    onTaskUpdate(task.id, { subtasks: updatedSubtasks });
    toast.success('Subtask removed');
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (task.tags?.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    
    onTaskUpdate(task.id, {
      tags: [...(task.tags || []), newTag.trim()]
    });
    
    setNewTag("");
    toast.success('Tag added');
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = task.tags?.filter(t => t !== tag);
    onTaskUpdate(task.id, { tags: updatedTags });
    toast.success('Tag removed');
  };

  const handleFileUpload = () => {
    toast.info('File upload feature coming soon!');
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onTaskUpdate(task.id, { completed: !task.completed })}
              className="h-6 w-6"
            />
            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
              {task.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Priority, Stream, and Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="text-sm"
                style={{ 
                  borderColor: priorityColors[task.priority],
                  color: priorityColors[task.priority]
                }}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {task.priority.toUpperCase()} Priority
              </Badge>
              {task.stream && (
                <Badge variant="secondary" className="text-sm">
                  {task.stream}
                </Badge>
              )}
              {task.completed && task.completedAt && (
                <Badge variant="default" className="text-sm bg-green-600">
                  Completed {new Date(task.completedAt).toLocaleDateString()}
                </Badge>
              )}
            </div>

            {/* Time Tracker */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Time Tracking</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Est: {task.estimatedMinutes}m
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <div className="text-4xl font-mono font-bold text-foreground mb-2">
                    {formatTime(timerSeconds)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {timerSeconds >= task.estimatedMinutes * 60 && (
                      <span className="text-amber-500 font-medium">
                        Over estimate by {Math.floor((timerSeconds - task.estimatedMinutes * 60) / 60)}m
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleTimerToggle}
                    variant={isTimerRunning ? "destructive" : "default"}
                    size="lg"
                    className="gap-2"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleTimerReset}
                    variant="outline"
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className="font-medium text-foreground">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            <Separator />

            {/* Subtasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Subtasks</h3>
                  {totalSubtasks > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {completedSubtasks}/{totalSubtasks}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {task.subtasks?.map(subtask => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    />
                    <span className={`flex-1 text-sm ${
                      subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>
                      {subtask.title}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="flex-1"
                />
                <Button onClick={handleAddSubtask} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {task.tags?.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-2 pr-1 group"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-destructive/20 rounded p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <Separator />

            {/* Attachments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Attachments</h3>
              </div>

              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {task.attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground mb-3">
                  No attachments yet
                </div>
              )}

              <Button
                onClick={handleFileUpload}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </div>

            {/* Metadata */}
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
              <p>Created: {new Date(task.created_at).toLocaleString()}</p>
              {task.updated_at && (
                <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
