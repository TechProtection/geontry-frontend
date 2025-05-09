
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Home, Thermometer, Lock, Lightbulb, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'proximity' | 'device' | 'security' | 'system' | 'user';
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome Home',
    message: 'You have entered your home zone. All systems activated.',
    time: '10 minutes ago',
    type: 'proximity',
    read: false
  },
  {
    id: '2',
    title: 'Temperature Alert',
    message: 'The living room temperature is outside the optimal range.',
    time: '1 hour ago',
    type: 'device',
    read: false
  },
  {
    id: '3',
    title: 'Door Unlocked',
    message: 'Your front door was unlocked automatically upon arrival.',
    time: '10 minutes ago',
    type: 'security',
    read: true
  },
  {
    id: '4',
    title: 'Lights On',
    message: 'Living room lights have been turned on automatically.',
    time: '11 minutes ago',
    type: 'device',
    read: true
  },
  {
    id: '5',
    title: 'System Update',
    message: 'GeoEntry was updated to version 2.4.1',
    time: '1 day ago',
    type: 'system',
    read: true
  },
  {
    id: '6',
    title: 'New User Added',
    message: 'Carlos has been added to your home group.',
    time: '3 days ago',
    type: 'user',
    read: true
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'proximity':
      return <Home className="h-5 w-5" />;
    case 'device':
      return <Lightbulb className="h-5 w-5" />;
    case 'security':
      return <Lock className="h-5 w-5" />;
    case 'system':
      return <Thermometer className="h-5 w-5" />;
    case 'user':
      return <User className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'proximity':
      return 'bg-blue-500/10 text-blue-500';
    case 'device':
      return 'bg-amber-500/10 text-amber-500';
    case 'security':
      return 'bg-green-500/10 text-green-500';
    case 'system':
      return 'bg-purple-500/10 text-purple-500';
    case 'user':
      return 'bg-cyan-500/10 text-cyan-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const NotificationsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with your home activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 border border-border rounded-lg transition-colors flex gap-4 items-start",
                    notification.read ? 'bg-transparent' : 'bg-accent/5'
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full",
                    getNotificationColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn(
                        "font-medium",
                        !notification.read && "font-bold"
                      )}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
