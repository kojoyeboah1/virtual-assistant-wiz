import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "task" | "reminder" | "holiday";
}

interface CalendarLegendProps {
  eventsByType: Record<CalendarEvent["type"], Set<string>>;
  currentDate: Date;
}

export const getEventColor = (type: CalendarEvent["type"]) => {
  switch (type) {
    case "holiday":
      return "bg-red-100 text-red-800";
    case "task":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const CalendarLegend = ({ eventsByType, currentDate }: CalendarLegendProps) => {
  if (Object.keys(eventsByType).length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-semibold">
        Events for {format(currentDate, 'MMMM yyyy')}
      </h3>
      {(Object.entries(eventsByType) as [CalendarEvent["type"], Set<string>][]).map(([type, titles]) => (
        <div key={type} className="space-y-2">
          <h4 className="text-sm font-medium capitalize">{type}s</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(titles).map((title) => (
              <Badge
                key={`${type}-${title}`}
                variant="secondary"
                className={`text-xs ${getEventColor(type)}`}
              >
                {title}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};