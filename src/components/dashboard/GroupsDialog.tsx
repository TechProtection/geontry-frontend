
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GroupsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupsDialog: React.FC<GroupsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [groupCode, setGroupCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle group code submission
    console.log('Group code submitted:', groupCode);
    // Close dialog after submission if needed
    // onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogTitle className="text-xl font-mono text-center mb-6">
          Groups
        </DialogTitle>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Ingreso el código"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              className="border-border bg-background text-foreground"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-techguard-600 hover:bg-techguard-700"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupsDialog;
