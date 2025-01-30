import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Task {
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityCount = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Task Completion</h3>
            <Progress value={completionRate} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed ({Math.round(completionRate)}%)
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Priority Distribution</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-red-500 font-medium">{priorityCount.high}</span>
                <span className="text-muted-foreground ml-1">High</span>
              </div>
              <div>
                <span className="text-yellow-500 font-medium">{priorityCount.medium}</span>
                <span className="text-muted-foreground ml-1">Medium</span>
              </div>
              <div>
                <span className="text-green-500 font-medium">{priorityCount.low}</span>
                <span className="text-muted-foreground ml-1">Low</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStats;