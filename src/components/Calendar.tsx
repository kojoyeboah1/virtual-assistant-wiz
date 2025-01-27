import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarDay } from "./calendar/CalendarDay";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "meeting" | "task" | "reminder" | "holiday";
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed: boolean;
}

interface CalendarProps {
  events: CalendarEvent[];
  tasks: Task[];
  date: Date;
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const HOLIDAYS = [
  { date: "2024-01-01", title: "New Year's Day" },
  { date: "2024-12-25", title: "Christmas" },
  { date: "2024-07-04", title: "Independence Day" },
  { date: "2024-01-15", title: "Martin Luther King Jr. Day" },
  { date: "2024-02-19", title: "Presidents' Day" },
  { date: "2024-05-27", title: "Memorial Day" },
  { date: "2024-09-02", title: "Labor Day" },
  { date: "2024-11-28", title: "Thanksgiving" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar = ({
  events: userEvents,
  tasks,
  onDateSelect,
  selectedDate,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const allEvents = [
    ...userEvents,
    ...HOLIDAYS.map((holiday) => ({
      id: `holiday-${holiday.date}`,
      title: holiday.title,
      time: holiday.date,
      type: "holiday" as const,
    })),
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      time: task.dueDate,
      type: "task" as const,
    })),
  ];

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
        <div className="grid grid-cols-7 gap-2 text-center">
          {DAYS.map((day) => (
            <div key={day} className="font-semibold text-sm py-2">
              {day}
            </div>
          ))}
          {daysInMonth.map((day, i) => {
            const dayEvents = allEvents.filter((event) =>
              isSameDay(new Date(event.time), day)
            );

            return (
              <CalendarDay
                key={i}
                day={day}
                events={dayEvents}
                currentDate={currentDate}
                isSelected={!!selectedDate && isSameDay(day, selectedDate)}
                isToday={isSameDay(day, new Date())}
                onClick={() => onDateSelect(day)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};