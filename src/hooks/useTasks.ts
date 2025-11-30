import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { createTask, updateTask, getTasks } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import type { Task } from '@/types';
import { toast } from 'sonner';

/**
 * ✅ DIRECTIVE 3: Task Engine Hook
 * Real-time CRUD operations for tasks
 * - Fetches tasks ordered by priority and created_at
 * - Provides addTask() and toggleTask() functions
 * - Tasks persist across sessions - checked boxes stay checked!
 */
export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      // Real-time subscription - instant updates!
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tasksData: Task[] = [];
          snapshot.forEach((doc) => {
            tasksData.push({
              id: doc.id,
              ...doc.data()
            } as Task);
          });
          
          // Sort by priority (high > medium > low) and then by created_at
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          tasksData.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          
          setTasks(tasksData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching tasks:', err);
          setError(err as Error);
          setLoading(false);
          toast.error('Failed to load tasks');
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up tasks listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a new task
   * @param title - Task title
   * @param streamId - Stream ID or name this task belongs to
   * @param priority - Task priority (low, medium, high)
   * @param additionalData - Optional task data (description, estimatedMinutes, etc.)
   */
  const addTask = async (
    title: string,
    streamId: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    additionalData?: Partial<Task>
  ) => {
    if (!user) {
      toast.error('You must be logged in to create a task');
      throw new Error('User not authenticated');
    }

    try {
      const taskData: Partial<Task> = {
        title,
        stream: streamId,
        priority,
        completed: false,
        estimatedMinutes: 60,
        ...additionalData
      };

      await createTask(user.uid, taskData);
      toast.success(`Task "${title}" created!`);
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  };

  /**
   * Toggle task completion status
   * @param id - Task ID
   */
  const toggleTask = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to update tasks');
      throw new Error('User not authenticated');
    }

    const task = tasks.find(t => t.id === id);
    if (!task) {
      toast.error('Task not found');
      return;
    }

    try {
      const newCompletedStatus = !task.completed;
      await updateTask(id, {
        completed: newCompletedStatus,
        completedAt: newCompletedStatus ? new Date().toISOString() : undefined
      });

      if (newCompletedStatus) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  };

  /**
   * Get tasks for a specific stream
   * @param streamId - Stream ID or name
   */
  const getTasksByStream = (streamId: string) => {
    return tasks.filter(t => t.stream === streamId);
  };

  /**
   * Get incomplete tasks
   */
  const getIncompleteTasks = () => {
    return tasks.filter(t => !t.completed);
  };

  /**
   * Get completed tasks
   */
  const getCompletedTasks = () => {
    return tasks.filter(t => t.completed);
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    getTasksByStream,
    getIncompleteTasks,
    getCompletedTasks,
    refetch: async () => {
      // The real-time listener automatically refetches
      // But provide manual refetch if needed
      if (user) {
        try {
          const tasksData = await getTasks(user.uid);
          setTasks(tasksData);
        } catch (err) {
          console.error('Error refetching tasks:', err);
        }
      }
    }
  };
};
