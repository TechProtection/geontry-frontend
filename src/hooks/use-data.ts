import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  profileCache, 
  deviceCache, 
  sensorCache, 
  locationCache,
  generateCacheKey, 
  invalidateUserCache 
} from '@/lib/persistent-cache';
import { CACHE_CONFIG, CACHE_KEYS } from '@/lib/cache-config';
import type { Profile, Device, Location, Sensor } from '@/integrations/supabase/types';

// Estado de carga mejorado para hooks
interface LoadingState {
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  isStale: boolean;
  isFetching: boolean;
}

// Configuración de revalidación
interface RevalidationConfig {
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number;
}

// Hook mejorado para manejar perfiles con caché persistente y revalidación
export const useProfileData = (userId?: string, config?: RevalidationConfig) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, setState] = useState<LoadingState>({
    loading: true,
    error: null,
    lastFetch: null,
    isStale: false,
    isFetching: false
  });
  
  const isMountedRef = useRef(true);
  const revalidationConfig = {
    staleTime: config?.staleTime || CACHE_CONFIG.TTL.PROFILE / 2,
    refetchOnWindowFocus: config?.refetchOnWindowFocus ?? true,
    refetchOnReconnect: config?.refetchOnReconnect ?? true,
    refetchInterval: config?.refetchInterval,
    ...config
  };

  const fetchProfile = useCallback(async (id: string, forceRefresh = false) => {
    if (!id) return null;

    const cacheKey = CACHE_KEYS.PROFILE(id);
    
    // Usar stale-while-revalidate para mejor UX
    if (!forceRefresh) {
      try {
        const fetcher = async () => {
          setState(prev => ({ ...prev, isFetching: true }));
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // Perfil no encontrado, intentar crear uno
              const newProfile = await createProfile(id);
              if (newProfile) {
                return newProfile;
              }
            }
            throw error;
          }

          return data;
        };

        const data = await profileCache.getWithRevalidation(
          cacheKey,
          fetcher,
          { 
            forceRevalidation: forceRefresh,
            revalidationTtl: revalidationConfig.staleTime 
          }
        );

        if (data && isMountedRef.current) {
          setProfile(data);
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            isFetching: false,
            lastFetch: Date.now(),
            error: null 
          }));
          return data;
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false,
            isFetching: false,
            error: err.message || 'Error al cargar el perfil',
            lastFetch: Date.now()
          }));
        }
      }
    } else {
      // Refresh manual
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            const newProfile = await createProfile(id);
            if (newProfile && isMountedRef.current) {
              setProfile(newProfile);
              profileCache.set(cacheKey, newProfile);
              setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
              return newProfile;
            }
          }
          throw error;
        }

        if (data && isMountedRef.current) {
          setProfile(data);
          profileCache.set(cacheKey, data);
          setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
          return data;
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: err.message || 'Error al cargar el perfil',
            lastFetch: Date.now()
          }));
        }
      }
    }
    
    return null;
  }, [revalidationConfig.staleTime]);

  const createProfile = useCallback(async (id: string): Promise<Profile | null> => {
    try {
      // Obtener información del usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      const newProfile = {
        id,
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario',
        email: user?.email || '',
        avatar_url: null,
        role: 'USER' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) return false;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      if (data && isMountedRef.current) {
        setProfile(data);
        const cacheKey = generateCacheKey('profile', userId);
        profileCache.set(cacheKey, data);
        setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
        return true;
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: err.message || 'Error al actualizar el perfil' 
        }));
      }
    }
    
    return false;
  }, [userId]);

  const refreshProfile = useCallback(() => {
    if (userId) {
      return fetchProfile(userId, true);
    }
    return Promise.resolve(null);
  }, [userId, fetchProfile]);

  // Limpiar caché al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  // Cargar perfil inicial
  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setProfile(null);
      setState({ loading: false, error: null, lastFetch: null, isStale: false, isFetching: false });
    }
  }, [userId, fetchProfile]);

  // Revalidar en foco de ventana
  useEffect(() => {
    if (!revalidationConfig.refetchOnWindowFocus || !userId) return;

    const handleFocus = () => {
      const now = Date.now();
      if (state.lastFetch && (now - state.lastFetch) > revalidationConfig.staleTime!) {
        fetchProfile(userId);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId, state.lastFetch, fetchProfile, revalidationConfig]);

  // Polling interval
  useEffect(() => {
    if (!revalidationConfig.refetchInterval || !userId) return;

    const interval = setInterval(() => {
      fetchProfile(userId);
    }, revalidationConfig.refetchInterval);

    return () => clearInterval(interval);
  }, [userId, fetchProfile, revalidationConfig.refetchInterval]);

  return {
    profile,
    loading: state.loading,
    error: state.error,
    lastFetch: state.lastFetch,
    isStale: state.isStale,
    isFetching: state.isFetching,
    updateProfile,
    refreshProfile
  };
};

// Hook mejorado para manejar dispositivos con caché y revalidación
export const useDevicesData = (profileId?: string, config?: RevalidationConfig) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [state, setState] = useState<LoadingState>({
    loading: true,
    error: null,
    lastFetch: null,
    isStale: false,
    isFetching: false
  });  
  const isMountedRef = useRef(true);
  const revalidationConfig = {
    staleTime: config?.staleTime || CACHE_CONFIG.TTL.DEVICES / 2,
    refetchOnWindowFocus: config?.refetchOnWindowFocus ?? true,
    refetchOnReconnect: config?.refetchOnReconnect ?? true,
    refetchInterval: config?.refetchInterval,
    ...config
  };

  const fetchDevices = useCallback(async (id: string, forceRefresh = false) => {
    if (!id) return [];

    const cacheKey = generateCacheKey('devices', id);
    
    // Usar stale-while-revalidate para mejor UX
    if (!forceRefresh) {
      try {
        const fetcher = async () => {
          setState(prev => ({ ...prev, isFetching: true }));
          
          const { data, error } = await supabase
            .from('devices')
            .select('*')
            .eq('profile_id', id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data || [];
        };

        const data = await deviceCache.getWithRevalidation(
          cacheKey,
          fetcher,
          { 
            forceRevalidation: forceRefresh,
            revalidationTtl: revalidationConfig.staleTime 
          }
        );

        if (isMountedRef.current) {
          setDevices(data);
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            isFetching: false,
            lastFetch: Date.now(),
            error: null 
          }));
        }
        
        return data;
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false,
            isFetching: false,
            error: err.message || 'Error al cargar dispositivos',
            lastFetch: Date.now()
          }));
        }
        return [];
      }
    } else {
      // Refresh manual
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('profile_id', id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const devicesData = data || [];
        
        if (isMountedRef.current) {
          setDevices(devicesData);
          deviceCache.set(cacheKey, devicesData);
          setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
        }
        
        return devicesData;
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: err.message || 'Error al cargar dispositivos',
            lastFetch: Date.now()
          }));
        }
        return [];
      }
    }
  }, [revalidationConfig.staleTime]);

  const addDevice = useCallback(async (deviceData: Omit<Device, 'id' | 'created_at'>) => {
    if (!profileId) return false;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('devices')
        .insert([{
          ...deviceData,
          profile_id: profileId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (data && isMountedRef.current) {
        setDevices(prev => [data, ...prev]);
        // Invalidar caché para forzar refresco
        const cacheKey = generateCacheKey('devices', profileId);
        deviceCache.delete(cacheKey);
        setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
        return true;
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: err.message || 'Error al agregar dispositivo' 
        }));
      }
    }
    
    return false;
  }, [profileId]);

  const refreshDevices = useCallback(() => {
    if (profileId) {
      return fetchDevices(profileId, true);
    }
    return Promise.resolve([]);
  }, [profileId, fetchDevices]);

  // Limpiar caché al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  // Cargar dispositivos inicial
  useEffect(() => {
    if (profileId) {
      fetchDevices(profileId);
    } else {
      setDevices([]);
      setState({ loading: false, error: null, lastFetch: null, isStale: false, isFetching: false });
    }
  }, [profileId, fetchDevices]);
  // Revalidar en foco de ventana para dispositivos
  useEffect(() => {
    if (!revalidationConfig.refetchOnWindowFocus || !profileId) return;

    const handleFocus = () => {
      const now = Date.now();
      if (state.lastFetch && (now - state.lastFetch) > revalidationConfig.staleTime!) {
        fetchDevices(profileId);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [profileId, state.lastFetch, fetchDevices, revalidationConfig]);

  return {
    devices,
    loading: state.loading,
    error: state.error,
    lastFetch: state.lastFetch,
    isStale: state.isStale,
    isFetching: state.isFetching,
    addDevice,
    refreshDevices
  };
};

// Hook para manejar ubicaciones con caché
export const useLocationsData = (profileId?: string, config?: RevalidationConfig) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [state, setState] = useState<LoadingState>({
    loading: true,
    error: null,
    lastFetch: null,
    isStale: false,
    isFetching: false
  });
  
  const isMountedRef = useRef(true);
  const revalidationConfig = {
    staleTime: config?.staleTime || CACHE_CONFIG.TTL.LOCATIONS / 2,
    refetchOnWindowFocus: config?.refetchOnWindowFocus ?? true,
    refetchOnReconnect: config?.refetchOnReconnect ?? true,
    refetchInterval: config?.refetchInterval,
    ...config
  };

  const fetchLocations = useCallback(async (id: string, forceRefresh = false) => {
    if (!id) return [];

    const cacheKey = CACHE_KEYS.LOCATIONS(id);
    
    if (!forceRefresh) {
      try {
        const fetcher = async () => {
          setState(prev => ({ ...prev, isFetching: true }));
          
          const { data, error } = await supabase
            .from('locations')
            .select('*')
            .eq('profile_id', id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data || [];
        };

        const data = await locationCache.getWithRevalidation(
          cacheKey,
          fetcher,
          { 
            forceRevalidation: forceRefresh,
            revalidationTtl: revalidationConfig.staleTime 
          }
        );

        if (isMountedRef.current) {
          setLocations(data);
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            isFetching: false,
            lastFetch: Date.now(),
            error: null 
          }));
        }
        
        return data;
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false,
            isFetching: false,
            error: err.message || 'Error al cargar ubicaciones',
            lastFetch: Date.now()
          }));
        }
        return [];
      }
    } else {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('profile_id', id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const locationsData = data || [];
        
        if (isMountedRef.current) {
          setLocations(locationsData);
          locationCache.set(cacheKey, locationsData);
          setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
        }
        
        return locationsData;
      } catch (err: any) {
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: err.message || 'Error al cargar ubicaciones',
            lastFetch: Date.now()
          }));
        }
        return [];
      }
    }
  }, [revalidationConfig.staleTime]);

  const addLocation = useCallback(async (locationData: Omit<Location, 'id' | 'created_at'>) => {
    if (!profileId) return false;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          ...locationData,
          profile_id: profileId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (data && isMountedRef.current) {
        setLocations(prev => [data, ...prev]);
        // Invalidar caché para forzar refresco
        const cacheKey = CACHE_KEYS.LOCATIONS(profileId);
        locationCache.delete(cacheKey);
        setState(prev => ({ ...prev, loading: false, lastFetch: Date.now() }));
        return true;
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: err.message || 'Error al agregar ubicación' 
        }));
      }
    }
    
    return false;
  }, [profileId]);

  const refreshLocations = useCallback(() => {
    if (profileId) {
      return fetchLocations(profileId, true);
    }
    return Promise.resolve([]);
  }, [profileId, fetchLocations]);

  // Limpiar caché al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cargar ubicaciones inicial
  useEffect(() => {
    if (profileId) {
      fetchLocations(profileId);
    } else {
      setLocations([]);
      setState({ loading: false, error: null, lastFetch: null, isStale: false, isFetching: false });
    }
  }, [profileId, fetchLocations]);

  return {
    locations,
    loading: state.loading,
    error: state.error,
    lastFetch: state.lastFetch,
    isStale: state.isStale,
    isFetching: state.isFetching,
    addLocation,
    refreshLocations
  };
};

// Hook genérico para invalidar caché mejorado
export const useCacheInvalidation = () => {
  const invalidateUserData = useCallback((userId: string) => {
    invalidateUserCache(userId);
  }, []);

  const invalidateAllCache = useCallback(() => {
    profileCache.clear();
    deviceCache.clear();
    sensorCache.clear();
    locationCache.clear();
  }, []);

  const invalidateByPattern = useCallback((pattern: string) => {
    [profileCache, deviceCache, sensorCache, locationCache].forEach(cache => {
      cache.invalidatePattern(pattern);
    });
  }, []);

  return {
    invalidateUserData,
    invalidateAllCache,
    invalidateByPattern
  };
};
