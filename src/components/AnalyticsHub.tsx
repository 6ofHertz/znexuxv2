import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Flame, Target, Clock, AlertCircle } from "lucide-react";
import type { Stream, Task } from "@/types";

interface AnalyticsHubProps {
  streams: Stream[];
  tasks: Task[];
}

export const AnalyticsHub = ({ streams, tasks }: AnalyticsHubProps) => {
  // Calculate focus hours (mock data for now - will be real when tracking is added)
  const focusHoursData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 5.2 },
    { day: 'Sun', hours: 4.8 }
  ];

  // Stream distribution data
  const streamColors: { [key: string]: string } = {
    'CyberDojo': '#06FFA5',
    'Computer Science': '#7209B7',
    'Skillsoft': '#FF6B35',
    'IBM': '#0F62FE',
    'Red Hat': '#EE0000'
  };

  const streamDistribution = streams.map(stream => {
    // Handle both 'name' and 'title' for backwards compatibility
    const streamName = String(stream.name || (stream as any).title || 'Unnamed Stream');
    const safeName = streamName.split('(')[0].trim();
    const shortName = safeName.replace(' Stream', '').replace('/ Percipio', '').replace('/i3 Bootcamp', '').trim();
    return {
      name: shortName,
      value: stream.progress || 10, // Use progress as proxy for time spent
      color: stream.color || streamColors[shortName] || '#888888'
    };
  });

  // Task velocity data (mock)
  const taskVelocityData = [
    { week: 'W1', completed: 12, created: 15 },
    { week: 'W2', completed: 18, created: 20 },
    { week: 'W3', completed: 22, created: 18 },
    { week: 'W4', completed: 25, created: 22 }
  ];

  // Calculate overall progress
  const overallProgress = streams.length > 0 
    ? Math.round(streams.reduce((acc, s) => acc + s.progress, 0) / streams.length)
    : 0;

  // Calculate consistency score (mock - based on task completion rate)
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const consistencyScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const isConsistencyStrong = consistencyScore >= 70;

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground">
            Your Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Live growth metrics and progress visualization
          </p>
        </motion.div>
      </div>

      {/* Top Row: Focus Hours & Stream Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Hours Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Focus Hours (This Week)</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={focusHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {focusHoursData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)}h
              </p>
              <p className="text-sm text-muted-foreground">Total this week</p>
            </div>
          </Card>
        </motion.div>

        {/* Stream Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-foreground">Stream Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={streamDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {streamDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {streamDistribution.map((stream, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ borderLeft: `3px solid ${stream.color}` }}
                >
                  {stream.name}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row: Task Velocity & Global Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Velocity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-foreground">Task Completion Velocity</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="created" fill="#f59e0b" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Consistency Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 cosmic-card h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className={`h-5 w-5 ${isConsistencyStrong ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <h3 className="text-lg font-semibold text-foreground">Consistency Score</h3>
              </div>
              <motion.div
                animate={isConsistencyStrong ? {
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.9, 1]
                } : {
                  scale: [1, 0.98, 1],
                  opacity: [0.8, 0.6, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-center my-8"
              >
                <div className="text-6xl font-bold text-foreground mb-2">
                  {consistencyScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Daily habit strength
                </div>
              </motion.div>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              isConsistencyStrong 
                ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
            }`}>
              {isConsistencyStrong ? '🔥 Strong momentum!' : '💪 Keep building!'}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row: Global Progress & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-foreground">Global Learning Progress</h3>
            </div>
            <div className="space-y-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Progress value={overallProgress} className="h-6" />
              </motion.div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {overallProgress}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Overall completion across all learning streams
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 cosmic-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.stream || 'General'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No upcoming deadlines</p>
                  <p className="text-xs">You're all caught up! 🎉</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};