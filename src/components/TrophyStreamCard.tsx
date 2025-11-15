import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CheckCircle2, Clock, TrendingUp, ChevronRight, Sparkles, AlertCircle, Timer, Calendar, Zap } from "lucide-react";
import type { Stream } from "@/types";

interface TrophyStreamCardProps {
  stream: Stream;
  tasksInProgress: number;
  completedTasks: number;
  nextTask?: string;
  onClick?: () => void;
  index: number;
  highPriorityCount?: number;
  estimatedMinutesRemaining?: number;
  lastActivityDate?: string;
}

// Unified 3D Trophy Base Designs - Cradle/Slot System
const unifiedBaseDesigns = {
  Practice: (color: string) => (
    <div className="relative w-full h-24 flex items-end justify-center">
      {/* Dojo Mat Base with Slot */}
      <div className="relative">
        {/* Main Base Platform */}
        <div className="w-48 h-8 bg-gradient-to-b from-cyan-700 to-cyan-900 rounded-md shadow-2xl border-t-2 border-cyan-500/30 relative overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 grid grid-cols-12 gap-[1px] p-1 opacity-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-cyan-950 rounded-[1px]" />
            ))}
          </div>
          
          {/* Plaque Slot (center cradle) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full">
            <div className="w-full h-2 bg-gradient-to-b from-cyan-950 to-cyan-800 rounded-t-sm shadow-inner" />
          </div>
        </div>
        
        {/* Support Feet */}
        <div className="absolute -bottom-1 left-4 right-4 flex justify-between">
          <div className="w-3 h-2 bg-gradient-to-b from-cyan-800 to-cyan-950 rounded-b" />
          <div className="w-3 h-2 bg-gradient-to-b from-cyan-800 to-cyan-950 rounded-b" />
        </div>
      </div>
      
      {/* Ambient Shadow & Floor Reflection */}
      <div className="absolute -bottom-2 w-56 h-4 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg" />
    </div>
  ),
  
  Academic: (color: string) => (
    <div className="relative w-full h-24 flex items-end justify-center">
      {/* Book Stack Base with Slot */}
      <div className="relative">
        {/* Stack of Books */}
        <div className="relative">
          <div className="w-44 h-5 bg-gradient-to-r from-purple-800 to-purple-900 rounded-sm shadow-lg transform -rotate-1 border-t border-purple-600/30" />
          <div className="w-40 h-5 bg-gradient-to-r from-purple-700 to-purple-800 rounded-sm shadow-lg absolute -top-4 left-2 border-t border-purple-500/30" />
          <div className="w-48 h-6 bg-gradient-to-r from-purple-900 to-purple-950 rounded-md shadow-2xl absolute -top-9 border-t-2 border-purple-700/40">
            {/* Plaque Slot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full">
              <div className="w-full h-2 bg-gradient-to-b from-purple-950 to-purple-900 rounded-t-sm shadow-inner" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient Shadow & Floor Reflection */}
      <div className="absolute -bottom-2 w-56 h-4 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg" />
    </div>
  ),
  
  Training: (color: string) => (
    <div className="relative w-full h-24 flex items-end justify-center">
      {/* Digital Tablet Console with Slot */}
      <div className="relative">
        <div className="w-48 h-10 bg-gradient-to-b from-orange-700 to-orange-900 rounded-md shadow-2xl border-t-2 border-orange-500/30 relative">
          {/* Screen Glow */}
          <div className="absolute inset-2 bg-gradient-to-b from-orange-400/20 to-orange-600/10 rounded-sm" />
          
          {/* Plaque Slot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3">
            <div className="w-full h-full bg-gradient-to-b from-orange-950 to-orange-800 rounded-t-sm shadow-inner" />
          </div>
          
          {/* LED Indicators */}
          <div className="absolute bottom-1 right-2 flex gap-1">
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-orange-400" />
          </div>
        </div>
      </div>
      
      {/* Ambient Shadow & Floor Reflection */}
      <div className="absolute -bottom-2 w-56 h-4 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg" />
    </div>
  ),
  
  Bootcamp: (color: string) => (
    <div className="relative w-full h-24 flex items-end justify-center">
      {/* Server Rack with Slot */}
      <div className="relative">
        <div className="w-40 h-20 bg-gradient-to-b from-blue-800 to-blue-950 rounded-md shadow-2xl border border-blue-600/30 relative">
          {/* Server Bays */}
          <div className="grid grid-rows-4 gap-[3px] p-[3px] h-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-[2px] flex items-center gap-1 px-2 border-l-2 border-blue-700/50">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Plaque Slot (top mount) */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-3">
            <div className="w-full h-full bg-gradient-to-b from-blue-950 to-blue-900 rounded-t-sm shadow-inner border-x border-blue-800" />
          </div>
        </div>
      </div>
      
      {/* Ambient Shadow & Floor Reflection */}
      <div className="absolute -bottom-2 w-48 h-4 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg" />
    </div>
  ),
  
  Certifications: (color: string) => (
    <div className="relative w-full h-24 flex items-end justify-center">
      {/* VM Server Stack with Slot */}
      <div className="relative">
        <div className="w-44 h-18 bg-gradient-to-b from-red-800 to-red-950 rounded-md shadow-2xl border border-red-600/30 relative">
          {/* VM Terminal Rows */}
          <div className="grid grid-rows-3 gap-[2px] p-[4px] h-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-r from-red-950 to-red-900 rounded-[2px] flex items-center justify-between px-2 border-l-2 border-red-700/50">
                <div className="flex gap-[3px]">
                  <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                </div>
                <div className="text-[7px] text-red-300/60 font-mono">VM{i + 1}</div>
              </div>
            ))}
          </div>
          
          {/* Plaque Slot (top mount) */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-3">
            <div className="w-full h-full bg-gradient-to-b from-red-950 to-red-900 rounded-t-sm shadow-inner border-x border-red-800" />
          </div>
        </div>
      </div>
      
      {/* Ambient Shadow & Floor Reflection */}
      <div className="absolute -bottom-2 w-52 h-4 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-full blur-lg" />
    </div>
  ),
};

export const TrophyStreamCard = ({
  stream,
  tasksInProgress,
  completedTasks,
  nextTask,
  onClick,
  index,
  highPriorityCount = 0,
  estimatedMinutesRemaining = 0,
  lastActivityDate,
}: TrophyStreamCardProps) => {
  const displayName = stream.name?.split('(')[0].trim() || 'Unnamed Stream';
  const category = (stream as any).category || 'General';
  const base = unifiedBaseDesigns[category as keyof typeof unifiedBaseDesigns] || unifiedBaseDesigns.Training;

  // Format time remaining
  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  // Calculate days since last activity
  const getDaysSinceActivity = () => {
    if (!lastActivityDate) return null;
    const diff = Date.now() - new Date(lastActivityDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  // Determine activity status
  const getActivityStatus = () => {
    if (!lastActivityDate) return { label: 'New', color: 'text-blue-400' };
    const diff = Date.now() - new Date(lastActivityDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return { label: 'Active Now', color: 'text-green-400' };
    if (days <= 3) return { label: 'Hot Streak', color: 'text-orange-400' };
    if (days <= 7) return { label: 'Active', color: 'text-cyan-400' };
    return { label: 'Idle', color: 'text-gray-400' };
  };

  const activityStatus = getActivityStatus();
  const daysSince = getDaysSinceActivity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.15,
      }}
      className="flex flex-col items-center relative"
      style={{ perspective: '1200px' }}
    >
      {/* Unified 3D Trophy Object */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          },
        }}
        whileHover={{
          y: -16,
          transition: { duration: 0.4 },
        }}
        onClick={onClick}
        className="cursor-pointer relative mb-6"
        style={{ 
          transformStyle: "preserve-3d",
        }}
      >
        {/* Radial Glow (Ambient Light) */}
        <div
          className="absolute -inset-8 rounded-3xl blur-2xl opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${stream.color}60 0%, transparent 70%)`,
          }}
        />

        {/* 3D Plaque Card with Perspective */}
        <motion.div
          className="relative group"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(8deg) rotateY(-2deg)",
          }}
          whileHover={{
            transform: "rotateX(0deg) rotateY(0deg)",
            transition: { duration: 0.4 },
          }}
        >
          {/* Glass/Acrylic Plaque */}
          <Card className="w-72 p-6 border-2 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/95 via-card/90 to-card/95">
            {/* Top Light Reflection (Top-Left Light Source) */}
            <div 
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
              style={{
                background: `radial-gradient(circle, ${stream.color}80, transparent)`,
              }}
            />
            
            {/* Visible Edge/Thickness - Right Side */}
            <div 
              className="absolute top-0 -right-2 w-2 h-full bg-gradient-to-l from-black/40 via-black/20 to-transparent"
              style={{
                transform: "skewY(-2deg)",
                boxShadow: `inset 2px 0 4px ${stream.color}30`,
              }}
            />
            
            {/* Visible Edge/Thickness - Bottom Side */}
            <div 
              className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-b-lg"
              style={{
                transform: "skewX(-1deg)",
              }}
            />

            {/* Rim Glow - Premium Accent */}
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                boxShadow: `inset 0 0 20px ${stream.color}20, inset 0 1px 2px ${stream.color}40`,
              }}
            />

            {/* Top Accent Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${stream.color}, transparent)`,
                boxShadow: `0 2px 8px ${stream.color}60`,
              }}
            />

            {/* Inner Shine Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${stream.color}08 50%, transparent 70%)`,
                animation: "shine 3s ease-in-out infinite",
              }}
            />

            <div className="space-y-4 relative z-10">
              {/* DEFAULT STATE: Enhanced Minimal Information */}
              <div className="space-y-3">
                {/* Category Badge & Activity Status */}
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1"
                    style={{
                      borderLeft: `3px solid ${stream.color}`,
                      color: stream.color,
                      textShadow: `0 0 8px ${stream.color}40`,
                    }}
                  >
                    {category}
                  </Badge>
                  
                  {/* Activity Status Badge */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 border border-border/30">
                    <Zap className={`h-3 w-3 ${activityStatus.color}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${activityStatus.color}`}>
                      {activityStatus.label}
                    </span>
                  </div>
                </div>

                {/* Stream Title & Progress Circle */}
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold text-foreground leading-tight flex-1">
                    {displayName}
                  </h3>
                  
                  {/* Circular Progress */}
                  <div className="w-20 h-20 flex-shrink-0 relative">
                    <CircularProgressbar
                      value={stream.progress}
                      text={`${stream.progress}%`}
                      styles={buildStyles({
                        textSize: '24px',
                        textColor: stream.color,
                        pathColor: stream.color,
                        trailColor: 'hsl(var(--muted))',
                        pathTransitionDuration: 0.8,
                      })}
                    />
                    <div 
                      className="absolute inset-0 rounded-full blur-md opacity-30"
                      style={{ 
                        background: `conic-gradient(from 0deg, transparent ${100 - stream.progress}%, ${stream.color} ${100 - stream.progress}%, ${stream.color} 100%, transparent 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced Metrics Row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Total Tasks */}
                  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20 border border-border/30">
                    <Clock className="h-4 w-4 mb-1" style={{ color: stream.color }} />
                    <span className="text-xl font-bold" style={{ color: stream.color }}>
                      {tasksInProgress + completedTasks}
                    </span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Tasks</span>
                  </div>

                  {/* High Priority */}
                  {highPriorityCount > 0 && (
                    <div className="flex flex-col items-center p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="h-4 w-4 mb-1 text-red-400" />
                      <span className="text-xl font-bold text-red-400">
                        {highPriorityCount}
                      </span>
                      <span className="text-[9px] text-red-300/70 uppercase tracking-wide">Urgent</span>
                    </div>
                  )}

                  {/* Estimated Time */}
                  {estimatedMinutesRemaining > 0 && (
                    <div className="flex flex-col items-center p-2 rounded-lg bg-muted/20 border border-border/30">
                      <Timer className="h-4 w-4 mb-1 text-amber-400" />
                      <span className="text-lg font-bold text-foreground">
                        {formatTimeRemaining(estimatedMinutesRemaining)}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Left</span>
                    </div>
                  )}
                </div>

                {/* Next Deadline Banner */}
                {stream.nextDeadline && (
                  <div 
                    className="flex items-center gap-2 p-2 rounded-lg border"
                    style={{ 
                      borderColor: `${stream.color}40`,
                      background: `linear-gradient(90deg, ${stream.color}10, transparent)`,
                    }}
                  >
                    <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: stream.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold">Next Deadline</p>
                      <p className="text-sm font-bold text-foreground truncate">
                        {stream.nextDeadline}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* HOVER STATE: Detailed Information Fades In */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileHover={{ opacity: 1, height: "auto" }}
                className="space-y-3 overflow-hidden group-hover:opacity-100 opacity-0 transition-opacity duration-500"
              >
                {/* Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Last Activity */}
                {daysSince && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Last Activity</span>
                    <span className="text-xs font-bold text-foreground">{daysSince}</span>
                  </div>
                )}

                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">In Progress</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: stream.color }}>
                      {tasksInProgress}
                    </div>
                  </div>

                  <div className="space-y-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {completedTasks}
                    </div>
                  </div>
                </div>

                {/* Stream Overview */}
                {stream.description && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" />
                      Stream Overview
                    </p>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-muted/20 to-muted/10 border border-border/30">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stream.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next Task */}
                {nextTask && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" style={{ color: stream.color }} />
                      Next Task
                    </p>
                    <div 
                      className="p-3 rounded-lg border-2 relative overflow-hidden"
                      style={{ 
                        borderColor: `${stream.color}40`,
                        background: `linear-gradient(135deg, ${stream.color}05, transparent)`,
                      }}
                    >
                      <p className="text-xs text-foreground font-medium relative z-10">
                        {nextTask}
                      </p>
                    </div>
                  </div>
                )}

                {/* Click to View Indicator */}
                <motion.div
                  className="pt-2 border-t border-border/30 flex items-center justify-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-xs font-semibold" style={{ color: stream.color }}>
                    Click for detailed workbench
                  </p>
                  <ChevronRight className="h-4 w-4" style={{ color: stream.color }} />
                </motion.div>
              </motion.div>

              {/* Spark Effect on Near Completion */}
              {stream.progress >= 75 && (
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-5 w-5" style={{ color: stream.color }} />
                </motion.div>
              )}
            </div>

            {/* Metallic/Glass Corner Accent */}
            <div
              className="absolute -top-2 -right-2 w-20 h-20 opacity-15 rounded-full blur-xl"
              style={{ 
                background: `radial-gradient(circle, ${stream.color}, transparent)`,
              }}
            />
          </Card>

          {/* Plaque Shadow (Lighting from top-left) */}
          <div
            className="absolute top-4 left-2 w-full h-full rounded-lg -z-10 blur-xl opacity-40"
            style={{
              background: `linear-gradient(135deg, transparent 20%, ${stream.color}40 50%, black 100%)`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Thematic Base (Physically Connected) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.15 + 0.4 }}
        className="relative"
        style={{ 
          transform: "translateY(-24px)",
        }}
      >
        {base(stream.color)}
      </motion.div>

      {/* Floor Reflection */}
      <div 
        className="absolute bottom-0 w-64 h-32 opacity-10 blur-2xl"
        style={{
          background: `linear-gradient(to top, ${stream.color}20, transparent)`,
          transform: "translateY(20px) scaleY(0.3)",
        }}
      />
    </motion.div>
  );
};