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
  onSubmit: (values: any) => void;
  onDelete?: () => void;
  initialValues?: any;
  mode?: "create" | "edit";
}

export const TaskDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  initialValues,
  mode = "create",
}: TaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <TaskForm 
          onSubmit={onSubmit} 
          onDelete={onDelete}
          initialValues={initialValues} 
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};