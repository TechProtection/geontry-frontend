
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SmartDevice from '@/components/dashboard/SmartDevice';
import MemberItem from '@/components/dashboard/MemberItem';
import GroupsDialog from '@/components/dashboard/GroupsDialog';
import { Button } from '@/components/ui/button';
import { PlusIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Map from '@/components/dashboard/Map';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

// Sample device data
const devices = [
  { id: '1', name: 'Living Room Lights', type: 'light' as const, location: 'Living Room', defaultOn: true },
  { id: '2', name: 'Kitchen Lights', type: 'light' as const, location: 'Kitchen', defaultOn: false },
  { id: '3', name: 'Thermostat', type: 'climate' as const, location: 'Whole House', defaultOn: true },
  { id: '4', name: 'Bedroom Diffuser', type: 'diffuser' as const, location: 'Bedroom', defaultOn: false },
];

const Group: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showGroupCode, setShowGroupCode] = useState(false);
  const [userColor, setUserColor] = useState('#1e88e5');
  
  // Group code sample
  const groupCode = "GR-84721";

  // Sample members data
  const [members, setMembers] = useState([
    { id: '1', name: 'Pedro', color: '#1e88e5', isOwner: true, isCurrentUser: true },
    { id: '2', name: 'Carlos', color: '#43a047', isOwner: false, isCurrentUser: false },
  ]);

  const handleLeaveGroup = () => {
    toast({
      title: "Left group",
      description: "You have successfully left the group.",
    });
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
    toast({
      title: "Member removed",
      description: "The member has been removed from the group.",
    });
  };

  const handleColorChange = (color: string) => {
    setUserColor(color);
    setMembers(members.map(member => 
      member.isCurrentUser ? { ...member, color } : member
    ));
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-mono">Devices</h2>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Group Code: </h3>
              <div className="flex items-center bg-secondary/20 rounded px-2 py-1">
                {showGroupCode ? (
                  <span className="font-mono text-sm mr-2">{groupCode}</span>
                ) : (
                  <span className="font-mono text-sm mr-2">••••••</span>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowGroupCode(!showGroupCode)}
                  className="h-6 w-6"
                >
                  {showGroupCode ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {devices.map(device => (
              <SmartDevice
                key={device.id}
                id={device.id}
                name={device.name}
                type={device.type}
                location={device.location}
                defaultOn={device.defaultOn}
              />
            ))}
          </div>
          
          <h2 className="text-xl font-mono my-4">Location</h2>
          <div className="h-64 md:h-80">
            <Map />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-mono mb-4">Members</h2>
          <div className="geo-card">
            <div className="space-y-2 mb-6">
              {members.map(member => (
                <MemberItem 
                  key={member.id}
                  name={member.name}
                  color={member.color}
                  isOwner={member.isOwner}
                  isCurrentUser={member.isCurrentUser}
                  onColorChange={member.isCurrentUser ? handleColorChange : undefined}
                  onDelete={!member.isCurrentUser && members.some(m => m.isOwner && m.isCurrentUser) ? 
                    () => handleDeleteMember(member.id) : undefined}
                />
              ))}
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-techguard-500 text-techguard-500 hover:bg-techguard-500/10"
                onClick={() => setDialogOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Member
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                    Leave Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove you from the current group. You will lose access to all shared devices and settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeaveGroup}>Leave Group</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      
      <GroupsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </MainLayout>
  );
};

export default Group;
