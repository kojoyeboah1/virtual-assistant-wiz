import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed: boolean;
}

interface TaskSectionProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskCreate?: (task: Omit<Task, "id" | "completed">) => void;
  onTaskEdit?: (taskId: string, task: Omit<Task, "id" | "completed">) => void;
}

const TaskSection = ({ tasks, onTaskToggle, onTaskCreate, onTaskEdit }: TaskSectionProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskSubmit = (values: Omit<Task, "id" | "completed">) => {
    if (editingTask) {
      onTaskEdit?.(editingTask.id, values);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    } else {
      onTaskCreate?.(values);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    }
    setEditingTask(null);
  };

  const handleTaskClick = (task: Task) => {
    if (!onTaskEdit) {
      onTaskToggle(task.id);
      return;
    }
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Tasks</h2>
        <Button
          size="sm"
          className="whitespace-nowrap"
          onClick={() => {
            setEditingTask(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            onClick={() => handleTaskClick(task)}
          />
        ))}
      </div>
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTaskSubmit}
        initialValues={editingTask || undefined}
        mode={editingTask ? "edit" : "create"}
      />
    </div>
  );
};

export default TaskSection;