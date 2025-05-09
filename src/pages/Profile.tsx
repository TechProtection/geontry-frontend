
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    phone: '+34 612 345 678',
    group: 'Family Home',
    joinDate: 'January 15, 2023',
    role: 'Admin',
  });

  const [editForm, setEditForm] = useState({ ...user });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleSubmit = () => {
    setUser(editForm);
    setEditDialogOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <Avatar className="h-20 w-20 border-4 border-background">
                  <AvatarFallback className="text-2xl">P</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="mt-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs inline-block">
                    {user.role}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{user.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Group Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Group</p>
                      <p>{user.group}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p>{user.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p>{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile information here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
