import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, Analytics } from "firebase/analytics";

// Check if we have valid Firebase credentials
const hasValidCredentials = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== 'placeholder-key' &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('placeholder') &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'placeholder';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

// Only initialize Firebase if we have valid credentials
if (hasValidCredentials) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    auth = getAuth(app);
    storage = getStorage(app);
    db = getFirestore(app);

    // ✅ DIRECTIVE 1: Enable Offline Persistence
    // Allows instant read/write locally, syncs to cloud in background
    if (db) {
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log('✅ Offline persistence enabled - ZURVAN works offline!');
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
          } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Browser does not support offline persistence');
          } else {
            console.error('❌ Offline persistence error:', err);
          }
        });
    }

    // Analytics is optional and may not be supported in all environments
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Firebase Analytics not available:', error);
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase not initialized: Invalid or missing credentials. Add valid Firebase credentials to .env file.');
}

export { app, auth, storage, db, analytics };