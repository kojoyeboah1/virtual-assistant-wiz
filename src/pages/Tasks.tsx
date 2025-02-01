import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskSection from "@/components/TaskSection";

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, createTask, updateTask, toggleTask } = useTasks(user?.id || null);

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <TaskSection
        tasks={tasks}
        onTaskToggle={toggleTask}
        onTaskCreate={createTask}
        onTaskEdit={updateTask}
      />
    </div>
  );
};

export default Tasks;