/**
 * Dashboard principal profesional para GeoEntry
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import MapView from '@/components/MapView';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { useDashboardStats, useHealthCheck } from '@/hooks/useDashboard';
import { useProximityEvents } from '@/hooks/useProximityEventsNew';
import { useLocations } from '@/hooks/useLocationsNew';
import { useDevices } from '@/hooks/useDevicesNew';
import { 
  RefreshCw, 
  MapPin, 
  BarChart3, 
  Activity, 
  Home,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Users,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: dashboardStats, refetch: refetchStats } = useDashboardStats();
  const { data: healthCheck } = useHealthCheck();
  const { data: events, refetch: refetchEvents } = useProximityEvents();
  const { data: locations, refetch: refetchLocations } = useLocations();
  const { data: devices, refetch: refetchDevices } = useDevices();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchEvents(),
        refetchLocations(),
        refetchDevices(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const recentEvents = events?.slice(0, 10) || [];
  const todayEvents = events?.filter(event => {
    const eventDate = new Date(event.created_at);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }) || [];

  const getEventIcon = (type: string) => {
    return type === 'enter' ? (
      <div className="w-2 h-2 bg-green-500 rounded-full" />
    ) : (
      <div className="w-2 h-2 bg-red-500 rounded-full" />
    );
  };

  const getEventColor = (type: string) => {
    return type === 'enter' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoreo y análisis de ubicaciones en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          {healthCheck && (
            <Badge variant={healthCheck.status === 'OK' ? 'default' : 'destructive'}>
              {healthCheck.status === 'OK' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {healthCheck.status}
            </Badge>
          )}
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Pestañas principales */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Actividad
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Resumen */}
        <TabsContent value="overview" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Ubicaciones</p>
                    <p className="text-2xl font-bold">{dashboardStats?.totalLocations || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-full">
                    <Smartphone className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Dispositivos</p>
                    <p className="text-2xl font-bold">{dashboardStats?.totalDevices || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Eventos Total</p>
                    <p className="text-2xl font-bold">{dashboardStats?.totalEvents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-50 rounded-full">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Eventos Hoy</p>
                    <p className="text-2xl font-bold">{todayEvents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ubicaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Ubicaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {locations?.map((location) => {
                      const locationEvents = events?.filter(e => e.home_location_id === location.id) || [];
                      const lastEvent = locationEvents[0];
                      const isOccupied = lastEvent?.type === 'enter';
                      
                      return (
                        <div key={location.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isOccupied ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Radio: {location.radius}m
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={isOccupied ? "default" : "secondary"}>
                              {isOccupied ? "Ocupado" : "Libre"}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {locationEvents.length} eventos
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Dispositivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {devices?.map((device) => {
                      const deviceEvents = events?.filter(e => e.device_id === device.id) || [];
                      const lastEvent = deviceEvents[0];
                      const isActive = lastEvent ? 
                        new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000 : false;
                      
                      return (
                        <div key={device.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <div>
                              <p className="font-medium">{device.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {device.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={isActive ? "default" : "secondary"}>
                              {isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {deviceEvents.length} eventos
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña Mapa */}
        <TabsContent value="map">
          <MapView />
        </TabsContent>

        {/* Pestaña Analíticas */}
        <TabsContent value="analytics">
          <AdvancedAnalytics />
        </TabsContent>

        {/* Pestaña Actividad */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <div className="flex flex-col">
                          <span className={`font-medium ${getEventColor(event.type)}`}>
                            {event.type === 'enter' ? 'Entrada' : 'Salida'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {event.home_location_name}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{event.device?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.user?.full_name}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm">
                          {format(new Date(event.created_at), 'HH:mm', { locale: es })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.created_at), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
