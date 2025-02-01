import { Calendar } from "@/components/Calendar";

interface CalendarSectionProps {
  tasks: any[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const CalendarSection = ({ tasks, selectedDate, onDateSelect }: CalendarSectionProps) => (
  <div className="space-y-4">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">Calendar</h2>
    <Calendar
      date={new Date()}
      events={[
        ...tasks.map(task => ({
          id: task.id,
          title: task.title,
          time: task.dueDate,
          type: "task" as const,
        })),
      ]}
      tasks={tasks}
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
    />
  </div>
);

export default CalendarSection;