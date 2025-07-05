/**
 * Formulario para crear/editar dispositivos
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useDevice, useCreateDevice, useUpdateDevice } from '../../hooks/useDevices';
import { useProfiles } from '../../hooks/useProfiles';
import { Device } from '../../types/api';

const deviceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['smart_lock', 'light', 'thermostat', 'camera', 'sensor', 'other']),
  profile_id: z.string().min(1, 'El usuario es requerido'),
  is_active: z.boolean().default(true),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

/**
 * Página de formulario de dispositivos
 */
const DeviceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { data: device, isLoading: deviceLoading } = useDevice(id || '');
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice(id || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '',
      type: 'other',
      profile_id: '',
      is_active: true,
    },
  });

  // Cargar datos del dispositivo si estamos editando
  React.useEffect(() => {
    if (device) {
      setValue('name', device.name);
      setValue('type', device.type);
      setValue('profile_id', device.profile_id);
      setValue('is_active', device.is_active);
    }
  }, [device, setValue]);

  const onSubmit = async (data: DeviceFormData) => {
    try {
      if (isEditing) {
        await updateDevice.mutateAsync({
          name: data.name,
          type: data.type,
          is_active: data.is_active,
        });
      } else {
        await createDevice.mutateAsync({
          name: data.name,
          type: data.type,
          profile_id: data.profile_id,
        });
      }
      navigate('/devices');
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  const typeOptions = [
    { value: 'smart_lock', label: 'Cerradura Inteligente' },
    { value: 'light', label: 'Luz' },
    { value: 'thermostat', label: 'Termostato' },
    { value: 'camera', label: 'Cámara' },
    { value: 'sensor', label: 'Sensor' },
    { value: 'other', label: 'Otro' },
  ];

  if (deviceLoading || profilesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Dispositivo' : 'Crear Dispositivo'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifica los datos del dispositivo' : 'Añade un nuevo dispositivo al sistema'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Dispositivo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ej: Luz de la sala"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(value) => setValue('type', value as Device['type'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_id">Usuario</Label>
                <Select
                  value={watch('profile_id')}
                  onValueChange={(value) => setValue('profile_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles?.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.profile_id && (
                  <p className="text-sm text-red-500">{errors.profile_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Estado</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                  <Label htmlFor="is_active">
                    {watch('is_active') ? 'Activo' : 'Inactivo'}
                  </Label>
                </div>
              </div>
            </div>

            {(createDevice.error || updateDevice.error) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {createDevice.error?.message || updateDevice.error?.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/devices')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createDevice.isPending || updateDevice.isPending}
              >
                {createDevice.isPending || updateDevice.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceForm;
