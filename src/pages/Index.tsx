import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrophyStreamCard } from "@/components/TrophyStreamCard";
import { AnalyticsHub } from "@/components/AnalyticsHub";
import { ExecutionZone } from "@/components/ExecutionZone";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SeedDataButton } from "@/components/SeedDataButton";
import { AddStreamDialog } from "@/components/AddStreamDialog";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { OnboardingTour } from "@/components/OnboardingTour";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Upload, LogOut, Shield, Sparkles, Trophy, Plus, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useStreams } from "@/hooks/useStreams";
import { useTasks } from "@/hooks/useTasks";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { shouldShowOnboarding, loading: onboardingLoading } = useOnboarding();
  const navigate = useNavigate();
  
  // ✅ DIRECTIVE 2 & 3: Use real-time hooks instead of manual fetching
  const { streams, loading: streamsLoading } = useStreams();
  const { tasks, loading: tasksLoading, toggleTask } = useTasks();
  
  const [showAddStream, setShowAddStream] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const dataLoading = streamsLoading || tasksLoading;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Check if onboarding should be shown
  useEffect(() => {
    if (!onboardingLoading && shouldShowOnboarding()) {
      setShowOnboarding(true);
    }
  }, [onboardingLoading, shouldShowOnboarding]);

  const handleToggleTask = async (taskId: string) => {
    if (!user) return;

    try {
      await toggleTask(taskId);
      
      await logAudit({
        userId: user.uid,
        action: 'task_update',
        metadata: { taskId }
      });
    } catch (error: any) {
      console.error('Error toggling task:', error);
      // Error toast already shown by toggleTask
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

  const handleStreamClick = (streamId: string) => {
    // Scroll to analytics section
    const analyticsSection = document.getElementById('analytics-hub');
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter to only show unique streams (one per stream name)
  const uniqueStreams = streams.reduce((acc, stream) => {
    const streamName = stream.name || (stream as any).title || 'Unnamed Stream';
    if (!acc.find(s => (s.name || (s as any).title) === streamName)) {
      acc.push(stream);
    }
    return acc;
  }, [] as typeof streams);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}

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
                <p className="text-xs text-muted-foreground">Unified Learning Command Center</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Add Task</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowAddStream(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Add Stream</span>
              </Button>
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/settings")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Settings</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            Instant Orientation → Deep Insight → Actionable Tasks
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Your Learning Command Center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unify all learning streams, get immediate clarity on priorities, and visualize progress in real time.
          </p>
        </div>

        {/* Show Seed Button if no streams exist */}
        {streams.length === 0 && !dataLoading && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <SeedDataButton />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Or start fresh by creating your own stream:</p>
              <Button onClick={() => setShowAddStream(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Stream
              </Button>
            </div>
          </div>
        )}

        {streams.length > 0 && (
          <>
            {/* ========== TROPHY SHELF: LEARNING STREAMS SHOWCASE ========== */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Trophy className="h-6 w-6 text-amber-500" />
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    Learning Streams Overview
                  </h2>
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Your mastery streams — displayed as trophies in your learning showcase
                </p>
              </div>

              {/* Trophy Shelf - Horizontal Scrollable Container */}
              <div className="relative">
                {/* Gradient Edges for depth */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                
                {/* Scrollable Trophy Container */}
                <div className="overflow-x-auto pb-8 px-4 scrollbar-hide">
                  <div className="flex gap-8 justify-center items-start min-w-max py-8">
                    {uniqueStreams.map((stream, index) => {
                      const streamName = stream.name || (stream as any).title || 'Unnamed Stream';
                      const streamTasks = tasks.filter(t => 
                        t.stream === stream.name || 
                        t.stream === (stream as any).title || 
                        t.stream === stream.id
                      );
                      const inProgressTasks = streamTasks.filter(t => !t.completed).length;
                      const completedTasks = streamTasks.filter(t => t.completed).length;
                      const nextTask = streamTasks.find(t => !t.completed);

                      // Calculate high priority count
                      const highPriorityCount = streamTasks.filter(
                        t => !t.completed && t.priority === 'high'
                      ).length;

                      // Calculate estimated time remaining (sum of incomplete tasks)
                      const estimatedMinutesRemaining = streamTasks
                        .filter(t => !t.completed)
                        .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

                      return (
                        <TrophyStreamCard
                          key={stream.id}
                          stream={stream}
                          tasksInProgress={inProgressTasks}
                          completedTasks={completedTasks}
                          nextTask={nextTask?.title}
                          onClick={() => handleStreamClick(stream.id)}
                          index={index}
                          highPriorityCount={highPriorityCount}
                          estimatedMinutesRemaining={estimatedMinutesRemaining}
                          lastActivityDate={(stream as any).lastActivityDate}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Shelf Base - Visual Element */}
                <div className="relative mt-4">
                  <div className="h-4 bg-gradient-to-b from-muted/50 to-muted rounded-t-lg border-t-2 border-border shadow-lg" />
                  <div className="h-8 bg-gradient-to-b from-muted to-muted/80 border-x-2 border-b-2 border-border shadow-xl" />
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-b from-muted/60 to-transparent blur-sm" />
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="relative mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">
                  Live Analytics & Metrics
                </span>
              </div>
            </div>

            {/* ========== MIDDLE SECTION: ANALYTICS HUB ========== */}
            <section id="analytics-hub" className="mb-12 scroll-mt-20">
              <AnalyticsHub streams={uniqueStreams} tasks={tasks} />
            </section>

            {/* Divider */}
            <div className="relative mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">
                  Action & Execution
                </span>
              </div>
            </div>

            {/* ========== BOTTOM SECTION: EXECUTION ZONE ========== */}
            <section className="mb-12">
              <ExecutionZone 
                tasks={tasks} 
                streams={uniqueStreams}
                onToggleTask={handleToggleTask}
              />
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-12 pb-4 border-t">
          <p className="mb-2">ZURVAN — Your unified learning command center 🚀</p>
          <p className="text-xs">
            Strategic learning coordination • Real-time progress tracking • Actionable execution
          </p>
        </footer>
      </div>

      {/* Dialogs */}
      <AddStreamDialog 
        open={showAddStream} 
        onOpenChange={setShowAddStream}
      />
      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask}
      />
    </div>
  );
};

export default Index;