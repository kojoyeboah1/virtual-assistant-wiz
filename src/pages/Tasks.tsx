import MainNav from "@/components/NavigationMenu";
import TaskSection from "@/components/TaskSection";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const { userId } = useAuth();
  const { tasks, toggleTask, createTask, updateTask } = useTasks(userId);

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <TaskSection
          tasks={tasks}
          onTaskToggle={toggleTask}
          onTaskCreate={createTask}
          onTaskEdit={updateTask}
        />
      </div>
    </div>
  );
};

export default Tasks;