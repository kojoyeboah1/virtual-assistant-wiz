import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SaveIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QuickNoteProps {
  onSave?: (note: string) => void;
}

export const QuickNote = ({ onSave }: QuickNoteProps) => {
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    if (!note.trim()) return;

    const { error } = await supabase
      .from('notes')
      .insert([{ content: note }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Note saved successfully",
    });

    if (onSave) {
      onSave(note);
    }
    
    setNote("");
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