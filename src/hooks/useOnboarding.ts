import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStatus {
  completed: boolean;
  lastShown: number;
  steps: {
    welcome: boolean;
    streams: boolean;
    tasks: boolean;
    analytics: boolean;
  };
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'userPreferences', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOnboardingStatus(data.onboarding || {
            completed: false,
            lastShown: 0,
            steps: {
              welcome: false,
              streams: false,
              tasks: false,
              analytics: false,
            },
          });
        } else {
          // New user - set default onboarding status
          const defaultStatus: OnboardingStatus = {
            completed: false,
            lastShown: 0,
            steps: {
              welcome: false,
              streams: false,
              tasks: false,
              analytics: false,
            },
          };
          setOnboardingStatus(defaultStatus);
        }
      } catch (error) {
        console.error('Error fetching onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [user]);

  const updateOnboardingStatus = async (status: Partial<OnboardingStatus>) => {
    if (!user) return;

    const newStatus = { ...onboardingStatus, ...status } as OnboardingStatus;
    setOnboardingStatus(newStatus);

    try {
      const docRef = doc(db, 'userPreferences', user.uid);
      await setDoc(docRef, { onboarding: newStatus }, { merge: true });
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const completeOnboarding = async () => {
    await updateOnboardingStatus({
      completed: true,
      lastShown: Date.now(),
      steps: {
        welcome: true,
        streams: true,
        tasks: true,
        analytics: true,
      },
    });
  };

  const resetOnboarding = async () => {
    await updateOnboardingStatus({
      completed: false,
      lastShown: 0,
      steps: {
        welcome: false,
        streams: false,
        tasks: false,
        analytics: false,
      },
    });
  };

  const shouldShowOnboarding = () => {
    return onboardingStatus && !onboardingStatus.completed;
  };

  return {
    onboardingStatus,
    loading,
    shouldShowOnboarding,
    updateOnboardingStatus,
    completeOnboarding,
    resetOnboarding,
  };
};
