/**
 * Hooks para gestión de eventos de proximidad
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listProximityEvents,
  createProximityEvent,
  getProximityEvent,
  getProximityEventsByUser,
  getProximityEventsByDevice,
  getProximityEventsByLocation,
  getProximityEventsByType,
  getProximityEventsByDateRange,
} from '../api/proximityEvents';
import { ProximityEvent } from '../types/api';

/**
 * Hook para obtener lista de eventos de proximidad
 */
export const useProximityEvents = () => {
  return useQuery({
    queryKey: ['proximity-events'],
    queryFn: listProximityEvents,
    staleTime: 2 * 60 * 1000, // 2 minutos (datos más dinámicos)
  });
};

/**
 * Hook para obtener un evento de proximidad específico
 */
export const useProximityEvent = (id: string) => {
  return useQuery({
    queryKey: ['proximity-event', id],
    queryFn: () => getProximityEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener eventos de proximidad por usuario
 */
export const useProximityEventsByUser = (userId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'user', userId],
    queryFn: () => getProximityEventsByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener eventos de proximidad por dispositivo
 */
export const useProximityEventsByDevice = (deviceId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'device', deviceId],
    queryFn: () => getProximityEventsByDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener eventos de proximidad por ubicación
 */
export const useProximityEventsByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'location', locationId],
    queryFn: () => getProximityEventsByLocation(locationId),
    enabled: !!locationId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener eventos de proximidad por tipo
 */
export const useProximityEventsByType = (type: ProximityEvent['type']) => {
  return useQuery({
    queryKey: ['proximity-events', 'type', type],
    queryFn: () => getProximityEventsByType(type),
    enabled: !!type,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener eventos de proximidad por rango de fechas
 */
export const useProximityEventsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'date-range', startDate, endDate],
    queryFn: () => getProximityEventsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para crear un nuevo evento de proximidad
 */
export const useCreateProximityEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProximityEvent,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['proximity-events'] });
      queryClient.invalidateQueries({ 
        queryKey: ['proximity-events', 'user', newEvent.user_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['proximity-events', 'device', newEvent.device_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['proximity-events', 'location', newEvent.location_id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['proximity-events', 'type', newEvent.type] 
      });
      toast.success('Evento de proximidad registrado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el evento de proximidad');
      console.error('Error creating proximity event:', error);
    },
  });
};
