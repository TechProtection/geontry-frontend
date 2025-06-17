import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDevicesData, useLocationsData, useCacheInvalidation } from '@/hooks/use-data';
import type { Device, Location } from '@/integrations/supabase/types';

interface DataContextType {
  // Devices
  devices: Device[];
  devicesLoading: boolean;
  devicesError: string | null;
  devicesLastFetch: number | null;
  refreshDevices: () => Promise<Device[]>;
  addDevice: (device: Omit<Device, 'id' | 'created_at'>) => Promise<boolean>;
  
  // Locations
  locations: Location[];
  locationsLoading: boolean;
  locationsError: string | null;
  locationsLastFetch: number | null;
  refreshLocations: () => Promise<Location[]>;
  addLocation: (location: Omit<Location, 'id' | 'created_at'>) => Promise<boolean>;
  
  // Cache management
  invalidateUserData: (userId: string) => void;
  invalidateAllCache: () => void;
  invalidateByPattern: (pattern: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { profile, isAuthenticated } = useAuth();
  
  // Solo cargar datos si el usuario está autenticado y tiene perfil
  const profileId = isAuthenticated && profile ? profile.id : undefined;
  
  // Configuración optimizada para diferentes tipos de datos
  const deviceConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutos - Los dispositivos cambian frecuentemente
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  };
  
  const locationConfig = {
    staleTime: 15 * 60 * 1000, // 15 minutos - Las ubicaciones cambian menos
    refetchOnWindowFocus: false, // No necesario para ubicaciones
    refetchOnReconnect: true,
  };
  
  // Hooks de datos con configuración optimizada
  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
    lastFetch: devicesLastFetch,
    addDevice,
    refreshDevices
  } = useDevicesData(profileId, deviceConfig);
  
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
    lastFetch: locationsLastFetch,
    addLocation,
    refreshLocations
  } = useLocationsData(profileId, locationConfig);
  
  const {
    invalidateUserData,
    invalidateAllCache,
    invalidateByPattern
  } = useCacheInvalidation();
  
  const value: DataContextType = {
    // Devices
    devices,
    devicesLoading,
    devicesError,
    devicesLastFetch,
    refreshDevices,
    addDevice,
    
    // Locations
    locations,
    locationsLoading,
    locationsError,
    locationsLastFetch,
    refreshLocations,
    addLocation,
    
    // Cache management
    invalidateUserData,
    invalidateAllCache,
    invalidateByPattern
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
}

// Hook para obtener estadísticas agregadas de los datos
export function useDataStats() {
  const { devices, locations } = useData();
  
  const deviceStats = React.useMemo(() => {
    const activeDevices = devices.filter(device => 
      // Aquí puedes agregar lógica para determinar si un dispositivo está activo
      true // Por ahora, consideramos todos como activos
    ).length;
    
    const devicesByType = devices.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: devices.length,
      active: activeDevices,
      byType: devicesByType
    };
  }, [devices]);
  
  const locationStats = React.useMemo(() => {
    return {
      total: locations.length,
      // Aquí puedes agregar más estadísticas de ubicaciones
    };
  }, [locations]);
  
  return {
    devices: deviceStats,
    locations: locationStats
  };
}

// Hook para gestión de estado global de la aplicación
export function useAppState() {
  const { isAuthenticated, profileLoading } = useAuth();
  const { devicesLoading, locationsLoading } = useData();
  
  const isAppLoading = profileLoading || (isAuthenticated && (devicesLoading || locationsLoading));
  const isAppReady = isAuthenticated && !isAppLoading;
  
  return {
    isAppLoading,
    isAppReady,
    isAuthenticated
  };
}
