import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { Calendar } from "@/components/Calendar";
import { QuickNote } from "@/components/QuickNote";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Virtual Secretary</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Your personal task assistant</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Tasks</h2>
              <Button size="sm" className="whitespace-nowrap">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onClick={() => handleTaskToggle(task.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Calendar</h2>
            <Calendar
              date={new Date()}
              events={[
                {
                  id: "1",
                  title: "Team Meeting",
                  time: "2024-02-20T10:00:00",
                  type: "meeting",
                },
              ]}
            />
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Notes</h2>
            <QuickNote onSave={handleNoteSave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;