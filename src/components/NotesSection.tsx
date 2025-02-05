import { QuickNote } from "@/components/QuickNote";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface NotesSectionProps {
  onNoteSave: (note: string) => void;
  selectedDate: Date | null;
}

const NotesSection = ({ onNoteSave, selectedDate }: NotesSectionProps) => {
  const [showQuickNote, setShowQuickNote] = useState(false);

  const handleSave = async (note: string) => {
    await onNoteSave(note);
    setShowQuickNote(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">
          Quick Note {selectedDate && `for ${format(selectedDate, "MMMM d, yyyy")}`}
        </h2>
      </div>

      {!showQuickNote ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Button onClick={() => setShowQuickNote(true)} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Quick Note
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                View all your notes in the Notes page
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <QuickNote
          onSave={handleSave}
          onCancel={() => setShowQuickNote(false)}
        />
      )}
    </div>
  );
};

export default NotesSection;