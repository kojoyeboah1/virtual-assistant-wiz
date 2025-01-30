import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getYear,
} from "date-fns";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarDay } from "./calendar/CalendarDay";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { getEventsForNextYears } from "@/utils/calendarEvents";

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

  // Get events and holidays for the next few years
  const currentYear = getYear(new Date());
  const { holidays, events: defaultEvents } = getEventsForNextYears(currentYear);

  const allEvents = [
    ...userEvents,
    ...defaultEvents,
    ...holidays.map((holiday) => ({
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