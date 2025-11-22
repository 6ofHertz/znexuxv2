import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Settings interface
export interface UserSettings {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  displayDensity: 'compact' | 'comfortable';
  animationSpeed: 'fast' | 'normal' | 'slow' | 'off';
  
  // Pomodoro
  pomodoroFocusDuration: number; // minutes
  pomodoroBreakDuration: number; // minutes
  pomodoroLongBreakDuration: number; // minutes
  pomodoroAutoStartBreaks: boolean;
  pomodoroSoundEnabled: boolean;
  pomodoroVolume: number; // 0-100
  
  // Tasks
  defaultTaskPriority: 'low' | 'medium' | 'high';
  defaultEstimatedMinutes: number;
  autoArchiveCompletedDays: number; // 0 = never
  
  // Notifications
  notificationsEnabled: boolean;
  
  // Profile
  displayName?: string;
  profilePictureUrl?: string;
}

// Default settings
export const defaultSettings: UserSettings = {
  // Appearance
  theme: 'dark',
  displayDensity: 'comfortable',
  animationSpeed: 'normal',
  
  // Pomodoro
  pomodoroFocusDuration: 25,
  pomodoroBreakDuration: 5,
  pomodoroLongBreakDuration: 15,
  pomodoroAutoStartBreaks: false,
  pomodoroSoundEnabled: true,
  pomodoroVolume: 50,
  
  // Tasks
  defaultTaskPriority: 'medium',
  defaultEstimatedMinutes: 30,
  autoArchiveCompletedDays: 0,
  
  // Notifications
  notificationsEnabled: true,
  
  // Profile
  displayName: undefined,
  profilePictureUrl: undefined,
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage (will be replaced with Firestore in Phase 3)
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setSettings(defaultSettings);
        setLoading(false);
        return;
      }

      try {
        // For now, use localStorage (Phase 3 will add Firestore)
        const storageKey = `zurvan_settings_${user.uid}`;
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);

      // Save to localStorage (Phase 3 will add Firestore)
      const storageKey = `zurvan_settings_${user.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    if (!user) return;

    try {
      setSettings(defaultSettings);

      // Clear from localStorage
      const storageKey = `zurvan_settings_${user.uid}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
