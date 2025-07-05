/**
 * Detalle de sensor
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Cpu, User, Smartphone } from 'lucide-react';
import { useSensor, useDeleteSensor } from '@/hooks/useSensors';
import { toast } from 'sonner';

const SensorDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: sensor, isLoading, error } = useSensor(id || '');
  const deleteMutation = useDeleteSensor();

  const handleDelete = async () => {
    if (!id || !sensor) return;
    
    if (window.confirm('¿Está seguro que desea eliminar este sensor?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Sensor eliminado exitosamente');
        navigate('/sensors');
      } catch (error) {
        toast.error('Error al eliminar el sensor');
      }
    }
  };

  const getSensorTypeLabel = (type: string) => {
    const types = {
      proximity: 'Proximidad',
      temperature: 'Temperatura',
      motion: 'Movimiento',
      light: 'Luz',
      other: 'Otro',
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !sensor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/sensors')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sensor no encontrado</h1>
            <p className="text-muted-foreground">
              El sensor que está buscando no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/sensors')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{sensor.name}</h1>
            <p className="text-muted-foreground">
              Información detallada del sensor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/sensors/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Información del Sensor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-base">{sensor.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className="text-base">{getSensorTypeLabel(sensor.type)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <div className="mt-1">
                  <Badge variant={sensor.is_active ? 'default' : 'secondary'}>
                    {sensor.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asociaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sensor.device && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Dispositivo</h4>
                      <p className="text-sm text-muted-foreground">{sensor.device.name}</p>
                    </div>
                  </div>
                  <Badge variant={sensor.device.is_active ? 'default' : 'secondary'}>
                    {sensor.device.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              )}

              {sensor.profile && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Perfil</h4>
                      <p className="text-sm text-muted-foreground">{sensor.profile.full_name}</p>
                    </div>
                  </div>
                  <Badge variant={sensor.profile.is_active ? 'default' : 'secondary'}>
                    {sensor.profile.is_active ? 'Activo' : 'Inactivo'}
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
                <p className="text-base font-mono">{sensor.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Creado</label>
                <p className="text-base">
                  {new Date(sensor.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Actualizado</label>
                <p className="text-base">
                  {new Date(sensor.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
                <label className="text-sm font-medium text-muted-foreground">Device ID</label>
                <p className="text-base font-mono text-xs">{sensor.device_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Profile ID</label>
                <p className="text-base font-mono text-xs">{sensor.profile_id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensorDetail;
