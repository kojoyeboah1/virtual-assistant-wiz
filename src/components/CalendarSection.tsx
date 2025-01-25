import { Calendar } from "@/components/Calendar";

const CalendarSection = () => (
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
        // Add more events as needed
      ]}
    />
  </div>
);

export default CalendarSection;