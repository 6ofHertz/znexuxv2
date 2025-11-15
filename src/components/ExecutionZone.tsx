import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, Play, Pause, RotateCcw, Upload, 
  ChevronDown, ChevronRight, Plus, FileText
} from "lucide-react";
import { useState } from "react";
import type { Task, Stream } from "@/types";
import { toast } from "sonner";

interface ExecutionZoneProps {
  tasks: Task[];
  streams: Stream[];
  onToggleTask: (taskId: string) => void;
}

export const ExecutionZone = ({ tasks, streams, onToggleTask }: ExecutionZoneProps) => {
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [expandedStreams, setExpandedStreams] = useState<Set<string>>(new Set());
  const [noteText, setNoteText] = useState("");

  // Get today's tasks (tasks created today or due soon)
  const todaysTasks = tasks.filter(t => !t.completed).slice(0, 5);

  // Group tasks by stream
  const tasksByStream = streams.map(stream => ({
    stream,
    tasks: tasks.filter(t => {
      const streamName = stream.name || (stream as any).title;
      return t.stream === streamName || t.stream === stream.id;
    })
  }));

  const toggleStreamExpanded = (streamId: string) => {
    setExpandedStreams(prev => {
      const next = new Set(prev);
      if (next.has(streamId)) {
        next.delete(streamId);
      } else {
        next.add(streamId);
      }
      return next;
    });
  };

  const handleFileUpload = () => {
    toast.success("File upload feature coming soon!");
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      toast.success("Note saved!");
      setNoteText("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground">
            Execution Zone
          </h2>
          <p className="text-muted-foreground">
            Your daily action center for focused work
          </p>
        </motion.div>
      </div>

      {/* Top Row: Today's Tasks & Focus Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Action Board */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
              <Badge variant="secondary">{todaysTasks.length} tasks</Badge>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {todaysTasks.length > 0 ? (
                  todaysTasks.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              task.priority === 'high' ? 'border-red-500 text-red-700 dark:text-red-400' :
                              task.priority === 'medium' ? 'border-amber-500 text-amber-700 dark:text-amber-400' :
                              'border-blue-500 text-blue-700 dark:text-blue-400'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {task.estimatedMinutes}m
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => toast.success(`Starting focus session for: ${task.title}`)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No tasks for today</p>
                    <p className="text-xs">You're all clear! 🎉</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Focus Mode Launchpad */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 cosmic-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Focus Mode Timer</h3>
            
            <div className="flex flex-col items-center justify-center py-8">
              {/* Animated Timer Ring */}
              <motion.div
                animate={isRunning ? { rotate: 360 } : {}}
                transition={isRunning ? { duration: 60, repeat: Infinity, ease: "linear" } : {}}
                className="relative"
              >
                <div className="w-48 h-48 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground font-mono">
                      {formatTime(focusTime)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {isRunning ? 'Focus Mode Active' : 'Ready to Focus'}
                    </div>
                  </div>
                </div>
                
                {/* Pulsing effect when running */}
                {isRunning && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-4 border-primary"
                  />
                )}
              </motion.div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-8">
                <Button
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  className="gap-2"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Focus
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setFocusTime(25 * 60);
                    setIsRunning(false);
                  }}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Preset times */}
              <div className="flex gap-2 mt-4">
                {[15, 25, 45].map(mins => (
                  <Button
                    key={mins}
                    size="sm"
                    variant="ghost"
                    onClick={() => setFocusTime(mins * 60)}
                    className="text-xs"
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row: Upload Evidence & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Evidence Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Upload Evidence</h3>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                 onClick={handleFileUpload}>
              <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Screenshots, PDFs, notes, lab outputs
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Choose Files
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Recent uploads:</p>
              <div className="text-center py-4 text-xs text-muted-foreground">
                No uploads yet
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notes & Reflections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Quick Note</h3>
            </div>
            
            <Textarea
              placeholder="Capture your learning insights, reflections, or quick notes..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[180px] mb-3"
            />
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {noteText.length} characters
              </p>
              <Button onClick={handleSaveNote} disabled={!noteText.trim()}>
                Save Note
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Stream-Specific Task Queues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 cosmic-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Stream Task Queues</h3>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="space-y-3">
            {tasksByStream.map(({ stream, tasks: streamTasks }) => {
              const isExpanded = expandedStreams.has(stream.id);
              // Handle both 'name' and 'title' with null safety
              const streamName = stream.name || (stream as any).title || 'Unnamed Stream';
              const displayName = typeof streamName === 'string' ? streamName.split('(')[0].trim() : 'Unnamed Stream';
              
              return (
                <div key={stream.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleStreamExpanded(stream.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stream.color }}
                      />
                      <span className="font-medium text-foreground">{displayName}</span>
                    </div>
                    <Badge variant="secondary">{streamTasks.length} tasks</Badge>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-2 bg-muted/20">
                          {streamTasks.length > 0 ? (
                            streamTasks.map(task => (
                              <div
                                key={task.id}
                                className="flex items-center gap-3 p-2 rounded bg-card hover:bg-muted/50 transition-colors"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className={`text-sm flex-1 ${
                                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {task.title}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No tasks in this stream yet
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};