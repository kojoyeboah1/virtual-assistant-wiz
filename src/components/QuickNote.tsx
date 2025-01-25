import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SaveIcon } from "lucide-react";

interface QuickNoteProps {
  onSave?: (note: string) => void;
}

export const QuickNote = ({ onSave }: QuickNoteProps) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.trim() && onSave) {
      onSave(note);
      setNote("");
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">Quick Note</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] mb-4"
        />
        <Button onClick={handleSave} className="w-full">
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Note
        </Button>
      </CardContent>
    </Card>
  );
};