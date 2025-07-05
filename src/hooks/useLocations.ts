/**
 * Hooks para gestión de ubicaciones usando la API real
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Location, CreateLocationRequest, UpdateLocationRequest } from '@/types';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => apiClient.getLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => apiClient.getLocationById(id),
    enabled: !!id,
  });
};

export const useLocationStats = (id: string) => {
  return useQuery({
    queryKey: ['location-stats', id],
    queryFn: () => apiClient.getLocationStats(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    onError: (error) => {
      toast.error('Error al crear la ubicación');
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

/**
 * Hook para crear una nueva ubicación
 */
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', 'active'] });
      toast.success('Ubicación creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la ubicación');
      console.error('Error creating location:', error);
    },
  });
};

/**
 * Hook para actualizar una ubicación existente
 */
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateLocation>[1]) => 
      updateLocation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', id] });
      queryClient.invalidateQueries({ queryKey: ['locations', 'active'] });
      toast.success('Ubicación actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la ubicación');
      console.error('Error updating location:', error);
    },
  });
};

/**
 * Hook para eliminar una ubicación
 */
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_, locationId) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.removeQueries({ queryKey: ['location', locationId] });
      queryClient.invalidateQueries({ queryKey: ['locations', 'active'] });
      toast.success('Ubicación eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la ubicación');
      console.error('Error deleting location:', error);
    },
  });
};
