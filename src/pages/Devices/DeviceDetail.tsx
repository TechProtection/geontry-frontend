/**
 * Página de detalle de dispositivo
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useDevice, useDeleteDevice } from '../../hooks/useDevices';
import { useSensorsByDevice } from '../../hooks/useSensors';
import { useProximityEventsByDevice } from '../../hooks/useProximityEvents';

/**
 * Página de detalle de dispositivo
 */
const DeviceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: device, isLoading, error } = useDevice(id || '');
  const { data: sensors, isLoading: sensorsLoading } = useSensorsByDevice(id || '');
  const { data: events, isLoading: eventsLoading } = useProximityEventsByDevice(id || '');
  const deleteDevice = useDeleteDevice();

  const handleEdit = () => {
    navigate(`/devices/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Está seguro de eliminar el dispositivo "${device?.name}"?`)) {
      try {
        await deleteDevice.mutateAsync(id || '');
        navigate('/devices');
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      smart_lock: 'Cerradura Inteligente',
      light: 'Luz',
      thermostat: 'Termostato',
      camera: 'Cámara',
      sensor: 'Sensor',
      other: 'Otro',
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/devices')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dispositivo no encontrado</h1>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'El dispositivo solicitado no existe o no se puede cargar.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/devices')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">
              {getTypeLabel(device.type)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteDevice.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteDevice.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p className="font-medium">{device.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <p className="font-medium">{getTypeLabel(device.type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                <p className="font-medium">{device.profile?.full_name || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant={device.is_active ? 'default' : 'secondary'}>
                  {device.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Creado</p>
                <p className="font-medium">{new Date(device.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actualizado</p>
                <p className="font-medium">{new Date(device.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensores asociados */}
        <Card>
          <CardHeader>
            <CardTitle>Sensores Asociados</CardTitle>
          </CardHeader>
          <CardContent>
            {sensorsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : sensors && sensors.length > 0 ? (
              <div className="space-y-2">
                {sensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{sensor.name}</p>
                      <p className="text-sm text-muted-foreground">{sensor.type}</p>
                    </div>
                    <Badge variant={sensor.is_active ? 'default' : 'secondary'}>
                      {sensor.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay sensores asociados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Eventos recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : events && events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`h-3 w-3 rounded-full ${
                    event.type === 'enter' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">
                      {event.user?.full_name || 'Usuario'} {event.type === 'enter' ? 'entró a' : 'salió de'} {event.home_location_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {events.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  Y {events.length - 5} eventos más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay eventos recientes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDetail;
