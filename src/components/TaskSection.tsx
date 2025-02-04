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
  onTaskDelete?: (taskId: string) => void;
  createOnly?: boolean;
  readOnly?: boolean;
}

const TaskSection = ({ 
  tasks, 
  onTaskToggle, 
  onTaskCreate, 
  onTaskEdit,
  onTaskDelete,
  createOnly = false,
  readOnly = false 
}: TaskSectionProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

  // Filter out expired tasks from the task manager
  const activeTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return !isPast(dueDate) || task.completed;
  });

  useEffect(() => {
    const now = new Date();
    const upcomingTasks = activeTasks.filter(task => {
      if (task.completed || notifiedTaskIds.has(task.id)) return false;
      
      const dueDate = new Date(task.dueDate);
      const daysDifference = differenceInDays(dueDate, now);
      
      // Only notify for tasks that are upcoming but not past due
      return daysDifference >= 0;
    });

    if (upcomingTasks.length > 0) {
      const newNotifiedIds = new Set(notifiedTaskIds);
      upcomingTasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const daysLeft = differenceInDays(dueDate, now);
        newNotifiedIds.add(task.id);
        
        toast({
          title: "Upcoming task",
          description: `"${task.title}" is due ${daysLeft === 0 ? 'today' : `in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}`,
          duration: 5000,
        });
      });
      setNotifiedTaskIds(newNotifiedIds);
    }
  }, [activeTasks, toast]);

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
    setIsDialogOpen(false);
  };

  const handleTaskDelete = () => {
    if (editingTask && onTaskDelete) {
      onTaskDelete(editingTask.id);
      setEditingTask(null);
      setIsDialogOpen(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (createOnly || readOnly) return;
    
    if (!onTaskEdit) {
      onTaskToggle(task.id);
      return;
    }
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const filteredTasks = activeTasks
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
        {!readOnly && (
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
        )}
      </div>

      {!createOnly && !readOnly && (
        <>
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={(value: "dueDate" | "priority") => setSortBy(value)}
          />

          <TaskStats tasks={filteredTasks} />
        </>
      )}

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            onClick={() => handleTaskClick(task)}
            onToggleComplete={readOnly ? undefined : () => onTaskToggle(task.id)}
            readOnly={readOnly}
          />
        ))}
      </div>
      
      {!readOnly && (
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleTaskSubmit}
          onDelete={editingTask ? handleTaskDelete : undefined}
          initialValues={editingTask || undefined}
          mode={editingTask ? "edit" : "create"}
        />
      )}
    </div>
  );
};

export default TaskSection;
