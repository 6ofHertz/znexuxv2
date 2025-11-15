import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { createStream } from "@/lib/firebase/firestore";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface AddStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStreamCreated?: () => void;
}

const streamTypes = [
  { value: "practice", label: "🥋 Practice", color: "#3b82f6" },
  { value: "academic", label: "📚 Academic", color: "#10b981" },
  { value: "training", label: "💻 Training", color: "#8b5cf6" },
  { value: "bootcamp", label: "⚡ Bootcamp", color: "#f59e0b" },
  { value: "certification", label: "🏆 Certification", color: "#ef4444" },
  { value: "custom", label: "✨ Custom", color: "#6366f1" }
];

export const AddStreamDialog = ({ open, onOpenChange, onStreamCreated }: AddStreamDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    color: "#3b82f6"
  });

  const handleTypeChange = (value: string) => {
    const selectedType = streamTypes.find(t => t.value === value);
    setFormData(prev => ({
      ...prev,
      type: value,
      color: selectedType?.color || "#3b82f6"
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a stream");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a stream name");
      return;
    }

    setLoading(true);

    try {
      await createStream(user.uid, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        progress: 0,
        color: formData.color,
        icon: streamTypes.find(t => t.value === formData.type)?.label.split(' ')[0] || "✨",
        tasksRemaining: 0
      });

      await logAudit({
        userId: user.uid,
        action: 'stream_created',
        metadata: { streamName: formData.name }
      });

      toast.success("Learning stream created!", {
        description: `${formData.name} has been added to your dashboard`
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "",
        color: "#3b82f6"
      });

      onOpenChange(false);
      onStreamCreated?.();
    } catch (error: any) {
      console.error("Error creating stream:", error);
      toast.error("Failed to create stream", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Learning Stream
          </DialogTitle>
          <DialogDescription>
            Add a new learning stream to organize your educational journey. Choose from preset types or create a custom stream.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Stream Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Stream Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a stream type..." />
              </SelectTrigger>
              <SelectContent>
                {streamTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stream Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Stream Name *</Label>
            <Input
              id="name"
              placeholder="e.g., CyberDojo Stream, AWS Certification Track"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief overview of what you'll learn in this stream..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Color Preview */}
          <div className="space-y-2">
            <Label htmlFor="color">Stream Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-10 cursor-pointer"
              />
              <div className="flex items-center gap-2 flex-1 p-2 rounded-lg border" style={{ borderColor: formData.color }}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
                <span className="text-sm text-muted-foreground">Preview</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? "Creating..." : "Create Stream"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
