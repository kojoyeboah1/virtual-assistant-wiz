import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { useToast } from "@/components/ui/use-toast";
import TaskStats from "./TaskStats";
import TaskFilters from "./TaskFilters";
import { differenceInDays, isPast } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed: boolean;
  expired?: boolean;
}

interface TaskSectionProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskCreate?: (task: Omit<Task, "id" | "completed">) => void;
  onTaskEdit?: (taskId: string, task: Omit<Task, "id" | "completed">) => void;
  createOnly?: boolean;
}

const TaskSection = ({ tasks, onTaskToggle, onTaskCreate, onTaskEdit, createOnly = false }: TaskSectionProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const now = new Date();
    const upcomingTasks = tasks.filter(task => {
      if (task.completed || notifiedTaskIds.has(task.id)) return false;
      
      const dueDate = new Date(task.dueDate);
      const daysDifference = differenceInDays(dueDate, now);
      return daysDifference >= 0 && daysDifference <= 3;
    });

    if (upcomingTasks.length > 0) {
      const newNotifiedIds = new Set(notifiedTaskIds);
      upcomingTasks.forEach(task => newNotifiedIds.add(task.id));
      setNotifiedTaskIds(newNotifiedIds);

      toast({
        title: "Upcoming tasks",
        description: `You have ${upcomingTasks.length} tasks due in the next 3 days.`,
        duration: 5000,
      });
    }
  }, [tasks, toast]);

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
    if (createOnly) return;
    
    if (!onTaskEdit) {
      onTaskToggle(task.id);
      return;
    }
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks
    .map(task => ({
      ...task,
      expired: !task.completed && isPast(new Date(task.dueDate)) // Only mark as expired if not completed and past due date
    }))
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

      {!createOnly && (
        <>
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={(value: "dueDate" | "priority") => setSortBy(value)}
          />

          <TaskStats tasks={filteredTasks} />

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        </>
      )}
      
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