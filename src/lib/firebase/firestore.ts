import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp 
} from '@firebase/firestore';
import { db } from './config';
import type { Task, Stream, AuditLog } from '@/types';

// ============== TASKS ==============

export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const tasksRef = collection(db, 'tasks');
  const newTask = {
    ...taskData,
    user_id: userId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  const docRef = await addDoc(tasksRef, newTask);
  return { id: docRef.id, ...newTask };
};

export const getTasks = async (userId: string): Promise<Task[]> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef, 
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: data.updated_at?.toDate?.()?.toISOString()
    } as Task;
  });
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const deleteTask = async (taskId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

// ============== STREAMS ==============

export const createStream = async (userId: string, streamData: Omit<Stream, 'id' | 'user_id' | 'created_at'>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const streamsRef = collection(db, 'streams');
  const newStream = {
    ...streamData,
    user_id: userId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  const docRef = await addDoc(streamsRef, newStream);
  return { id: docRef.id, ...newStream };
};

export const getStreams = async (userId: string): Promise<Stream[]> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const streamsRef = collection(db, 'streams');
  const q = query(
    streamsRef, 
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: data.updated_at?.toDate?.()?.toISOString()
    } as Stream;
  });
};

export const updateStream = async (streamId: string, updates: Partial<Stream>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const streamRef = doc(db, 'streams', streamId);
  await updateDoc(streamRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const deleteStream = async (streamId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const streamRef = doc(db, 'streams', streamId);
  await deleteDoc(streamRef);
};

// ============== AUDIT LOGS ==============

export const createAuditLog = async (logData: Omit<AuditLog, 'id' | 'created_at'>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const logsRef = collection(db, 'audit_logs');
  const newLog = {
    ...logData,
    created_at: serverTimestamp()
  };
  
  const docRef = await addDoc(logsRef, newLog);
  return { id: docRef.id, ...newLog };
};

export const getAuditLogs = async (userId?: string): Promise<AuditLog[]> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const logsRef = collection(db, 'audit_logs');
  let q;
  
  if (userId) {
    q = query(
      logsRef,
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
  } else {
    q = query(logsRef, orderBy('created_at', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
    } as AuditLog;
  });
};