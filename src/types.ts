export interface Task {
  id: string;
  title: string;
  stream: string;
  priority: "high" | "medium" | "low";
  estimatedMinutes: number;
  completed: boolean;
}

export interface Stream {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  icon: string;
  tasksRemaining: number;
  nextDeadline?: string;
}
