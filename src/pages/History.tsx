import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent } from "@/components/ui/card";
import { format, isPast } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, InboxIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const History = () => {
  const { userId } = useAuth();
  const { tasks, toggleTask } = useTasks(userId);

  const completedTasks = tasks.filter(task => task.completed);
  const uncompletedTasks = tasks.filter(task => !task.completed && isPast(new Date(task.dueDate)));
  const pendingTasks = tasks.filter(task => !task.completed && !isPast(new Date(task.dueDate)));

  const TaskList = ({ tasks, type }: { tasks: any[], type: 'completed' | 'uncompleted' | 'pending' }) => (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="relative">
          {type === 'pending' && (
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-10">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
            </div>
          )}
          <TaskCard 
            {...task} 
            onClick={type === 'pending' ? () => toggleTask(task.id) : undefined}
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              type === 'completed' 
                ? 'bg-green-100 text-green-800'
                : type === 'uncompleted'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {type === 'completed' ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </>
              ) : type === 'uncompleted' ? (
                <>
                  <XCircle className="h-3 w-3" />
                  Uncompleted
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Pending
                </>
              )}
            </span>
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <InboxIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No {type} tasks</h3>
          <p className="text-muted-foreground">
            {type === 'completed' 
              ? 'Complete some tasks to see them here'
              : type === 'uncompleted'
              ? 'No tasks have passed their due date'
              : 'No pending tasks at the moment'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task History</h1>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="uncompleted" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Uncompleted ({uncompletedTasks.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6 pl-12">
                <TaskList tasks={pendingTasks} type="pending" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card>
              <CardContent className="pt-6">
                <TaskList tasks={completedTasks} type="completed" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="uncompleted">
            <Card>
              <CardContent className="pt-6">
                <TaskList tasks={uncompletedTasks} type="uncompleted" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;