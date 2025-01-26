import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskSection from "./TaskSection";
import CalendarSection from "./CalendarSection";
import NotesSection from "./NotesSection";

interface TabsSectionProps {
  tasks: any[];
  onTaskToggle: (taskId: string) => void;
  onNoteSave: (note: string) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const TabsSection = ({ 
  tasks, 
  onTaskToggle, 
  onNoteSave,
  selectedDate,
  onDateSelect,
}: TabsSectionProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks" className="space-y-4">
        <TaskSection 
          tasks={tasks.filter(task => 
            !selectedDate || 
            new Date(task.dueDate).toDateString() === selectedDate.toDateString()
          )} 
          onTaskToggle={onTaskToggle} 
        />
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