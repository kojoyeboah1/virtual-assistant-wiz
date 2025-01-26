import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import MainNav from "@/components/NavigationMenu";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review Project Proposal",
      description: "Go through the latest project proposal and provide feedback",
      priority: "high",
      dueDate: "2024-02-20",
      location: { lat: 40.7128, lng: -74.0060 },
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

  const handleTaskCreate = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks((prev) => [...prev, task]);
  };

  const handleTaskEdit = (taskId: string, updatedTask: Omit<Task, "id" | "completed">) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const handleNoteSave = (note: string) => {
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 fade-in">
        <MainNav />
        <Header />
        <TabsSection
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onTaskCreate={handleTaskCreate}
          onTaskEdit={handleTaskEdit}
          onNoteSave={handleNoteSave}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default Index;