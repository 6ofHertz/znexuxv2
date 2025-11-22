import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, User, Palette, Timer, Database, Info, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, loading } = useAuth();
  const { settings, updateSettings, resetSettings, loading: settingsLoading } = useSettings();
  const navigate = useNavigate();

  // Local state for form inputs
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  // Check for changes
  useEffect(() => {
    const hasChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
    setHasChanges(hasChanged);
  }, [localSettings, settings]);

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleReset = async () => {
    try {
      await resetSettings();
      toast.success('Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  const updateLocalSetting = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="gap-2">
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="text-sm text-muted-foreground">
                    {user?.email || "Not available"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">User ID</label>
                  <div className="text-xs text-muted-foreground font-mono">
                    {user?.uid || "Not available"}
                  </div>
                </div>
                <div className="pt-4 text-sm text-muted-foreground">
                  More profile settings coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how ZURVAN looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Theme and appearance settings coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pomodoro Tab */}
          <TabsContent value="pomodoro" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pomodoro Timer Settings</CardTitle>
                <CardDescription>
                  Customize your focus and break durations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Pomodoro settings coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export, import, or clear your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Data management tools coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About ZURVAN</CardTitle>
                <CardDescription>
                  Version information and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Version</div>
                  <div className="text-sm text-muted-foreground">1.0.0</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm text-muted-foreground">
                    ZURVAN - Your unified learning command center for tracking tasks,
                    managing streams, and maximizing productivity.
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/your-repo/zurvan"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Documentation
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

