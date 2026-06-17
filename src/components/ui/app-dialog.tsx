import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import * as React from "react";

const SIZE_CLASSES = {
  "sm": "sm:max-w-md",
  "md": "sm:max-w-xl",
  "lg": "sm:max-w-2xl",
  "xl": "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
};

type AppDialogProps = {
  heading: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  open: boolean;
  onClose: (open: boolean) => void;
  size?: keyof typeof SIZE_CLASSES;
};

const AppDialog: React.FC<AppDialogProps> = ({
  heading,
  children,
  action,
  open,
  onClose,
  size = "sm",
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className={`${SIZE_CLASSES[size]} bg-secondary bg-card`}>
        {/* Header */}
        {heading && (
          <DialogHeader>
            <DialogTitle>{heading}</DialogTitle>
          </DialogHeader>
        )}

 
        {/* Body */}
        <div className="overflow-y-auto max-h-[70vh] py-2">{children}</div>

        {/* Footer */}
        {action && <DialogFooter>{action}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;