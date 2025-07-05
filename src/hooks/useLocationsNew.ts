/**
 * Hooks para gestión de ubicaciones usando la API real - Versión optimizada
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '@/types';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => apiClient.getLocations(),
    staleTime: 30 * 1000, // 30 segundos
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => apiClient.getLocationById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useLocationStats = (id: string) => {
  return useQuery({
    queryKey: ['location-stats', id],
    queryFn: () => apiClient.getLocationStats(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (location: CreateLocationRequest) => 
      apiClient.createLocation(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la ubicación');
      console.error('Error creating location:', error);
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (location: UpdateLocationRequest) => 
      apiClient.updateLocation(location),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      toast.success('Ubicación actualizada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar la ubicación');
      console.error('Error updating location:', error);
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Ubicación eliminada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar la ubicación');
      console.error('Error deleting location:', error);
    },
  });
};
