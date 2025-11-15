import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface StreamOverviewCardProps {
  id: string;
  name: string;
  progress: number;
  color: string;
  tasksInProgress: number;
  nextItem?: string;
  onClick?: () => void;
}

export const StreamOverviewCard = ({
  name,
  progress,
  color,
  tasksInProgress,
  nextItem,
  onClick
}: StreamOverviewCardProps) => {
  // Shorten the name for the card display with null safety
  const displayName = name ? name.split('(')[0].trim() : 'Unnamed Stream';
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-4 border-2 hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden relative group">
        {/* Color accent bar at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 opacity-80 group-hover:h-2 transition-all duration-300"
          style={{ backgroundColor: color }}
        />
        
        <div className="space-y-3 mt-1">
          {/* Header with name and progress ring */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-tight mb-1 truncate">
                {displayName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tasksInProgress} in progress
              </p>
            </div>
            
            {/* Mini circular progress */}
            <div className="w-12 h-12 flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    textSize: '28px',
                    textColor: color,
                    pathColor: color,
                    trailColor: 'hsl(var(--muted))',
                    pathTransitionDuration: 0.5,
                  })}
                />
              </motion.div>
            </div>
          </div>

          {/* Key stats */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-semibold" style={{ color }}>{progress}%</span>
            </div>
            
            {nextItem && (
              <div className="pt-1 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Next:</p>
                <Badge variant="secondary" className="text-xs font-normal max-w-full">
                  <span className="truncate">{nextItem}</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      </Card>
    </motion.div>
  );
};