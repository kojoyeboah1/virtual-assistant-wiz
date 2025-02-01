import { Loader2 } from "lucide-react";

export const MapLoader = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading map...</span>
    </div>
  );
};