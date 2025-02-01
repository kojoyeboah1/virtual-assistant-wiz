import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskSection from "@/components/TaskSection";

const Tasks = () => {
  const { userId } = useAuth();
  const { tasks, createTask, updateTask, toggleTask } = useTasks(userId);

  const handleTaskEdit = (taskId: string, task: Omit<Task, "id" | "completed">) => {
    updateTask({ taskId, task });
  };

  return (
    <div className="container mx-auto p-4">
      <MainNav />
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