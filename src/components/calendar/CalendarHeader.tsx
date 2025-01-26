import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <h3 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};