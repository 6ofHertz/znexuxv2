import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Zap, TrendingUp, Calendar } from "lucide-react";
import { differenceInDays, startOfDay, eachDayOfInterval, format } from "date-fns";
import type { Task } from "@/types";

interface ProgressStreaksProps {
  tasks: Task[];
}

export const ProgressStreaks = ({ tasks }: ProgressStreaksProps) => {
  // Calculate streak data
  const calculateStreak = () => {
    const completedTasks = tasks
      .filter(t => t.completed && t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    if (completedTasks.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    }

    // Get unique completion dates
    const completionDates = Array.from(
      new Set(
        completedTasks.map(task => 
          startOfDay(new Date(task.completedAt!)).getTime()
        )
      )
    ).sort((a, b) => b - a);

    if (completionDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    }

    const today = startOfDay(new Date()).getTime();
    const yesterday = startOfDay(new Date(Date.now() - 86400000)).getTime();

    // Check if streak is still active (completed today or yesterday)
    const isStreakActive = 
      completionDates[0] === today || 
      completionDates[0] === yesterday;

    // Calculate current streak
    let currentStreak = 0;
    if (isStreakActive) {
      let checkDate = completionDates[0] === today ? today : yesterday;
      for (const date of completionDates) {
        if (date === checkDate) {
          currentStreak++;
          checkDate -= 86400000; // Go back one day
        } else if (date < checkDate) {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < completionDates.length; i++) {
      const dayDiff = (completionDates[i - 1] - completionDates[i]) / 86400000;
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastActiveDate: new Date(completionDates[0])
    };
  };

  const { currentStreak, longestStreak, lastActiveDate } = calculateStreak();

  // Get completion calendar for last 7 days
  const getLast7Days = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 6 * 86400000);
    const days = eachDayOfInterval({ start: sevenDaysAgo, end: today });
    
    return days.map(day => {
      const dayStart = startOfDay(day).getTime();
      const hasActivity = tasks.some(task => 
        task.completed && 
        task.completedAt && 
        startOfDay(new Date(task.completedAt)).getTime() === dayStart
      );
      return {
        date: day,
        hasActivity
      };
    });
  };

  const last7Days = getLast7Days();

  // Streak messages
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it up!";
    if (streak === 2) return "Two days strong! 💪";
    if (streak === 3) return "Three-peat! You're on fire! 🔥";
    if (streak === 5) return "5 days in a row! Unstoppable! 🚀";
    if (streak === 7) return "One week streak! Amazing! 🎉";
    if (streak === 14) return "Two weeks! You're a legend! 👑";
    if (streak === 30) return "30 days! Habit formed! 🏆";
    return `${streak} days in a row! Keep going! 🔥`;
  };

  // Streak color based on length
  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-muted-foreground";
    if (streak < 3) return "text-blue-500";
    if (streak < 7) return "text-amber-500";
    if (streak < 14) return "text-orange-500";
    return "text-red-500";
  };

  const getStreakIcon = (streak: number) => {
    if (streak === 0) return Calendar;
    if (streak < 7) return Zap;
    if (streak < 14) return Flame;
    return Trophy;
  };

  const StreakIcon = getStreakIcon(currentStreak);

  return (
    <Card className="cosmic-card p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">Progress Streaks</h3>
          </div>
          {currentStreak > 0 && (
            <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-red-500">
              Active
            </Badge>
          )}
        </div>

        {/* Main Streak Display */}
        <div className="text-center space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative"
            >
              {/* Streak Number */}
              <div className="relative inline-block">
                <motion.div
                  animate={{
                    scale: currentStreak > 0 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className={`text-7xl font-bold ${getStreakColor(currentStreak)}`}
                >
                  {currentStreak}
                </motion.div>
                
                {/* Icon overlay */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={currentStreak > 0 ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <StreakIcon className={`h-8 w-8 ${getStreakColor(currentStreak)}`} />
                </motion.div>
              </div>

              {/* Streak Label */}
              <div className="mt-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Day Streak
                </p>
                <p className={`text-base font-medium ${getStreakColor(currentStreak)} mt-1`}>
                  {getStreakMessage(currentStreak)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Celebration Animation */}
          {currentStreak > 0 && currentStreak % 5 === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl"
            >
              🎉 🎊 ✨
            </motion.div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Longest Streak */}
          <div className="text-center p-4 rounded-lg bg-muted/30 border border-border">
            <Trophy className="h-5 w-5 mx-auto mb-2 text-amber-500" />
            <div className="text-2xl font-bold text-foreground">{longestStreak}</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              Longest Streak
            </p>
          </div>

          {/* Total Completed */}
          <div className="text-center p-4 rounded-lg bg-muted/30 border border-border">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-foreground">
              {tasks.filter(t => t.completed).length}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              Total Completed
            </p>
          </div>
        </div>

        {/* 7-Day Activity Calendar */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Last 7 Days
          </p>
          <div className="flex justify-between gap-2">
            {last7Days.map((day, index) => (
              <motion.div
                key={day.date.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-1 text-center"
              >
                <div
                  className={`h-12 rounded-lg border-2 transition-all ${
                    day.hasActivity
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg'
                      : 'bg-muted/20 border-border'
                  }`}
                />
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  {format(day.date, 'EEE')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(day.date, 'd')}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-muted/20 border border-border" />
              <span>No activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-gradient-to-br from-green-500 to-emerald-600" />
              <span>Completed tasks</span>
            </div>
          </div>
        </div>

        {/* Last Active */}
        {lastActiveDate && (
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Last active:{" "}
              <span className="font-semibold text-foreground">
                {format(lastActiveDate, 'MMM dd, yyyy')}
              </span>
              {" "}
              ({differenceInDays(new Date(), lastActiveDate) === 0
                ? "today"
                : differenceInDays(new Date(), lastActiveDate) === 1
                ? "yesterday"
                : `${differenceInDays(new Date(), lastActiveDate)} days ago`})
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
