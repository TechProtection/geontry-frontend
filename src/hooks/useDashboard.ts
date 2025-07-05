/**
 * Hook para datos del dashboard usando la API real
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Actualizar cada minuto
  });
};
