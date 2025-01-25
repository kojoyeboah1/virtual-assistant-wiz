import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskSection from "./TaskSection";
import CalendarSection from "./CalendarSection";
import NotesSection from "./NotesSection";

interface TabsSectionProps {
  tasks: any[];
  onTaskToggle: (taskId: string) => void;
  onNoteSave: (note: string) => void;
}

const TabsSection = ({ tasks, onTaskToggle, onNoteSave }: TabsSectionProps) => {
  return (
    <Tabs defaultValue="tasks" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks" className="space-y-4">
        <TaskSection tasks={tasks} onTaskToggle={onTaskToggle} />
      </TabsContent>
      <TabsContent value="calendar" className="space-y-4">
        <CalendarSection />
      </TabsContent>
      <TabsContent value="notes" className="space-y-4">
        <NotesSection onNoteSave={onNoteSave} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;