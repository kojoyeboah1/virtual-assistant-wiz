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
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh] z-50">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <div className="pb-6">
          <TaskForm
            onSubmit={(values) => {
              onSubmit(values);
              onOpenChange(false);
            }}
            initialValues={initialValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};