import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { createTask, getStreams, updateStream } from "@/lib/firebase/firestore";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";
import { CheckSquare, Calendar } from "lucide-react";
import type { Stream } from "@/types";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
  preselectedStream?: string;
}

export const AddTaskDialog = ({ open, onOpenChange, onTaskCreated, preselectedStream }: AddTaskDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stream: preselectedStream || "",
    priority: "medium" as "low" | "medium" | "high",
    estimatedMinutes: 60,
    deadline: ""
  });

  useEffect(() => {
    if (preselectedStream) {
      setFormData(prev => ({ ...prev, stream: preselectedStream }));
    }
  }, [preselectedStream]);

  useEffect(() => {
    const fetchStreams = async () => {
      if (!user) return;
      
      try {
        setLoadingStreams(true);
        const streamsData = await getStreams(user.uid);
        setStreams(streamsData);
      } catch (error) {
        console.error("Error fetching streams:", error);
        toast.error("Failed to load streams");
      } finally {
        setLoadingStreams(false);
      }
    };

    if (open) {
      fetchStreams();
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a task");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    if (!formData.stream) {
      toast.error("Please select a learning stream");
      return;
    }

    setLoading(true);

    try {
      const taskData: any = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        stream: formData.stream,
        priority: formData.priority,
        estimatedMinutes: formData.estimatedMinutes,
        completed: false
      };

      // Add deadline if provided
      if (formData.deadline) {
        taskData.deadline = new Date(formData.deadline).toISOString();
      }

      await createTask(user.uid, taskData);

      // Update stream's tasksRemaining count
      const selectedStream = streams.find(s => s.id === formData.stream || s.name === formData.stream);
      if (selectedStream) {
        await updateStream(selectedStream.id, {
          tasksRemaining: (selectedStream.tasksRemaining || 0) + 1,
          lastActivityDate: new Date().toISOString()
        });
      }

      await logAudit({
        userId: user.uid,
        action: 'task_created',
        metadata: { 
          taskTitle: formData.title,
          stream: formData.stream,
          priority: formData.priority
        }
      });

      toast.success("Task created!", {
        description: `${formData.title} has been added to ${formData.stream}`
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        stream: preselectedStream || "",
        priority: "medium",
        estimatedMinutes: 60,
        deadline: ""
      });

      onOpenChange(false);
      onTaskCreated?.();
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Add New Task
          </DialogTitle>
          <DialogDescription>
            Create a new learning task and assign it to a stream. Set priorities and deadlines to stay on track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Complete Python basics module"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={200}
            />
          </div>

          {/* Learning Stream */}
          <div className="space-y-2">
            <Label htmlFor="stream">Learning Stream *</Label>
            {loadingStreams ? (
              <div className="text-sm text-muted-foreground p-2">Loading streams...</div>
            ) : streams.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2 border rounded-md">
                No streams found. Create a stream first!
              </div>
            ) : (
              <Select value={formData.stream} onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
                <SelectTrigger id="stream">
                  <SelectValue placeholder="Select a stream..." />
                </SelectTrigger>
                <SelectContent>
                  {streams.map(stream => (
                    <SelectItem key={stream.id} value={stream.name}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stream.color }} />
                        {stream.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details, notes, or steps for this task..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={1000}
              rows={3}
            />
          </div>

          {/* Priority and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <Label htmlFor="estimatedMinutes">Est. Time (min)</Label>
              <Input
                id="estimatedMinutes"
                type="number"
                min="5"
                max="600"
                step="5"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 60 }))}
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Deadline (Optional)
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim() || !formData.stream || streams.length === 0}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
