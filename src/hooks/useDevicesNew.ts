/**
 * Hooks para gestión de dispositivos usando la API real
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { Device, CreateDeviceRequest, UpdateDeviceRequest } from '@/types';

export const useDevices = () => {
  return useQuery({
    queryKey: ['devices'],
    queryFn: () => apiClient.getDevices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDevice = (id: string) => {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => apiClient.getDeviceById(id),
    enabled: !!id,
  });
};

export const useDeviceStats = (id: string) => {
  return useQuery({
    queryKey: ['device-stats', id],
    queryFn: () => apiClient.getDeviceStats(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (device: CreateDeviceRequest) => 
      apiClient.createDevice(device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Dispositivo creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el dispositivo');
      console.error('Error creating device:', error);
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (device: UpdateDeviceRequest) => 
      apiClient.updateDevice(device),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.id] });
      toast.success('Dispositivo actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el dispositivo');
      console.error('Error updating device:', error);
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Dispositivo eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el dispositivo');
      console.error('Error deleting device:', error);
    },
  });
};
