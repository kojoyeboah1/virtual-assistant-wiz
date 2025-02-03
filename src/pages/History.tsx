import MainNav from "@/components/NavigationMenu";
import TaskSection from "@/components/TaskSection";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { isPast } from "date-fns";
import { Card } from "@/components/ui/card";
import { Inbox } from "lucide-react";

const History = () => {
  const { userId } = useAuth();
  const { tasks, toggleTask } = useTasks(userId);

  // Get expired tasks (past due date and not completed)
  const expiredTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return isPast(dueDate) && !task.completed;
  });

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task History</h1>
        
        {expiredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Expired Tasks</h3>
            <p className="text-muted-foreground">
              Tasks that are past their due date will appear here
            </p>
          </Card>
        ) : (
          <TaskSection
            tasks={expiredTasks}
            onTaskToggle={toggleTask}
            readOnly={true}
          />
        )}
      </div>
    </div>
  );
};

export default History;