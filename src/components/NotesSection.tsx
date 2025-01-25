import { QuickNote } from "@/components/QuickNote";

interface NotesSectionProps {
  onNoteSave: (note: string) => void;
}

const NotesSection = ({ onNoteSave }: NotesSectionProps) => (
  <div className="space-y-4">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Notes</h2>
    <QuickNote onSave={onNoteSave} />
  </div>
);

export default NotesSection;