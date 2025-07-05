/**
 * Página de gestión de ubicaciones
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocations } from '@/hooks/useLocationsNew';
import { useProximityEvents } from '@/hooks/useProximityEventsNew';
import { MapPin, Home, Activity, Clock, Plus, Edit, Trash2, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LocationsPage: React.FC = () => {
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: events } = useProximityEvents();

  const getLocationStats = (locationId: string) => {
    const locationEvents = events?.filter(e => e.home_location_id === locationId) || [];
    const recentEvents = locationEvents.filter(event => {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      return now.getTime() - eventDate.getTime() < 24 * 60 * 60 * 1000;
    });
    
    const lastEvent = locationEvents[0];
    const isCurrentlyOccupied = lastEvent?.type === 'enter';
    
    return {
      totalEvents: locationEvents.length,
      recentEvents: recentEvents.length,
      isCurrentlyOccupied,
      lastActivity: lastEvent?.created_at,
    };
  };

  if (locationsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ubicaciones</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ubicaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones monitoreadas por el sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ubicación
        </Button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-full">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Ubicaciones</p>
                <p className="text-2xl font-bold">{locations?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-full">
                <Home className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ubicaciones Activas</p>
                <p className="text-2xl font-bold">
                  {locations?.filter(l => l.is_active).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-full">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Con Actividad</p>
                <p className="text-2xl font-bold">
                  {locations?.filter(l => {
                    const stats = getLocationStats(l.id);
                    return stats.totalEvents > 0;
                  }).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-full">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ocupadas Ahora</p>
                <p className="text-2xl font-bold">
                  {locations?.filter(l => {
                    const stats = getLocationStats(l.id);
                    return stats.isCurrentlyOccupied;
                  }).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de ubicaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {locations?.map((location) => {
                const stats = getLocationStats(location.id);
                return (
                  <div key={location.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-50 rounded-full">
                            <Home className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{location.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Radio: {location.radius}m
                            </p>
                          </div>
                        </div>

                        {location.address && (
                          <div className="flex items-center gap-2 mb-3">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Estado</p>
                            <Badge variant={location.is_active ? "default" : "secondary"}>
                              {location.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Ocupación</p>
                            <Badge variant={stats.isCurrentlyOccupied ? "default" : "outline"}>
                              {stats.isCurrentlyOccupied ? "Ocupado" : "Libre"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Eventos Totales</p>
                            <p className="font-semibold">{stats.totalEvents}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Eventos (24h)</p>
                            <p className="font-semibold">{stats.recentEvents}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                          {stats.lastActivity && (
                            <span>
                              Última actividad: {format(new Date(stats.lastActivity), 'dd/MM/yyyy HH:mm', { locale: es })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsPage;
