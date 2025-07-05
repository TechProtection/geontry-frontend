/**
 * Hooks para gestión de sensores
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listSensors,
  createSensor,
  getSensor,
  updateSensor,
  deleteSensor,
  getSensorsByDevice,
  getSensorsByProfile,
} from '../api/sensors';

/**
 * Hook para obtener lista de sensores
 */
export const useSensors = () => {
  return useQuery({
    queryKey: ['sensors'],
    queryFn: listSensors,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un sensor específico
 */
export const useSensor = (id: string) => {
  return useQuery({
    queryKey: ['sensor', id],
    queryFn: () => getSensor(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener sensores por dispositivo
 */
export const useSensorsByDevice = (deviceId: string) => {
  return useQuery({
    queryKey: ['sensors', 'device', deviceId],
    queryFn: () => getSensorsByDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener sensores por perfil
 */
export const useSensorsByProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['sensors', 'profile', profileId],
    queryFn: () => getSensorsByProfile(profileId),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para crear un nuevo sensor
 */
export const useCreateSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSensor,
    onSuccess: (newSensor) => {
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.invalidateQueries({ 
        queryKey: ['sensors', 'device', newSensor.device_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['sensors', 'profile', newSensor.profile_id] 
      });
      toast.success('Sensor creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el sensor');
      console.error('Error creating sensor:', error);
    },
  });
};

/**
 * Hook para actualizar un sensor existente
 */
export const useUpdateSensor = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateSensor>[1]) => 
      updateSensor(id, data),
    onSuccess: (updatedSensor) => {
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.invalidateQueries({ queryKey: ['sensor', id] });
      queryClient.invalidateQueries({ 
        queryKey: ['sensors', 'device', updatedSensor.device_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['sensors', 'profile', updatedSensor.profile_id] 
      });
      toast.success('Sensor actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el sensor');
      console.error('Error updating sensor:', error);
    },
  });
};

/**
 * Hook para eliminar un sensor
 */
export const useDeleteSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSensor,
    onSuccess: (_, sensorId) => {
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.removeQueries({ queryKey: ['sensor', sensorId] });
      toast.success('Sensor eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el sensor');
      console.error('Error deleting sensor:', error);
    },
  });
};
