import { useState } from "react";
import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import CalendarSection from "@/components/CalendarSection";

const Calendar = () => {
  const { userId } = useAuth();
  const { tasks } = useTasks(userId);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <CalendarSection
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
};

export default Calendar;