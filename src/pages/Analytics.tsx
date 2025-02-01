import MainNav from "@/components/NavigationMenu";

const Analytics = () => {
  return (
    <div className="container mx-auto p-4">
      <MainNav />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and statistics here. Analytics implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default Analytics;