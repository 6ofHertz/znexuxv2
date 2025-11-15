import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface StreamOverviewCardProps {
  id: string;
  name?: string | null;
  description?: string;
  category?: string;
  progress: number;
  color: string;
  tasksInProgress: number;
  completedTasks?: number;
  totalTasks?: number;
  nextItem?: string;
  onClick?: () => void;
}

export const StreamOverviewCard = ({
  name,
  description,
  category,
  progress,
  color,
  tasksInProgress,
  completedTasks = 0,
  totalTasks = 0,
  nextItem,
  onClick
}: StreamOverviewCardProps) => {
  // Shorten the name for the card display with backwards compatibility and null safety
  const displayName = name && typeof name === 'string' 
    ? name.split('(')[0].trim() 
    : 'Unnamed Stream';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <Card className="p-6 border-2 hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-md overflow-hidden relative group h-full flex flex-col">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{ 
            background: `linear-gradient(135deg, ${color}22 0%, transparent 100%)` 
          }}
        />
        
        {/* Color accent bar at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 opacity-90 group-hover:h-2 transition-all duration-300"
          style={{ backgroundColor: color }}
        />
        
        <div className="space-y-4 mt-2 relative z-10 flex-1 flex flex-col">
          {/* Header with category badge and progress ring */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {category && (
                  <Badge 
                    variant="secondary" 
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ 
                      borderLeft: `3px solid ${color}`,
                      color: color 
                    }}
                  >
                    {category}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground leading-tight mb-1">
                {displayName}
              </h3>
            </div>
            
            {/* Circular progress */}
            <div className="w-16 h-16 flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    textColor: color,
                    pathColor: color,
                    trailColor: 'hsl(var(--muted))',
                    pathTransitionDuration: 0.8,
                  })}
                />
              </motion.div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-foreground" style={{ color }}>
                {tasksInProgress}+
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Completed
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground" style={{ color }}>
                {progress}%
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Completion
              </p>
            </div>
          </div>

          {/* Next Task */}
          {nextItem && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Next Task:
              </p>
              <Badge 
                variant="secondary" 
                className="text-xs font-medium w-full justify-start py-2 px-3"
              >
                <span className="truncate">{nextItem}</span>
              </Badge>
            </div>
          )}

          {/* Description / All Related Data */}
          {description && (
            <div className="space-y-2 flex-1 flex flex-col">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Stream Overview:
              </p>
              <div className="flex-1 p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-6">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Hover indicator */}
          <div className="pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-center font-medium" style={{ color }}>
              Click to view detailed analytics →
            </p>
          </div>
        </div>

        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-full"
          style={{ backgroundColor: color }}
        />
      </Card>
    </motion.div>
  );
};