import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TaskSection from "@/components/TaskSection";
import CalendarSection from "@/components/CalendarSection";
import NotesSection from "@/components/NotesSection";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
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
        <Header />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TaskSection tasks={tasks} onTaskToggle={handleTaskToggle} />
          <CalendarSection />
          <div className="md:col-span-2 lg:col-span-1">
            <NotesSection onNoteSave={handleNoteSave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;