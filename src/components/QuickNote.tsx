import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { SaveIcon, PlusIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QuickNoteProps {
  onSave?: (note: string) => void;
  noteToEdit?: { id: string; content: string } | null;
  onCancel?: () => void;
}

export const QuickNote = ({ onSave, noteToEdit, onCancel }: QuickNoteProps) => {
  const [note, setNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (noteToEdit) {
      setNote(noteToEdit.content);
    }
  }, [noteToEdit]);

  const handleSave = async () => {
    if (!note.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save notes",
        variant: "destructive",
      });
      return;
    }

    const { error } = noteToEdit 
      ? await supabase
          .from('notes')
          .update({ content: note, updated_at: new Date().toISOString() })
          .eq('id', noteToEdit.id)
      : await supabase
          .from('notes')
          .insert({
            content: note,
            user_id: user.id
          });

    if (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: noteToEdit ? "Note updated successfully" : "Note saved successfully",
    });

    if (onSave) {
      onSave(note);
    }
    
    setNote("");
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg">
          {noteToEdit ? "Edit Note" : "Quick Note"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] mb-4"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <SaveIcon className="mr-2 h-4 w-4" />
            {noteToEdit ? "Update Note" : "Save Note"}
          </Button>
          {noteToEdit && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};