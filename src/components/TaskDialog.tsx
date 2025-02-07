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
      <DialogContent className="max-w-2xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <div className="px-6 overflow-y-auto flex-1 h-full pb-20">
          <TaskForm 
            onSubmit={onSubmit} 
            onDelete={onDelete}
            initialValues={initialValues} 
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};