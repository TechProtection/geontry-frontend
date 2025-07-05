/**
 * Página de gestión de dispositivos
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Search, Plus, Edit, Trash2, Activity, MapPin, User, Calendar } from 'lucide-react';
import { useDevicesSimple } from '@/hooks/useDevicesSimple';
import { useLocationsSimple } from '@/hooks/useLocationsSimple';
import { useProximityEventsSimple } from '@/hooks/useProximityEventsSimple';
import { Device } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DevicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  
  const { data: devices, isLoading: devicesLoading } = useDevicesSimple();
  const { data: locations } = useLocationsSimple();
  const { data: events } = useProximityEventsSimple();

  const filteredDevices = devices?.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getDeviceStatus = (device: Device) => {
    const deviceEvents = events?.filter(event => event.device_id === device.id) || [];
    const lastEvent = deviceEvents[0];
    
    if (!lastEvent) return { status: 'inactive', location: null, lastSeen: null };
    
    const isCurrentlyInside = lastEvent.type === 'enter';
    const currentLocation = isCurrentlyInside ? lastEvent.home_location_name : null;
    
    return {
      status: isCurrentlyInside ? 'active' : 'outside',
      location: currentLocation,
      lastSeen: lastEvent.created_at
    };
  };

  const getDeviceStats = (device: Device) => {
    const deviceEvents = events?.filter(event => event.device_id === device.id) || [];
    const last24Hours = deviceEvents.filter(event => {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      return now.getTime() - eventDate.getTime() < 24 * 60 * 60 * 1000;
    });
    
    return {
      totalEvents: deviceEvents.length,
      eventsToday: last24Hours.length,
      locationsVisited: [...new Set(deviceEvents.map(e => e.home_location_name))].length
    };
  };

  if (devicesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dispositivos</h1>
            <p className="text-muted-foreground">
              Gestiona y monitorea todos los dispositivos del sistema
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Cargando dispositivos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dispositivos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todos los dispositivos registrados en el sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dispositivo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dispositivos</p>
                <p className="text-2xl font-bold">{devices?.length || 0}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dispositivos Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredDevices.filter(d => getDeviceStatus(d).status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fuera de Zona</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredDevices.filter(d => getDeviceStatus(d).status === 'outside').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sin Actividad</p>
                <p className="text-2xl font-bold text-gray-600">
                  {filteredDevices.filter(d => getDeviceStatus(d).status === 'inactive').length}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar dispositivos por nombre, tipo o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Devices List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDevices.map((device) => {
          const status = getDeviceStatus(device);
          const stats = getDeviceStats(device);
          
          return (
            <Card key={device.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    {device.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status.status === 'active' ? 'default' : 
                              status.status === 'outside' ? 'secondary' : 'outline'}
                    >
                      {status.status === 'active' ? 'Activo' : 
                       status.status === 'outside' ? 'Fuera de Zona' : 'Sin Actividad'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tipo:</span>
                      <span>{device.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Usuario:</span>
                      <span>{device.profile?.full_name || 'N/A'}</span>
                    </div>
                  </div>

                  {status.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Ubicación actual:</span>
                      <span className="text-green-600">{status.location}</span>
                    </div>
                  )}

                  {status.lastSeen && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Última actividad:</span>
                      <span>{format(new Date(status.lastSeen), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Email: {device.profile?.email || 'N/A'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{stats.totalEvents}</p>
                      <p className="text-xs text-muted-foreground">Total Eventos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{stats.eventsToday}</p>
                      <p className="text-xs text-muted-foreground">Hoy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600">{stats.locationsVisited}</p>
                      <p className="text-xs text-muted-foreground">Ubicaciones</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'No se encontraron dispositivos' : 'No hay dispositivos registrados'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Agrega tu primer dispositivo para comenzar a monitorear'
              }
            </p>
            {!searchTerm && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dispositivo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DevicesPage;
