/**
 * Detalle de evento de proximidad
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, User, Smartphone, Calendar, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { useProximityEvent } from '@/hooks/useProximityEvents';

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: event, isLoading, error } = useProximityEvent(id || '');

  const getEventTypeInfo = (type: string) => {
    if (type === 'enter') {
      return {
        label: 'Entrada',
        icon: ArrowRight,
        variant: 'default' as const,
        color: 'text-green-600',
      };
    } else {
      return {
        label: 'Salida',
        icon: ArrowLeftIcon,
        variant: 'secondary' as const,
        color: 'text-red-600',
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/proximity-events')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Evento no encontrado</h1>
            <p className="text-muted-foreground">
              El evento que está buscando no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const eventInfo = getEventTypeInfo(event.type);
  const EventIcon = eventInfo.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/proximity-events')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evento de Proximidad</h1>
          <p className="text-muted-foreground">
            Información detallada del evento
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EventIcon className={`h-5 w-5 ${eventInfo.color}`} />
                Información del Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <div className="mt-1">
                    <Badge variant={eventInfo.variant} className="flex items-center gap-1 w-fit">
                      <EventIcon className="h-3 w-3" />
                      {eventInfo.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha y Hora</label>
                  <p className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.created_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                <div className="mt-1">
                  <p className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.home_location_name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entidades Relacionadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.user && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Usuario</h4>
                      <p className="text-sm text-muted-foreground">{event.user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{event.user.email}</p>
                    </div>
                  </div>
                  <Badge variant={event.user.is_active ? 'default' : 'secondary'}>
                    {event.user.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              )}

              {event.device && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Dispositivo</h4>
                      <p className="text-sm text-muted-foreground">{event.device.name}</p>
                      <p className="text-xs text-muted-foreground">{event.device.type}</p>
                    </div>
                  </div>
                  <Badge variant={event.device.is_active ? 'default' : 'secondary'}>
                    {event.device.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              )}

              {event.location && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Ubicación</h4>
                      <p className="text-sm text-muted-foreground">{event.location.name}</p>
                      {event.location.address && (
                        <p className="text-xs text-muted-foreground">{event.location.address}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={event.location.is_active ? 'default' : 'secondary'}>
                    {event.location.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="text-base font-mono">{event.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <p className="text-base">
                  {new Date(event.created_at).toISOString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identificadores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-base font-mono text-xs">{event.user_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Device ID</label>
                <p className="text-base font-mono text-xs">{event.device_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location ID</label>
                <p className="text-base font-mono text-xs">{event.location_id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
