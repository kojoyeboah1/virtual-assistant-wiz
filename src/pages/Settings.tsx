import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor, RefreshCw } from "lucide-react";
import MainNav from "@/components/NavigationMenu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { userId } = useAuth();

  const handleResetAnalytics = async () => {
    if (!userId) return;

    try {
      // Mark all tasks as expired
      const { error } = await supabase
        .from('tasks')
        .update({ expired: true })
        .eq('user_id', userId)
        .not('completed', 'is', true);

      if (error) throw error;

      toast({
        title: "Analytics Reset",
        description: "Your analytics have been reset successfully. All incomplete tasks have been moved to history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset analytics. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <MainNav />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme" className="text-base">Theme</Label>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                className="grid grid-cols-3 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Sun className="mb-2 h-6 w-6" />
                    Light
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Moon className="mb-2 h-6 w-6" />
                    Dark
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Monitor className="mb-2 h-6 w-6" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Reset your analytics by moving all incomplete tasks to history. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={handleResetAnalytics}
            >
              <RefreshCw className="h-4 w-4" />
              Reset Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}