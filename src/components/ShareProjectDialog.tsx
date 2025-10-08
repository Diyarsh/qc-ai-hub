import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link, Eye, MessageSquare, Copy } from "lucide-react";

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
}

export function ShareProjectDialog({ open, onOpenChange, projectName }: ShareProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Everyone Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-medium mb-1">Everyone</div>
              <div className="text-sm text-muted-foreground">
                Allow anyone to access the project, instructions, and files.
              </div>
            </div>
            <Switch />
          </div>

          {/* Specific Emails */}
          <div className="space-y-2">
            <div className="font-medium">Specific emails</div>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter email here"
                className="flex-1"
              />
              <Button variant="secondary">Add</Button>
            </div>
          </div>

          {/* Copy Link & Stats */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Link className="h-4 w-4" />
              Copy Link
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <Copy className="h-4 w-4" />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
