import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { seedStreamsWithTasks } from '../lib/firebase/seedData';
import { Button } from './ui/button';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export function SeedDataButton() {
  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    if (!user) {
      setStatus('error');
      setMessage('Please log in first to seed your data');
      return;
    }

    setIsSeeding(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log('🌱 Starting comprehensive data seeding...');
      
      // Seed streams with all categorized tasks
      setMessage('Creating your 5 learning streams with all tasks...');
      const result = await seedStreamsWithTasks(user.uid);

      setStatus('success');
      setMessage(`✅ Successfully seeded ${result.streams.length} learning streams with ${result.tasksCreated} categorized tasks! Refreshing page...`);
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error seeding data:', error);
      setStatus('error');
      
      // Better error messages
      if (error.code === 'permission-denied') {
        setMessage('❌ Error: Missing or insufficient permissions. Please deploy Firestore rules first. See FIX_PERMISSIONS_NOW.md');
      } else if (error.message?.includes('permission')) {
        setMessage('❌ Error: Permission denied. Make sure Firestore rules are deployed.');
      } else {
        setMessage(`❌ Error: ${error.message || 'Failed to seed data'}`);
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700">
      <div className="text-center">
        <h3 className="text-lg font-semibold flex items-center gap-2 justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Seed Your Learning Data
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Populate your dashboard with 5 learning streams and all categorized tasks
        </p>
      </div>

      <Button 
        onClick={handleSeed}
        disabled={isSeeding || !user}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isSeeding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Seeding Data...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Seed My Data Now
          </>
        )}
      </Button>

      {message && (
        <div className={`flex items-start gap-2 p-3 rounded-md text-sm max-w-md ${
          status === 'success' 
            ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200' 
            : status === 'error'
            ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200'
            : 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200'
        }`}>
          {status === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          {status === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      {!user && (
        <p className="text-xs text-red-600 dark:text-red-400">
          ⚠️ You must be logged in to seed data. Click "Sign In" in the top-right corner.
        </p>
      )}
      
      {user && (
        <p className="text-xs text-muted-foreground">
          ✅ Logged in as: {user.email}
        </p>
      )}
    </div>
  );
}