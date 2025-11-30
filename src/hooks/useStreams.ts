import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { createStream, updateStream as firestoreUpdateStream } from '@/lib/firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import type { Stream } from '@/types';
import { toast } from 'sonner';

/**
 * ✅ DIRECTIVE 2: Stream Manager Hook
 * Real-time CRUD operations for learning streams
 * - Subscribes to user's streams collection
 * - Provides addStream() and updateStream() functions
 * - Instant local updates with cloud sync
 */
export const useStreams = () => {
  const { user } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
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
      const streamsRef = collection(db, 'streams');
      const q = query(
        streamsRef,
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      // Real-time subscription - updates instantly!
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const streamsData: Stream[] = [];
          snapshot.forEach((doc) => {
            streamsData.push({
              id: doc.id,
              ...doc.data()
            } as Stream);
          });
          
          setStreams(streamsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching streams:', err);
          setError(err as Error);
          setLoading(false);
          toast.error('Failed to load streams');
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up streams listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a new stream
   * @param name - Stream name (e.g., "IBM Security")
   * @param color - Hex color code (e.g., "#3b82f6")
   * @param icon - Emoji icon (optional)
   * @param description - Stream description (optional)
   */
  const addStream = async (
    name: string,
    color: string,
    icon?: string,
    description?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to create a stream');
      throw new Error('User not authenticated');
    }

    try {
      const streamData: Partial<Stream> = {
        name,
        color,
        icon,
        description,
        progress: 0,
        tasksRemaining: 0
      };

      await createStream(user.uid, streamData);
      toast.success(`Stream "${name}" created!`, {
        description: 'Start adding tasks to track your progress'
      });
    } catch (err) {
      console.error('Error creating stream:', err);
      toast.error('Failed to create stream');
      throw err;
    }
  };

  /**
   * Update an existing stream
   * @param id - Stream ID
   * @param data - Partial stream data to update
   */
  const updateStream = async (id: string, data: Partial<Stream>) => {
    if (!user) {
      toast.error('You must be logged in to update a stream');
      throw new Error('User not authenticated');
    }

    try {
      await firestoreUpdateStream(id, data);
      toast.success('Stream updated!');
    } catch (err) {
      console.error('Error updating stream:', err);
      toast.error('Failed to update stream');
      throw err;
    }
  };

  return {
    streams,
    loading,
    error,
    addStream,
    updateStream,
    refetch: () => {
      // The real-time listener automatically refetches
      // This is a no-op for API consistency
    }
  };
};
