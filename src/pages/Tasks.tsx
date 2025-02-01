import MainNav from "@/components/NavigationMenu";

const Tasks = () => {
  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <p className="text-muted-foreground">
          Manage your tasks and track progress here. Task management implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default Tasks;