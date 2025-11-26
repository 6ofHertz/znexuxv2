export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedMinutes: number;
  stream?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
  // Enhanced features
  tags?: string[];
  timeTracking?: {
    totalSeconds: number;
    isRunning: boolean;
    startedAt?: string;
  };
  subtasks?: Subtask[];
  attachments?: Attachment[];
  dueDate?: string;
  completedAt?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface Stream {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  progress: number;
  color?: string;
  icon?: string;
  tasksRemaining?: number;
  nextDeadline?: string;
  created_at: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  email_verified: boolean;
  last_login?: string;
}