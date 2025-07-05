/**
 * Hooks para gestión de dispositivos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listDevices,
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  getDevicesByProfile,
} from '../api/devices';
import { Device } from '../types/api';

/**
 * Hook para obtener lista de dispositivos
 */
export const useDevices = () => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: listDevices,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un dispositivo específico
 */
export const useDevice = (id: string) => {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => getDevice(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener dispositivos por perfil
 */
export const useDevicesByProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['devices', 'profile', profileId],
    queryFn: () => getDevicesByProfile(profileId),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para crear un nuevo dispositivo
 */
export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDevice,
    onSuccess: (newDevice) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ 
        queryKey: ['devices', 'profile', newDevice.profile_id] 
      });
      toast.success('Dispositivo creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el dispositivo');
      console.error('Error creating device:', error);
    },
  });
};

/**
 * Hook para actualizar un dispositivo existente
 */
export const useUpdateDevice = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateDevice>[1]) => 
      updateDevice(id, data),
    onSuccess: (updatedDevice) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', id] });
      queryClient.invalidateQueries({ 
        queryKey: ['devices', 'profile', updatedDevice.profile_id] 
      });
      toast.success('Dispositivo actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el dispositivo');
      console.error('Error updating device:', error);
    },
  });
};

/**
 * Hook para eliminar un dispositivo
 */
export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: (_, deviceId) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.removeQueries({ queryKey: ['device', deviceId] });
      toast.success('Dispositivo eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el dispositivo');
      console.error('Error deleting device:', error);
    },
  });
};
