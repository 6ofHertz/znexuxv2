import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { UserSettings } from '@/contexts/SettingsContext';

const SETTINGS_COLLECTION = 'user_settings';

/**
 * Get user settings from Firestore
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return settingsSnap.data() as UserSettings;
    }

    return null;
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

/**
 * Save user settings to Firestore
 */
export const saveUserSettings = async (userId: string, settings: UserSettings): Promise<void> => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    await setDoc(settingsRef, {
      ...settings,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

/**
 * Delete user settings from Firestore
 */
export const deleteUserSettings = async (userId: string): Promise<void> => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
    await deleteDoc(settingsRef);
  } catch (error) {
    console.error('Error deleting user settings:', error);
    throw error;
  }
};

/**
 * Initialize user settings with defaults
 */
export const initializeUserSettings = async (userId: string, defaultSettings: UserSettings): Promise<void> => {
  try {
    const existingSettings = await getUserSettings(userId);
    if (!existingSettings) {
      await saveUserSettings(userId, defaultSettings);
    }
  } catch (error) {
    console.error('Error initializing user settings:', error);
    throw error;
  }
};
