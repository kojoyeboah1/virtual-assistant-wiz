import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";

const History = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);

  const completedTasks = tasks.filter(task => task.completed);
  const uncompletedTasks = tasks.filter(task => task.expired && !task.completed);

  const TaskList = ({ tasks, type }: { tasks: any[], type: 'completed' | 'uncompleted' }) => (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="relative">
          <TaskCard {...task} />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              type === 'completed' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {type === 'completed' ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Uncompleted
                </>
              )}
            </span>
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No {type} tasks found
        </p>
      )}
    </div>
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