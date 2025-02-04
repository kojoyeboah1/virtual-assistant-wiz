import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationMap from "./LocationMap";
import { Trash2 } from "lucide-react";

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    location?: { lat: number; lng: number };
  }) => void;
  onDelete?: () => void;
  initialValues?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    location?: { lat: number; lng: number };
  };
  mode?: "create" | "edit";
}

export const TaskForm = ({ onSubmit, onDelete, initialValues = {}, mode = "create" }: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialValues.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(initialValues.dueDate || "");
  const [location, setLocation] = useState(initialValues.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || "",
      priority,
      dueDate,
      location,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">
          Priority
        </label>
        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium">
          Due Date
        </label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location (Optional)</label>
        <LocationMap
          location={location}
          onLocationSelect={setLocation}
          className="h-[200px]"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Task
        </Button>
        {mode === "edit" && onDelete && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={onDelete}
            className="px-3"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};