/**
 * Hook simplificado para dashboard sin caché complejo
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocationsSimple } from './useLocationsSimple';
import { useDevicesSimple } from './useDevicesSimple';
import { useProximityEventsSimple } from './useProximityEventsSimple';

interface DashboardStats {
  totalLocations: number;
  activeLocations: number;
  totalDevices: number;
  activeDevices: number;
  totalEvents: number;
  todayEvents: number;
  occupiedLocations: number;
}

interface UseDashboardSimpleReturn {
  stats: DashboardStats;
  locations: any[];
  devices: any[];
  events: any[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardSimple = (): UseDashboardSimpleReturn => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { 
    data: locations, 
    isLoading: locationsLoading, 
    error: locationsError, 
    refetch: refetchLocations 
  } = useLocationsSimple();
  
  const { 
    data: devices, 
    isLoading: devicesLoading, 
    error: devicesError, 
    refetch: refetchDevices 
  } = useDevicesSimple();
  
  const { 
    data: events, 
    isLoading: eventsLoading, 
    error: eventsError, 
    refetch: refetchEvents 
  } = useProximityEventsSimple();

  const isLoading = locationsLoading || devicesLoading || eventsLoading;

  const stats = useMemo((): DashboardStats => {
    const activeLocations = locations?.filter(l => l.is_active).length || 0;
    const activeDevices = devices?.length || 0; // Asumir que todos están activos por ahora
    
    // Eventos de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEvents = events?.filter(event => {
      const eventDate = new Date(event.created_at);
      return eventDate >= today;
    }).length || 0;

    // Ubicaciones ocupadas (último evento fue 'enter')
    const occupiedLocations = locations?.filter(location => {
      const locationEvents = events?.filter(e => e.home_location_id === location.id) || [];
      const lastEvent = locationEvents.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      return lastEvent?.type === 'enter';
    }).length || 0;

    return {
      totalLocations: locations?.length || 0,
      activeLocations,
      totalDevices: devices?.length || 0,
      activeDevices,
      totalEvents: events?.length || 0,
      todayEvents,
      occupiedLocations
    };
  }, [locations, devices, events]);

  const refetch = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([
        refetchLocations(),
        refetchDevices(),
        refetchEvents()
      ]);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar datos del dashboard');
    }
  }, [refetchLocations, refetchDevices, refetchEvents]);

  // Combinar errores
  useEffect(() => {
    const combinedError = locationsError || devicesError || eventsError;
    if (combinedError) {
      setError(combinedError);
    } else {
      setError(null);
    }
  }, [locationsError, devicesError, eventsError]);

  return {
    stats,
    locations: locations || [],
    devices: devices || [],
    events: events || [],
    isLoading,
    error,
    refetch
  };
};
