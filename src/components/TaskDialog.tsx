import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    location?: { lat: number; lng: number };
  }) => void;
  initialValues?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    location?: { lat: number; lng: number };
  };
  mode: "create" | "edit";
}

export const TaskDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  mode,
}: TaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  );
};