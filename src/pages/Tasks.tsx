import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskSection from "@/components/TaskSection";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed: boolean;
}

const Tasks = () => {
  const { userId } = useAuth();
  const { tasks, createTask, updateTask, toggleTask } = useTasks(userId);

  const handleTaskEdit = (taskId: string, task: Omit<Task, "id" | "completed">) => {
    updateTask({ taskId, task });
  };

  return (
    <div className="container mx-auto p-4">
      <TaskSection
        tasks={tasks}
        onTaskToggle={toggleTask}
        onTaskCreate={createTask}
        onTaskEdit={handleTaskEdit}
      />
    </div>
  );
};

export default Tasks;