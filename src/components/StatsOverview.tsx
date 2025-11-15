import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, Target } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  color?: string;
}

const StatCard = ({ icon, label, value, subtitle, color = "primary" }: StatCardProps) => (
  <Card className="cosmic-card p-5 border-t-4" style={{ borderTopColor: `hsl(var(--${color}))` }}>
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-display text-3xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`h-11 w-11 rounded-lg bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </Card>
);

interface StatsOverviewProps {
  totalHours: number;
  completedTasks: number;
  activeStreams: number;
  overallProgress: number;
}

export const StatsOverview = ({ totalHours, completedTasks, activeStreams, overallProgress }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Clock className="h-5 w-5 text-primary" />}
        label="Focus Hours"
        value={`${totalHours}h`}
        subtitle="Time invested"
        color="primary"
      />
      <StatCard
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        label="Completed Tasks"
        value={String(completedTasks)}
        subtitle="Tasks done"
        color="green"
      />
      <StatCard
        icon={<Target className="h-5 w-5 text-blue-600" />}
        label="Active Streams"
        value={String(activeStreams)}
        subtitle="Learning paths"
        color="blue"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
        label="Progress"
        value={`${overallProgress}%`}
        subtitle="Overall completion"
        color="amber"
      />
    </div>
  );
};