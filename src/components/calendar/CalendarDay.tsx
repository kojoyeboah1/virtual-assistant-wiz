import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, isSameDay, isSameMonth } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "meeting" | "task" | "reminder" | "holiday";
}

interface CalendarDayProps {
  day: Date;
  events: CalendarEvent[];
  currentDate: Date;
  isSelected: boolean;
  isToday: boolean;
  isHovered?: boolean;
  onClick: () => void;
}

export const CalendarDay = ({
  day,
  events,
  currentDate,
  isSelected,
  isToday,
  isHovered,
  onClick,
}: CalendarDayProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-all duration-200 min-h-[60px] cursor-pointer hover:bg-accent",
        !isSameMonth(day, currentDate) && "opacity-50",
        isToday && "bg-primary text-primary-foreground",
        isSelected && "ring-2 ring-primary",
        isHovered && "scale-105 shadow-lg",
        events.length > 0 && !isToday && !isSelected && "bg-accent/50"
      )}
    >
      <span className="text-sm font-medium">{format(day, "d")}</span>
      <div className="space-y-1 mt-1">
        {events.map((event) => (
          <Badge
            key={event.id}
            variant={
              event.type === "holiday"
                ? "destructive"
                : event.type === "task"
                ? "secondary"
                : "default"
            }
            className="block text-xs truncate animate-fade-in"
          >
            {event.title}
          </Badge>
        ))}
      </div>
    </div>
  );
};