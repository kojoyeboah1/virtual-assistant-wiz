import MainNav from "@/components/NavigationMenu";
import { TaskCard } from "@/components/TaskCard";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { isPast } from "date-fns";
import { Card } from "@/components/ui/card";
import { Inbox, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const History = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);

  // Get expired tasks (past due date)
  const expiredTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return isPast(dueDate);
  });

  const completedTasks = expiredTasks.filter(task => task.completed);
  const uncompletedTasks = expiredTasks.filter(task => !task.completed);

  const EmptyState = ({ message }: { message: string }) => (
    <Card className="p-8 text-center">
      <Inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No Tasks</h3>
      <p className="text-muted-foreground">{message}</p>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task History</h1>
        
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="uncompleted" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Uncompleted ({uncompletedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="mt-6">
            {completedTasks.length === 0 ? (
              <EmptyState message="No completed tasks in history" />
            ) : (
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    dueDate={format(new Date(task.dueDate), "PPP")}
                    completed={task.completed}
                    expired={task.expired}
                    readOnly={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="uncompleted" className="mt-6">
            {uncompletedTasks.length === 0 ? (
              <EmptyState message="No uncompleted tasks in history" />
            ) : (
              <div className="space-y-4">
                {uncompletedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    dueDate={format(new Date(task.dueDate), "PPP")}
                    completed={task.completed}
                    expired={task.expired}
                    readOnly={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;