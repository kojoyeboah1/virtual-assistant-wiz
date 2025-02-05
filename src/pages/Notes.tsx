import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import MainNav from "@/components/NavigationMenu";
import { useAuth } from "@/hooks/useAuth";
import { QuickNote } from "@/components/QuickNote";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  const { userId } = useAuth();

  const fetchNotes = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    
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

  const deleteNote = async (id: string) => {
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

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setShowQuickNote(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 fade-in">
        <MainNav />
        
        {!showQuickNote && (
          <Button 
            onClick={() => setShowQuickNote(true)}
            className="w-full sm:w-auto mb-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Button>
        )}

        {showQuickNote && (
          <QuickNote 
            onSave={() => {
              fetchNotes();
              setShowQuickNote(false);
              setEditingNote(null);
            }}
            noteToEdit={editingNote}
            onCancel={() => {
              setShowQuickNote(false);
              setEditingNote(null);
            }}
          />
        )}

        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  You haven't created any notes yet. Start by creating your first note!
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="relative group transition-all hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {format(new Date(note.created_at), "PPp")}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditClick(note)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    {note.updated_at !== note.created_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Updated: {format(new Date(note.updated_at), "PPp")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Notes;