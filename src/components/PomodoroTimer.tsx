import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            handleSessionComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleSessionComplete = () => {
    if (sessionType === "focus") {
      toast.success("Focus session complete! 🎉", {
        description: "Time for a 5-minute break.",
      });
      setSessionType("break");
      setMinutes(5);
      setSeconds(0);
    } else {
      toast.success("Break complete! 💪", {
        description: "Ready for another focus session?",
      });
      setSessionType("focus");
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(sessionType === "focus" ? 25 : 5);
    setSeconds(0);
  };

  const progress = sessionType === "focus" 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <Card className="cosmic-card p-5">
      <div className="text-center">
        <div className="mb-5">
          <h3 className="font-semibold text-foreground mb-1">
            {sessionType === "focus" ? "Focus Session" : "Break Time"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {sessionType === "focus" ? "Deep work mode" : "Rest and recharge"}
          </p>
        </div>

        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="80"
              cy="80"
              r="72"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 72}`}
              strokeDashoffset={`${2 * Math.PI * 72 * (1 - progress / 100)}`}
              className="progress-ring"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold text-foreground">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {sessionType === "focus" ? "25 min" : "5 min"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={toggleTimer}
            size="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 max-w-[140px]"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button onClick={resetTimer} size="default" variant="outline" className="px-3">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};