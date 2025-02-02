import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskSection from "./TaskSection";
import CalendarSection from "./CalendarSection";
import NotesSection from "./NotesSection";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ClipboardList, Calendar as CalendarIcon, StickyNote } from "lucide-react";

interface TabsSectionProps {
  tasks: any[];
  onTaskToggle: (taskId: string) => void;
  onTaskCreate: (task: any) => void;
  onTaskEdit: (taskId: string, task: any) => void;
  onNoteSave: (note: string) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const TabsSection = ({ 
  tasks, 
  onTaskToggle,
  onTaskCreate,
  onTaskEdit,
  onNoteSave,
  selectedDate,
  onDateSelect,
}: TabsSectionProps) => {
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  return (
    <Tabs defaultValue="tasks" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Tasks
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Notes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tasks" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
              <TaskSection 
                tasks={[]}
                onTaskToggle={onTaskToggle}
                onTaskCreate={onTaskCreate}
                onTaskEdit={onTaskEdit}
                createOnly={true}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Today's Tasks ({todaysTasks.length})</h3>
              {todaysTasks.length > 0 ? (
                <div className="space-y-2">
                  {todaysTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-accent/50 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due {format(new Date(task.dueDate), 'h:mm a')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No tasks due today
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="calendar" className="space-y-4">
        <CalendarSection 
          tasks={tasks}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </TabsContent>
      <TabsContent value="notes" className="space-y-4">
        <NotesSection onNoteSave={onNoteSave} selectedDate={selectedDate} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;