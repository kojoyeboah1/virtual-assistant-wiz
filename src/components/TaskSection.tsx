import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

interface TaskSectionProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

const TaskSection = ({ tasks, onTaskToggle }: TaskSectionProps) => (
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
          onClick={() => onTaskToggle(task.id)}
        />
      ))}
    </div>
  </div>
);

export default TaskSection;