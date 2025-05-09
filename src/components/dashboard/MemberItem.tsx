
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemberItemProps {
  name: string;
  color: string;
  isOwner?: boolean;
  isCurrentUser?: boolean;
  onDelete?: () => void;
  onColorChange?: (color: string) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ 
  name, 
  color, 
  isOwner = false, 
  isCurrentUser = false,
  onDelete,
  onColorChange
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback style={{ backgroundColor: color }}>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          <span className="font-mono">{name}</span>
          {isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isCurrentUser && (
          <input 
            type="color" 
            value={color}
            onChange={(e) => onColorChange && onColorChange(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
          />
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-6 w-6 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MemberItem;
