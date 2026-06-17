import { ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

interface StepCollapsibleProps {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  completed?: boolean;
  completedMessage?: string;
}

export const StepCollapsible = ({
  id,
  title,
  open,
  onToggle,
  children,
  completed,
  completedMessage,
}: StepCollapsibleProps) => (
  <div className={`border rounded-md p-4`}>
    <Collapsible open={open} onOpenChange={() => onToggle(id)}>
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-3">
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="flex gap-2 items-center">
          {completed && completedMessage && (
            <span className="text-sm text-primary">{completedMessage}</span>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown
                className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="mt-4 space-y-2 p-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  </div>
);
