import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    HeadphonesIcon,
    Pencil,
    Plus,
    Share2
} from "lucide-react";
import { useState } from "react";

const actions = [
  {
    id: "share",
    label: "Share",
    icon: Share2,
    openStyle: { transform: "translate(-76px, 0px) scale(1)", opacity: 1 },
    delay: "40ms",
  },
  {
    id: "edit",
    label: "Edit",
    icon: Pencil,
    openStyle: { transform: "translate(-54px, -54px) scale(1)", opacity: 1 },
    delay: "70ms",
  },
  {
    id: "contact",
    label: "Contact",
    icon: HeadphonesIcon,
    openStyle: { transform: "translate(0px, -76px) scale(1)", opacity: 1 },
    delay: "100ms",
  },
];

export default function SpeedDial() {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={100}>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative flex items-center justify-center w-16 h-16">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={action.label}
                    className={cn(
                      "absolute rounded-full w-12 h-12 shadow-md z-10",
                      "transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]",
                      open ? "pointer-events-auto" : "pointer-events-none",
                    )}
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: "-24px",
                      marginLeft: "-24px",
                      opacity: open ? 1 : 0,
                      transform: open
                        ? action.openStyle.transform
                        : "translate(0px, 0px) scale(0.3)",
                      transitionDelay: open ? action.delay : "0ms",
                    }}
                    onClick={() => console.log(`${action.label} clicked`)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Button
            size="icon"
            className="rounded-full w-16 h-16 shadow-lg z-20 relative"
            aria-expanded={open}
            aria-label="Open actions"
            onClick={() => setOpen((o) => !o)}
          >
            <Plus
              className="w-6 h-6 transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
            />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
