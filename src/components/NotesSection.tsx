import { QuickNote } from "@/components/QuickNote";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesSectionProps {
  onNoteSave: (note: string) => void;
  selectedDate: Date | null;
}

const NotesSection = ({ onNoteSave, selectedDate }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
      return;
    }

    setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Note deleted successfully",
    });

    fetchNotes();
  };

  const handleSave = async (note: string) => {
    await fetchNotes();
    setShowQuickNote(false);
    setEditingNote(null);
    onNoteSave(note);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">
          Notes {selectedDate && `for ${format(selectedDate, "MMMM d, yyyy")}`}
        </h2>
        {!showQuickNote && !editingNote && (
          <Button onClick={() => setShowQuickNote(true)} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
        )}
      </div>

      {(showQuickNote || editingNote) && (
        <QuickNote
          onSave={handleSave}
          noteToEdit={editingNote}
          onCancel={() => {
            setShowQuickNote(false);
            setEditingNote(null);
          }}
        />
      )}

      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Created {format(new Date(note.created_at), "PPp")}
                  </p>
                  {note.updated_at && note.updated_at !== note.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Updated {format(new Date(note.updated_at), "PPp")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingNote(note)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
          {notes.length === 0 && !showQuickNote && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notes yet. Create your first note!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesSection;