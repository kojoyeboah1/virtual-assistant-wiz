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
        {
          id: "1",
          title: "Team Meeting",
          time: "2024-02-20T10:00:00",
          type: "meeting",
        },
        {
          id: "2",
          title: "Project Review",
          time: "2024-02-22T14:00:00",
          type: "meeting",
        },
        {
          id: "3",
          title: "Weekly Sync",
          time: "2024-02-26T11:00:00",
          type: "meeting",
        },
      ]}
      tasks={tasks}
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
    />
  </div>
);

export default CalendarSection;