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
  serverTimestamp,
  setDoc
} from '@firebase/firestore';
import { db } from './config';
import type { Task, Stream, Note, AuditLog, UserProfile } from '@/types';

// ============== USER PROFILES ==============

export const createUserProfile = async (userId: string, profileData: { email: string; name: string; email_verified: boolean }) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, 'users', userId);
  const newProfile = {
    email: profileData.email,
    name: profileData.name,
    email_verified: profileData.email_verified,
    created_at: serverTimestamp(),
    last_login: serverTimestamp()
  };
  
  await setDoc(userRef, newProfile);
  return { id: userId, ...newProfile };
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    email: data.email,
    name: data.name,
    email_verified: data.email_verified || false,
    created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    last_login: data.last_login?.toDate?.()?.toISOString()
  } as UserProfile;
};

export const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};

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

// ============== NOTES ==============

export const createNote = async (userId: string, noteData: Omit<Note, 'id' | 'user_id' | 'created_at'>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const notesRef = collection(db, 'notes');
  const newNote = {
    ...noteData,
    user_id: userId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  const docRef = await addDoc(notesRef, newNote);
  return { id: docRef.id, ...newNote };
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const notesRef = collection(db, 'notes');
  const q = query(
    notesRef, 
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
    } as Note;
  });
};

export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const noteRef = doc(db, 'notes', noteId);
  await updateDoc(noteRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const deleteNote = async (noteId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  
  const noteRef = doc(db, 'notes', noteId);
  await deleteDoc(noteRef);
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