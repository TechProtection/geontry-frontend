
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, RefreshCw, Download, LampFloor, Thermometer, AirVent, Blinds, Droplets, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

// Mock data for device activity logs
const activityLogs = [
  { id: 1, device: 'Living Room Light', action: 'Turned On', timestamp: '2025-04-11 08:30:15', type: 'lighting', status: 'success' },
  { id: 2, device: 'Kitchen Diffuser', action: 'Refill Needed', timestamp: '2025-04-11 07:45:22', type: 'aromatics', status: 'warning' },
  { id: 3, device: 'Bedroom AC', action: 'Temperature Change (22°C)', timestamp: '2025-04-11 06:15:10', type: 'climate', status: 'success' },
  { id: 4, device: 'Office Blinds', action: 'Closed', timestamp: '2025-04-10 19:30:05', type: 'blinds', status: 'success' },
  { id: 5, device: 'Bathroom Heater', action: 'Error: Disconnected', timestamp: '2025-04-10 18:20:12', type: 'climate', status: 'error' },
  { id: 6, device: 'Dining Room Light', action: 'Brightness Changed (70%)', timestamp: '2025-04-10 17:45:33', type: 'lighting', status: 'success' },
  { id: 7, device: 'Living Room Diffuser', action: 'Scent Changed', timestamp: '2025-04-10 15:10:45', type: 'aromatics', status: 'success' },
  { id: 8, device: 'Master Bedroom Blinds', action: 'Scheduled Open', timestamp: '2025-04-10 07:00:00', type: 'blinds', status: 'success' },
];

// Mock data for system logs
const systemLogs = [
  { id: 1, message: 'System update available', timestamp: '2025-04-11 09:00:00', level: 'info' },
  { id: 2, message: 'Network connection lost', timestamp: '2025-04-10 23:15:10', level: 'error' },
  { id: 3, message: 'Backup completed successfully', timestamp: '2025-04-10 22:00:00', level: 'success' },
  { id: 4, message: 'New device detected', timestamp: '2025-04-10 17:30:25', level: 'info' },
  { id: 5, message: 'Low battery on Office Blinds controller', timestamp: '2025-04-10 14:45:12', level: 'warning' },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'lighting':
      return <LampFloor className="h-4 w-4" />;
    case 'climate':
      return <Thermometer className="h-4 w-4" />;
    case 'blinds':
      return <Blinds className="h-4 w-4" />;
    case 'aromatics':
      return <Droplets className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>;
    case 'warning':
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
    case 'error':
      return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Error</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const Logs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-mono">System Logs</h2>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search logs..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="activity">
          <TabsList className="mb-4">
            <TabsTrigger value="activity">Device Activity</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Device Activity Log</CardTitle>
                  
                  <div className="flex flex-wrap gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="lighting">Lighting</SelectItem>
                        <SelectItem value="climate">Climate</SelectItem>
                        <SelectItem value="blinds">Blinds</SelectItem>
                        <SelectItem value="aromatics">Aromatics</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Device</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Action</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLogs.map((log) => (
                          <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{log.timestamp}</td>
                            <td className="p-4 align-middle font-medium">{log.device}</td>
                            <td className="p-4 align-middle">{log.action}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                {getDeviceIcon(log.type)}
                                <span className="capitalize">{log.type}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {getStatusBadge(log.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Event Log</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Level</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemLogs.map((log) => (
                          <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{log.timestamp}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                {getLevelIcon(log.level)}
                                <span className="capitalize">{log.level}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle font-medium">{log.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Logs;
