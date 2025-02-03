import MainNav from "@/components/NavigationMenu";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths, isPast } from "date-fns";

const Analytics = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);

  const last6Months = eachMonthOfInterval({
    start: startOfMonth(subMonths(new Date(), 5)),
    end: endOfMonth(new Date()),
  });

  const monthlyData = last6Months.map(month => {
    const monthTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startOfMonth(month) && taskDate <= endOfMonth(month);
    });

    return {
      month: format(month, 'MMM yyyy'),
      completed: monthTasks.filter(task => task.completed).length,
      uncompleted: monthTasks.filter(task => !task.completed && isPast(new Date(task.dueDate))).length,
      pending: monthTasks.filter(task => !task.completed && !isPast(new Date(task.dueDate))).length,
    };
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const uncompletedTasks = tasks.filter(task => !task.completed && isPast(new Date(task.dueDate))).length;
  const pendingTasks = tasks.filter(task => !task.completed && !isPast(new Date(task.dueDate))).length;
  const completionRate = (completedTasks + uncompletedTasks) > 0 
    ? ((completedTasks / (completedTasks + uncompletedTasks)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium">Total Tasks</h3>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium">Uncompleted</h3>
            <p className="text-3xl font-bold text-red-600">{uncompletedTasks}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium">Completion Rate</h3>
            <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Task Progress Over Time</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                <Bar dataKey="uncompleted" name="Uncompleted" fill="#ef4444" />
                <Bar dataKey="pending" name="Pending" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;