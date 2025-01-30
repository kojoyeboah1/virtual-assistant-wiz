import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskStats from "./TaskStats";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");

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

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const upcomingTasks = tasks.filter(
    (task) => !task.completed && 
    new Date(task.dueDate).getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000
  );

  if (upcomingTasks.length > 0) {
    toast({
      title: "Upcoming tasks",
      description: `You have ${upcomingTasks.length} tasks due in the next 3 days.`,
      duration: 5000,
    });
  }

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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "dueDate" | "priority") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TaskStats tasks={tasks} />

      <div className="space-y-3">
        {filteredTasks.map((task) => (
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