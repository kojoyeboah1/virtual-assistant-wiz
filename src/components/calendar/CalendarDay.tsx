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
  const getAbbreviation = (title: string) => {
    return title.split(' ').map(word => word[0]).join('');
  };

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "holiday":
        return "bg-red-100 text-red-800";
      case "meeting":
        return "bg-blue-100 text-blue-800";
      case "task":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-all duration-200 min-h-[60px] cursor-pointer",
        "hover:bg-accent hover:scale-105 hover:shadow-md",
        "flex flex-col gap-1",
        !isSameMonth(day, currentDate) && "opacity-50",
        isToday && "bg-primary text-primary-foreground",
        isSelected && "ring-2 ring-primary",
        isHovered && "scale-105 shadow-lg",
        events.length > 0 && !isToday && !isSelected && "bg-accent/50"
      )}
      role="button"
      aria-label={`Select ${format(day, 'PP')}`}
    >
      <span className="text-sm font-medium">{format(day, "d")}</span>
      <div className="space-y-1">
        {events.map((event) => (
          <Badge
            key={event.id}
            variant="secondary"
            className={cn(
              "text-xs truncate animate-fade-in w-fit",
              getEventColor(event.type)
            )}
            title={event.title}
          >
            {getAbbreviation(event.title)}
          </Badge>
        ))}
      </div>
    </div>
  );
};