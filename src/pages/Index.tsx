import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import MainNav from "@/components/NavigationMenu";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Review Project Proposal",
      description: "Go through the latest project proposal and provide feedback",
      priority: "high",
      dueDate: "2024-02-20",
      completed: false,
    },
    {
      id: "2",
      title: "Schedule Team Meeting",
      description: "Coordinate with team members for weekly sync",
      priority: "medium",
      dueDate: "2024-02-21",
      completed: false,
    },
  ]);

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleNoteSave = (note: string) => {
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 fade-in">
        <MainNav />
        <Header />
        <TabsSection
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onNoteSave={handleNoteSave}
        />
      </div>
    </div>
  );
};

export default Index;