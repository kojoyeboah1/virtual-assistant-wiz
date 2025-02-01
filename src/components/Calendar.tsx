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
  format,
} from "date-fns";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarDay } from "./calendar/CalendarDay";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEventsForNextYears } from "@/utils/calendarEvents";
import { TaskDialog } from "./TaskDialog";
import { useToast } from "@/hooks/use-toast";

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
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTaskDate, setSelectedTaskDate] = useState<Date | null>(null);
  const { toast } = useToast();

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

  const handleDayClick = (day: Date) => {
    const dayEvents = allEvents.filter((event) =>
      isSameDay(new Date(event.time), day)
    );
    
    setSelectedTaskDate(day);
    setIsTaskDialogOpen(true);
    onDateSelect(day);

    if (dayEvents.length > 0) {
      const eventTitles = dayEvents.map(event => event.title).join(", ");
      toast({
        title: format(day, "MMMM d, yyyy"),
        description: `Events: ${eventTitles}`,
      });
    }
  };

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
          <TooltipProvider>
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
                        onClick={() => handleDayClick(day)}
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
          </TooltipProvider>
        </div>
      </CardContent>
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={(values) => {
          if (selectedTaskDate) {
            const dayEvents = allEvents.filter((event) =>
              isSameDay(new Date(event.time), selectedTaskDate)
            );
            const eventDescriptions = dayEvents
              .map((event) => event.title)
              .join(", ");
            
            values.description = eventDescriptions
              ? `Events on this day: ${eventDescriptions}\n\n${values.description}`
              : values.description;
          }
          setIsTaskDialogOpen(false);
        }}
        mode="create"
        initialValues={
          selectedTaskDate
            ? {
                dueDate: selectedTaskDate.toISOString().split("T")[0],
              }
            : undefined
        }
      />
    </Card>
  );
};