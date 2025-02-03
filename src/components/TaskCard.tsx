import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationMap from "./LocationMap";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed?: boolean;
  expired?: boolean;
  onClick?: () => void;
  onToggleComplete?: () => void;
  readOnly?: boolean;
}

export const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  location,
  completed = false,
  expired = false,
  onClick,
  onToggleComplete,
  readOnly = false,
}: TaskCardProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-start gap-3">
      {!readOnly && onToggleComplete && (
        <Checkbox
          checked={completed}
          onCheckedChange={onToggleComplete}
          className="mt-4"
        />
      )}
      <Card
        className={cn(
          "flex-1",
          onClick && !readOnly ? "hover-lift cursor-pointer" : "",
          completed && "opacity-75",
          expired && !completed && "opacity-50 bg-red-50"
        )}
        onClick={readOnly ? undefined : onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col">
            <h3 className={cn("font-semibold", completed && "line-through")}>
              {title}
            </h3>
            <Badge
              variant="secondary"
              className={cn("mt-1 w-fit", priorityColors[priority])}
            >
              {priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{dueDate}</span>
            </div>
            {location && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  <span>Location attached</span>
                </div>
                <LocationMap location={location} readonly className="mt-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};