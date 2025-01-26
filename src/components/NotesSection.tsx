import { QuickNote } from "@/components/QuickNote";
import { format } from "date-fns";

interface NotesSectionProps {
  onNoteSave: (note: string) => void;
  selectedDate: Date | null;
}

const NotesSection = ({ onNoteSave, selectedDate }: NotesSectionProps) => (
  <div className="space-y-4">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">
      Quick Notes {selectedDate && `for ${format(selectedDate, "MMMM d, yyyy")}`}
    </h2>
    <QuickNote onSave={onNoteSave} />
  </div>
);

export default NotesSection;