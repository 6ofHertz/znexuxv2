import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from '@firebase/auth';
import { auth } from '@/lib/firebase/config';
import { createUserProfile, updateUserProfile } from '@/lib/firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Initialize with a default value to prevent undefined context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => ({ error: new Error('Auth not initialized') }),
  signIn: async () => ({ error: new Error('Auth not initialized') }),
  signOut: async () => { throw new Error('Auth not initialized'); }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth not initialized. Check your Firebase credentials.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Update last login when user signs in
      if (firebaseUser) {
        try {
          await updateUserProfile(firebaseUser.uid, { 
            last_login: new Date().toISOString(),
            email_verified: firebaseUser.emailVerified 
          });
        } catch (error) {
          console.error('Error updating last login:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      return { error: new Error('Firebase Auth not initialized') };
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName: name });
      
      // Create user profile in Firestore
      await createUserProfile(user.uid, {
        email: email,
        name: name,
        email_verified: user.emailVerified
      });
      
      // NOTE: Email verification disabled - configure Firebase Console to enable
      // await sendEmailVerification(user);
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      return { error: new Error('Firebase Auth not initialized') };
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }
    
    await firebaseSignOut(auth);
  };

  const value = { user, loading, signUp, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};