import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Sparkles, Trophy, Target, BarChart3 } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

interface OnboardingTourProps {
  onComplete?: () => void;
}

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to ZURVAN! 🚀",
    description: "Your unified learning command center. Let's take a quick tour to show you around.",
    icon: Sparkles,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>ZURVAN helps you:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>Organize all your learning streams in one place</li>
          <li>Track progress across multiple subjects</li>
          <li>Prioritize tasks with intelligent analytics</li>
          <li>Visualize your learning journey</li>
        </ul>
      </div>
    ),
  },
  {
    id: "streams",
    title: "Learning Streams 🏆",
    description: "Your mastery paths displayed as trophies",
    icon: Trophy,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Streams represent your different learning paths:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Create streams</strong> for each subject or skill you're mastering</li>
          <li><strong>Track progress</strong> with visual trophy cards</li>
          <li><strong>Monitor activity</strong> and see what needs attention</li>
          <li><strong>View estimates</strong> for time remaining</li>
        </ul>
        <p className="pt-2">Click the <strong>"+ Add Stream"</strong> button to create your first learning path!</p>
      </div>
    ),
  },
  {
    id: "tasks",
    title: "Task Management 📋",
    description: "Break down your learning into actionable steps",
    icon: Target,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Tasks are the building blocks of your learning:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Create tasks</strong> for each learning activity</li>
          <li><strong>Set priorities</strong> (high, medium, low)</li>
          <li><strong>Estimate time</strong> needed for each task</li>
          <li><strong>Link to streams</strong> to organize your work</li>
        </ul>
        <p className="pt-2">Use the <strong>"+ Add Task"</strong> button to start breaking down your goals!</p>
      </div>
    ),
  },
  {
    id: "analytics",
    title: "Analytics Hub 📊",
    description: "Get instant insights into your learning progress",
    icon: BarChart3,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Stay on top of your progress with real-time analytics:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Progress metrics</strong> showing completion rates</li>
          <li><strong>Time estimates</strong> for remaining work</li>
          <li><strong>Priority distribution</strong> across tasks</li>
          <li><strong>Stream comparisons</strong> to balance your focus</li>
        </ul>
        <p className="pt-2">Scroll down to see detailed analytics and your execution zone!</p>
      </div>
    ),
  },
];

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { completeOnboarding } = useOnboarding();

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  const handleComplete = async () => {
    await completeOnboarding();
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="w-full max-w-2xl mx-4 shadow-2xl border-2 animate-in zoom-in-95 duration-300">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
              <CardDescription className="mt-1">{currentStepData.description}</CardDescription>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="min-h-[200px]">{currentStepData.content}</div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="gap-2"
          >
            Skip Tour
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {currentStep === tourSteps.length - 1 ? (
                <>Get Started</>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
