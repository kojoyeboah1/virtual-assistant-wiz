import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";

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
];

export const Calendar = ({ 
  events: userEvents, 
  tasks,
  onDateSelect,
  selectedDate 
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Combine user events with holidays and tasks
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

  const isToday = (day: Date) => isSameDay(day, new Date());
  const isSelected = (day: Date) => selectedDate && isSameDay(day, selectedDate);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>
          {format(currentDate, "MMMM yyyy")}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day) => (
            <div key={day} className="font-semibold text-sm py-2">
              {day}
            </div>
          ))}
          {daysInMonth.map((day, i) => {
            const dayEvents = allEvents.filter((event) =>
              isSameDay(new Date(event.time), day)
            );

            return (
              <div
                key={i}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "p-2 rounded-md transition-colors min-h-[60px] cursor-pointer hover:bg-accent",
                  !isSameMonth(day, currentDate) && "opacity-50",
                  isToday(day) && "bg-primary text-primary-foreground",
                  isSelected(day) && "ring-2 ring-primary",
                  dayEvents.length > 0 &&
                    !isToday(day) &&
                    !isSelected(day) &&
                    "bg-accent/50"
                )}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {dayEvents.map((event) => (
                  <Badge
                    key={event.id}
                    variant={
                      event.type === "holiday" 
                        ? "destructive" 
                        : event.type === "task" 
                        ? "secondary" 
                        : "default"
                    }
                    className="mt-1 block text-xs truncate"
                  >
                    {event.title}
                  </Badge>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};