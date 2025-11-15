import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CheckCircle2, Clock, TrendingUp, ChevronRight } from "lucide-react";
import type { Stream } from "@/types";

interface TrophyStreamCardProps {
  stream: Stream;
  tasksInProgress: number;
  completedTasks: number;
  nextTask?: string;
  onClick?: () => void;
  index: number;
}

// Thematic base designs for each stream category
const baseDesigns = {
  Practice: (
    <div className="relative w-full h-20 flex items-end justify-center">
      {/* Dojo Mat Base */}
      <div className="w-40 h-3 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-sm shadow-lg relative">
        <div className="absolute inset-0 grid grid-cols-8 gap-[2px] p-[2px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-cyan-900/30 rounded-[1px]" />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 w-48 h-2 bg-gradient-to-r from-cyan-900/40 via-cyan-800/40 to-cyan-900/40 rounded-full blur-sm" />
    </div>
  ),
  Academic: (
    <div className="relative w-full h-20 flex items-end justify-center">
      {/* Stack of Books Base */}
      <div className="relative">
        <div className="w-36 h-3 bg-gradient-to-r from-purple-700 to-purple-900 rounded-sm shadow-md transform -rotate-1" />
        <div className="w-32 h-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-sm shadow-md absolute -top-3 left-2" />
        <div className="w-28 h-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-sm shadow-md absolute -top-6 left-4 transform rotate-1" />
      </div>
      <div className="absolute -bottom-1 w-44 h-2 bg-gradient-to-r from-purple-900/40 via-purple-800/40 to-purple-900/40 rounded-full blur-sm" />
    </div>
  ),
  Training: (
    <div className="relative w-full h-20 flex items-end justify-center">
      {/* Digital Tablet/E-Learning Console */}
      <div className="relative">
        <div className="w-40 h-5 bg-gradient-to-b from-orange-600 to-orange-800 rounded-t-sm shadow-lg border-t-2 border-orange-400/30" />
        <div className="absolute inset-0 top-1 mx-2 h-2 bg-orange-400/20 rounded-sm" />
      </div>
      <div className="absolute -bottom-1 w-48 h-2 bg-gradient-to-r from-orange-900/40 via-orange-800/40 to-orange-900/40 rounded-full blur-sm" />
    </div>
  ),
  Bootcamp: (
    <div className="relative w-full h-20 flex items-end justify-center">
      {/* Server Rack Base */}
      <div className="relative">
        <div className="w-32 h-16 bg-gradient-to-b from-blue-700 to-blue-900 rounded-sm shadow-lg border border-blue-500/30">
          <div className="grid grid-rows-4 gap-1 p-1 h-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-blue-950/50 rounded-[2px] flex items-center gap-1 px-1">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                <div className="w-1 h-1 rounded-full bg-blue-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 w-40 h-2 bg-gradient-to-r from-blue-900/40 via-blue-800/40 to-blue-900/40 rounded-full blur-sm" />
    </div>
  ),
  Certifications: (
    <div className="relative w-full h-20 flex items-end justify-center">
      {/* Server Stack / VM Terminal */}
      <div className="relative">
        <div className="w-36 h-14 bg-gradient-to-b from-red-700 to-red-900 rounded shadow-lg border border-red-500/30">
          <div className="grid grid-rows-3 gap-[2px] p-[3px] h-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-red-950/60 rounded-[1px] flex items-center justify-between px-2">
                <div className="flex gap-[2px]">
                  <div className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-amber-400" />
                </div>
                <div className="text-[6px] text-red-300/50 font-mono">VM{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 w-44 h-2 bg-gradient-to-r from-red-900/40 via-red-800/40 to-red-900/40 rounded-full blur-sm" />
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
}: TrophyStreamCardProps) => {
  const displayName = stream.name?.split('(')[0].trim() || 'Unnamed Stream';
  const category = (stream as any).category || 'General';
  const base = baseDesigns[category as keyof typeof baseDesigns] || baseDesigns.Training;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.15,
      }}
      className="flex flex-col items-center relative"
    >
      {/* Floating Trophy Card */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotateY: [0, 5, 0, -5, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          },
          rotateY: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          },
        }}
        whileHover={{
          scale: 1.08,
          y: -20,
          rotateY: 0,
          transition: { duration: 0.3 },
        }}
        onClick={onClick}
        className="cursor-pointer relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow Effect */}
        <div
          className="absolute -inset-4 rounded-2xl blur-xl opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${stream.color}40 0%, transparent 70%)`,
          }}
        />

        {/* Main Trophy Card */}
        <Card className="w-72 p-6 border-2 backdrop-blur-md bg-card/90 shadow-2xl relative overflow-hidden group">
          {/* Shine Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(120deg, transparent 30%, ${stream.color}15 50%, transparent 70%)`,
              animation: "shine 2s infinite",
            }}
          />

          {/* Color Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{ backgroundColor: stream.color }}
          />

          {/* Active Stream Glow Beam */}
          {stream.progress > 0 && (
            <motion.div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-20 opacity-20"
              style={{
                background: `linear-gradient(to top, ${stream.color}, transparent)`,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div className="space-y-4 relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold uppercase tracking-wide mb-2"
                  style={{
                    borderLeft: `3px solid ${stream.color}`,
                    color: stream.color,
                  }}
                >
                  {category}
                </Badge>
                <h3 className="text-xl font-bold text-foreground leading-tight mb-1">
                  {displayName}
                </h3>
              </div>

              {/* Circular Progress */}
              <div className="w-16 h-16 flex-shrink-0">
                <CircularProgressbar
                  value={stream.progress}
                  text={`${stream.progress}%`}
                  styles={buildStyles({
                    textSize: '22px',
                    textColor: stream.color,
                    pathColor: stream.color,
                    trailColor: 'hsl(var(--muted))',
                    pathTransitionDuration: 0.8,
                  })}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                </div>
                <div className="text-2xl font-bold" style={{ color: stream.color }}>
                  {tasksInProgress}+
                </div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  In Progress
                </p>
              </div>

              <div className="text-center border-x border-border/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {completedTasks}
                </div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  Completed
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-blue-500" />
                </div>
                <div className="text-2xl font-bold" style={{ color: stream.color }}>
                  {stream.progress}%
                </div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  Completion
                </p>
              </div>
            </div>

            {/* Next Task */}
            {nextTask && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Next Task:
                </p>
                <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-foreground font-medium line-clamp-2">
                    {nextTask}
                  </p>
                </div>
              </div>
            )}

            {/* Stream Overview */}
            {stream.description && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Stream Overview:
                </p>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {stream.description}
                  </p>
                </div>
              </div>
            )}

            {/* Click Indicator */}
            <motion.div
              className="pt-2 border-t border-border/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 5 }}
            >
              <p className="text-xs font-medium" style={{ color: stream.color }}>
                Click to view detailed analytics
              </p>
              <ChevronRight className="h-4 w-4" style={{ color: stream.color }} />
            </motion.div>

            {/* Spark Effect on Near Completion */}
            {stream.progress >= 75 && (
              <motion.div
                className="absolute top-4 right-4 w-3 h-3 rounded-full"
                style={{ backgroundColor: stream.color }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            )}
          </div>

          {/* Corner Accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
            style={{ backgroundColor: stream.color }}
          />
        </Card>

        {/* Shadow beneath card */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full blur-xl opacity-40"
          style={{
            background: `radial-gradient(ellipse, ${stream.color}60 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Thematic Base */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.15 + 0.3 }}
        className="mt-8"
      >
        {base}
      </motion.div>
    </motion.div>
  );
};
