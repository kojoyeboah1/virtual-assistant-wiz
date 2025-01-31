import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MainNav from "@/components/NavigationMenu";

export default function Help() {
  return (
    <div className="container mx-auto p-6">
      <MainNav />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a new note?</AccordionTrigger>
              <AccordionContent>
                To create a new note, navigate to the Notes page and click on the "Create Note" button. 
                You can then start typing your note content and it will be automatically saved.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I manage my tasks?</AccordionTrigger>
              <AccordionContent>
                You can manage your tasks from the main dashboard. Click on any task to edit it, 
                or use the "Add Task" button to create a new one. You can set due dates, priorities, 
                and mark tasks as complete.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I change the theme?</AccordionTrigger>
              <AccordionContent>
                Yes! Go to Settings and under the Appearance section, you can choose between Light, 
                Dark, or System theme to match your preferences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I sign out?</AccordionTrigger>
              <AccordionContent>
                Click on your profile icon in the top right corner and select "Sign Out" from the menu.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}