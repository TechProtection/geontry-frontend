/**
 * Formulario de sensor
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { useCreateSensor, useUpdateSensor, useSensor } from '@/hooks/useSensors';
import { useDevices } from '@/hooks/useDevices';
import { useProfiles } from '@/hooks/useProfiles';

const sensorSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre es muy largo'),
  type: z.enum(['proximity', 'temperature', 'motion', 'light', 'other'], {
    required_error: 'El tipo es obligatorio',
  }),
  device_id: z.string().min(1, 'El dispositivo es obligatorio'),
  profile_id: z.string().min(1, 'El perfil es obligatorio'),
  is_active: z.boolean().default(true),
});

type SensorFormData = z.infer<typeof sensorSchema>;

const SensorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: sensor, isLoading: sensorLoading } = useSensor(id || '');
  const { data: devices } = useDevices();
  const { data: profiles } = useProfiles();

  const createMutation = useCreateSensor();
  const updateMutation = useUpdateSensor();

  const form = useForm<SensorFormData>({
    resolver: zodResolver(sensorSchema),
    defaultValues: {
      name: '',
      type: 'proximity',
      device_id: '',
      profile_id: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (sensor && isEdit) {
      form.reset({
        name: sensor.name,
        type: sensor.type,
        device_id: sensor.device_id,
        profile_id: sensor.profile_id,
        is_active: sensor.is_active,
      });
    }
  }, [sensor, isEdit, form]);

  const onSubmit = async (data: SensorFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...data });
        toast.success('Sensor actualizado exitosamente');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Sensor creado exitosamente');
      }
      navigate('/sensors');
    } catch (error) {
      toast.error(isEdit ? 'Error al actualizar el sensor' : 'Error al crear el sensor');
    }
  };

  if (sensorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Editar Sensor' : 'Nuevo Sensor'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Actualizar información del sensor' : 'Agregar nuevo sensor al sistema'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sensor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del sensor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="proximity">Proximidad</SelectItem>
                          <SelectItem value="temperature">Temperatura</SelectItem>
                          <SelectItem value="motion">Movimiento</SelectItem>
                          <SelectItem value="light">Luz</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="device_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispositivo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el dispositivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devices?.map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profile_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {profiles?.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sensor activo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Indica si el sensor está funcionando
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/sensors')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorForm;
