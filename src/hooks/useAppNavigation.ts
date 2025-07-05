/**
 * Hook personalizado para navegación optimizada de la aplicación
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const navigateToPage = useCallback((path: string, options?: { replace?: boolean }) => {
    // Pre-cargar datos comunes si es necesario
    if (path === '/locations') {
      queryClient.prefetchQuery({
        queryKey: ['locations'],
        staleTime: 30 * 1000,
      });
    } else if (path === '/devices') {
      queryClient.prefetchQuery({
        queryKey: ['devices'],
        staleTime: 30 * 1000,
      });
    } else if (path === '/events') {
      queryClient.prefetchQuery({
        queryKey: ['proximity-events'],
        staleTime: 30 * 1000,
      });
    }

    // Navegar con un pequeño delay para permitir que los estados se estabilicen
    setTimeout(() => {
      navigate(path, options);
    }, 50);
  }, [navigate, queryClient]);

  const goToDashboard = useCallback(() => {
    navigateToPage('/dashboard');
  }, [navigateToPage]);

  const goToLocations = useCallback(() => {
    navigateToPage('/locations');
  }, [navigateToPage]);

  const goToDevices = useCallback(() => {
    navigateToPage('/devices');
  }, [navigateToPage]);

  const goToEvents = useCallback(() => {
    navigateToPage('/events');
  }, [navigateToPage]);

  const goToSettings = useCallback(() => {
    navigateToPage('/settings');
  }, [navigateToPage]);

  return {
    navigateToPage,
    goToDashboard,
    goToLocations,
    goToDevices,
    goToEvents,
    goToSettings,
  };
};
