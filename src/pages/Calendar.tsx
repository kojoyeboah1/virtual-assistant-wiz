import MainNav from "@/components/NavigationMenu";

const Calendar = () => {
  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your schedule here. Calendar implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default Calendar;