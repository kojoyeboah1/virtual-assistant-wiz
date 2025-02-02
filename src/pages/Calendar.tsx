import { useState } from "react";
import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);

  // Group tasks by month and year
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate);
    const key = format(date, 'MMMM yyyy');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  // Sort tasks within each group by date
  Object.keys(groupedTasks).forEach(key => {
    groupedTasks[key].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  });

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([monthYear, monthTasks]) => (
          <Card key={monthYear}>
            <CardHeader>
              <CardTitle>{monthYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthTasks.map(task => (
                  <div key={task.id} className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      {task.completed && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      )}
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

export default Calendar;