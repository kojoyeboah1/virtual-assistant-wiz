import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "meeting" | "task" | "reminder";
}

interface CalendarProps {
  events: CalendarEvent[];
  date: Date;
}

export const Calendar = ({ events, date }: CalendarProps) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day) => (
            <div key={day} className="font-semibold text-sm py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i + 1;
            const dayEvents = events.filter(
              (event) => new Date(event.time).getDate() === day
            );

            return (
              <div
                key={i}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isToday(day) && "bg-primary text-primary-foreground",
                  dayEvents.length > 0 && !isToday(day) && "bg-accent"
                )}
              >
                <span className="text-sm">{day}</span>
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="mt-1">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};