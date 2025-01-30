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
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

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
  { date: "2024-01-15", title: "Martin Luther King Jr. Day" },
  { date: "2024-02-14", title: "Valentine's Day" },
  { date: "2024-02-19", title: "Presidents' Day" },
  { date: "2024-03-17", title: "St. Patrick's Day" },
  { date: "2024-04-01", title: "April Fool's Day" },
  { date: "2024-05-27", title: "Memorial Day" },
  { date: "2024-06-19", title: "Juneteenth" },
  { date: "2024-07-04", title: "Independence Day" },
  { date: "2024-09-02", title: "Labor Day" },
  { date: "2024-10-31", title: "Halloween" },
  { date: "2024-11-11", title: "Veterans Day" },
  { date: "2024-11-28", title: "Thanksgiving" },
  { date: "2024-12-25", title: "Christmas" },
  { date: "2024-12-31", title: "New Year's Eve" },
];

const DEFAULT_EVENTS = [
  {
    id: "default-1",
    title: "Team Meeting",
    time: "2024-02-20T10:00:00",
    type: "meeting" as const,
  },
  {
    id: "default-2",
    title: "Project Review",
    time: "2024-02-22T14:00:00",
    type: "meeting" as const,
  },
  {
    id: "default-3",
    title: "Weekly Sync",
    time: "2024-02-26T11:00:00",
    type: "meeting" as const,
  },
  {
    id: "default-4",
    title: "Monthly Planning",
    time: "2024-03-01T09:00:00",
    type: "meeting" as const,
  },
  {
    id: "default-5",
    title: "Quarterly Review",
    time: "2024-03-15T13:00:00",
    type: "meeting" as const,
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar = ({
  events: userEvents,
  tasks,
  onDateSelect,
  selectedDate,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const allEvents = [
    ...userEvents,
    ...DEFAULT_EVENTS,
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
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    onMouseEnter={() => setHoveredDate(day)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <CalendarDay
                      day={day}
                      events={dayEvents}
                      currentDate={currentDate}
                      isSelected={!!selectedDate && isSameDay(day, selectedDate)}
                      isToday={isSameDay(day, new Date())}
                      onClick={() => onDateSelect(day)}
                      isHovered={!!hoveredDate && isSameDay(day, hoveredDate)}
                    />
                  </div>
                </TooltipTrigger>
                {dayEvents.length > 0 && (
                  <TooltipContent side="right" className="p-2 space-y-1">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="text-sm">
                        {event.title} ({event.type})
                      </div>
                    ))}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};