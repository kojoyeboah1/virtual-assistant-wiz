import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import TabsSection from "@/components/TabsSection";
import MainNav from "@/components/NavigationMenu";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  location?: { lat: number; lng: number };
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  // Fetch tasks from Supabase
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        location: task.location_lat && task.location_lng 
          ? { lat: task.location_lat, lng: task.location_lng }
          : undefined,
        completed: task.completed,
      }));
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, "id" | "completed">) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          due_date: newTask.dueDate,
          location_lat: newTask.location?.lat,
          location_lng: newTask.location?.lng,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, task }: { taskId: string; task: Omit<Task, "id" | "completed"> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.dueDate,
          location_lat: task.location?.lat,
          location_lng: task.location?.lng,
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleTaskToggle = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleTaskCreate = (task: Omit<Task, "id" | "completed">) => {
    createTaskMutation.mutate(task);
  };

  const handleTaskEdit = (taskId: string, task: Omit<Task, "id" | "completed">) => {
    updateTaskMutation.mutate({ taskId, task });
  };

  const handleNoteSave = (note: string) => {
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 fade-in">
        <MainNav />
        <Header />
        <TabsSection
          tasks={tasks}
          onTaskToggle={handleTaskToggle}
          onTaskCreate={handleTaskCreate}
          onTaskEdit={handleTaskEdit}
          onNoteSave={handleNoteSave}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  );
};

export default Index;