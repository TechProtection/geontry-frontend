/**
 * Hooks para gestión de eventos de proximidad usando la API real
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ProximityEvent } from '@/types';

export const useProximityEvents = () => {
  return useQuery({
    queryKey: ['proximity-events'],
    queryFn: () => apiClient.getProximityEvents(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useProximityEvent = (id: string) => {
  return useQuery({
    queryKey: ['proximity-event', id],
    queryFn: () => apiClient.getProximityEventById(id),
    enabled: !!id,
  });
};

export const useProximityEventsByDevice = (deviceId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'device', deviceId],
    queryFn: () => apiClient.getProximityEventsByDevice(deviceId),
    enabled: !!deviceId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useProximityEventsByLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['proximity-events', 'location', locationId],
    queryFn: () => apiClient.getProximityEventsByLocation(locationId),
    enabled: !!locationId,
    staleTime: 1 * 60 * 1000, // 1 minute
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
