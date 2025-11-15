import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StreamCard } from "@/components/StreamCard";
import { TodaysFocus } from "@/components/TodaysFocus";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { StatsOverview } from "@/components/StatsOverview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SeedDataButton } from "@/components/SeedDataButton";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Upload, LogOut, Shield, LayoutDashboard, Target, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { getTasks, getStreams, updateTask } from "@/lib/firebase/firestore";
import { logAudit } from "@/lib/audit";
import type { Task, Stream } from "@/types";
import { toast } from "sonner";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setDataLoading(true);
        
        const [tasksData, streamsData] = await Promise.all([
          getTasks(user.uid),
          getStreams(user.uid)
        ]);

        setTasks(tasksData);
        setStreams(streamsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        
        // Show specific Firebase error
        if (error.code === 'permission-denied') {
          toast.error('Database permissions not configured. Please deploy Firestore rules first.', {
            duration: 8000,
            description: 'Visit Firebase Console → Firestore → Rules and deploy the security rules.'
          });
        } else if (error.message?.includes('index')) {
          toast.error('Missing Firestore index. Click to create it now.', {
            duration: 10000,
            description: 'Your database needs an index to run queries. See DEPLOY_FIRESTORE_NOW.md for instructions.',
            action: {
              label: 'Create Index',
              onClick: () => {
                window.open('https://console.firebase.google.com/v1/r/project/znexux-954bd/firestore/indexes?create_composite=Ckxwcm9qZWN0cy96bmV4dXgtOTU0YmQvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3N0cmVhbXMvaW5kZXhlcy9fEAEaCwoHdXNlcl9pZBABGg4KCmNyZWF0ZWRfYXQQAhoMCghfX25hbWVfXxAC', '_blank');
              }
            }
          });
        } else {
          toast.error(`Failed to load data: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user) return;

    try {
      await updateTask(taskId, { completed: !task.completed });

      setTasks(tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      toast.success(task.completed ? 'Task reopened' : 'Task completed!');
      
      await logAudit({
        userId: user.uid,
        action: 'task_update',
        metadata: { taskId, completed: !task.completed }
      });
    } catch (error: any) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleStartFocus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      console.log("Starting focus session for:", task.title);
      toast.success(`Focus session started for: ${task.title}`);
    }
  };

  const handleSignOut = async () => {
    try {
      if (user) {
        await logAudit({
          userId: user.uid,
          action: 'logout',
          metadata: {}
        });
      }
      await signOut();
      navigate("/auth");
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your learning universe...</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const activeStreams = streams.length;
  const overallProgress = streams.length > 0 ? Math.round(streams.reduce((acc, stream) => acc + stream.progress, 0) / streams.length) : 0;
  const totalHours = Math.floor(tasks.filter(task => task.completed).reduce((acc, task) => acc + task.estimatedMinutes, 0) / 60);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-600/10">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/2cb93a06-abae-4577-bb6a-5d7bf1a22498/generated_images/modern-minimalist-logo-design-for-zurvan-f88db011-20251115173210.jpg" 
                  alt="ZURVAN Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground gold-glow">
                  ZURVAN
                </h1>
                <p className="text-xs text-muted-foreground">Unified Learning Dashboard</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 hidden md:flex">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <ThemeToggle />
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/audit")}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <LayoutDashboard className="h-4 w-4" />
            One Dashboard. All Your Learning.
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Track Everything in One Place
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Red Hat, IBM, Skillsoft, University, CyberDojo, Personal Projects — all unified, organized, and trackable.
          </p>
        </div>

        {/* Show Seed Button if no streams exist */}
        {streams.length === 0 && !dataLoading && (
          <div className="flex justify-center mb-8">
            <SeedDataButton />
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview
            totalHours={totalHours}
            completedTasks={completedTasks}
            activeStreams={activeStreams}
            overallProgress={overallProgress}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Focus & Timer */}
          <div className="lg:col-span-4 space-y-6">
            {/* Today's Priorities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Today's Priorities
                </h3>
              </div>
              <TodaysFocus
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onStartFocus={handleStartFocus}
              />
            </div>

            {/* Pomodoro Timer */}
            <PomodoroTimer />
          </div>

          {/* Right Content: Learning Streams */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  Your Learning Streams
                </h3>
                <div className="text-sm text-muted-foreground">
                  {activeStreams} active {activeStreams === 1 ? 'stream' : 'streams'}
                </div>
              </div>
              <p className="text-muted-foreground">
                All your courses, certifications, and projects organized by platform
              </p>
            </div>
            
            {streams.length === 0 ? (
              <div className="text-center py-16 px-4 bg-card border-2 border-dashed rounded-lg">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">No Learning Streams Yet</h4>
                  <p className="text-muted-foreground">
                    Click the "Seed My Data Now" button above to populate your dashboard with sample learning streams and get started! 🚀
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streams.map((stream) => (
                  <StreamCard key={stream.name} {...stream} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="text-center space-y-4">
            <h4 className="font-display text-xl font-semibold text-foreground">
              Why ZURVAN?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold text-foreground">Unified Tracking</h5>
                <p className="text-sm text-muted-foreground">
                  All platforms in one place. No more context switching.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold text-foreground">Clear Analytics</h5>
                <p className="text-sm text-muted-foreground">
                  Track focus, consistency, and growth over time.
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold text-foreground">Daily Priorities</h5>
                <p className="text-sm text-muted-foreground">
                  Know exactly what to focus on each day.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-12 pb-4">
          <p>ZURVAN — Your unified learning command center 🚀</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;