import MainNav from "@/components/NavigationMenu";
import TaskSection from "@/components/TaskSection";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const { userId } = useAuth();
  const { tasks, toggleTask, createTask, updateTask } = useTasks(userId);

  // Create a wrapper function to match the expected signature
  const handleTaskEdit = (taskId: string, task: any) => {
    updateTask({ taskId, task });
  };

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <TaskSection
          tasks={tasks}
          onTaskToggle={toggleTask}
          onTaskCreate={createTask}
          onTaskEdit={handleTaskEdit}
        />
      </div>
    </div>
  );
};

export default Tasks;