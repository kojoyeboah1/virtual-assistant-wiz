import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskSection from "./TaskSection";
import CalendarSection from "./CalendarSection";
import NotesSection from "./NotesSection";

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
  return (
    <Tabs defaultValue="tasks" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks" className="space-y-4">
        <TaskSection 
          tasks={[]} // Empty array to prevent showing existing tasks
          onTaskToggle={onTaskToggle}
          onTaskCreate={onTaskCreate}
          onTaskEdit={onTaskEdit}
          createOnly={true} // New prop to indicate create-only mode
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