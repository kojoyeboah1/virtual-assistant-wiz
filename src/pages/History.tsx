import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const History = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);

  // Get expired or completed tasks
  const historicalTasks = tasks.filter(task => task.expired || task.completed);

  // Group tasks by month and year
  const groupedTasks = historicalTasks.reduce((acc, task) => {
    const date = new Date(task.dueDate);
    const key = format(date, 'MMMM yyyy');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task History</h1>
        
        {Object.entries(groupedTasks).map(([monthYear, monthTasks]) => (
          <Card key={monthYear}>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">{monthYear}</h2>
              <div className="space-y-4">
                {monthTasks.map((task) => (
                  <div key={task.id} className="relative">
                    <TaskCard {...task} />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.completed 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {task.completed ? 'Completed' : 'Expired'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;