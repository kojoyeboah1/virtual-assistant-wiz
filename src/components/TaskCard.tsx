import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  completed?: boolean;
  onClick?: () => void;
}

export const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  completed = false,
  onClick,
}: TaskCardProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card
      className={cn(
        "glass-card hover-lift cursor-pointer",
        completed && "opacity-75"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
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
        {completed && (
          <CheckCircle2Icon className="h-5 w-5 text-green-500" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};