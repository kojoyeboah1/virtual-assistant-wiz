import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

const Index = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { userId } = useAuth();
  const { tasks, isLoading, createTask, updateTask, toggleTask } = useTasks(userId);

  const handleNoteSave = (note: string) => {
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 fade-in">
        <MainNav />
        <Header />
        <TabsSection
          tasks={tasks}
          onTaskToggle={toggleTask}
          onTaskCreate={createTask}
          onTaskEdit={(taskId, task) => updateTask({ taskId, task })}
          onNoteSave={handleNoteSave}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default Index;