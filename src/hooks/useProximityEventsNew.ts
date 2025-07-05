/**
 * Hooks para gestión de eventos de proximidad usando la API real - Versión optimizada
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ProximityEvent } from '@/types';

export const useProximityEvents = () => {
  return useQuery({
    queryKey: ['proximity-events'],
    queryFn: () => apiClient.getProximityEvents(),
    staleTime: 30 * 1000, // 30 segundos
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useProximityEvent = (id: string) => {
  return useQuery({
    queryKey: ['proximity-event', id],
    queryFn: () => apiClient.getProximityEventById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useProximityEventsByDevice = (deviceId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'device', deviceId],
    queryFn: () => apiClient.getProximityEventsByDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useProximityEventsByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'location', locationId],
    queryFn: () => apiClient.getProximityEventsByLocation(locationId),
    enabled: !!locationId,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useProximityEventsByUser = (userId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'user', userId],
    queryFn: () => apiClient.getProximityEventsByUser(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
