/**
 * Hook simplificado para dispositivos sin caché complejo
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Device } from '@/types';

interface UseDevicesSimpleReturn {
  data: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDevicesSimple = (): UseDevicesSimpleReturn => {
  const [data, setData] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDevices = useCallback(async () => {
    if (!user?.id) {
      setData([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: devices, error } = await supabase
        .from('profiles')
        .select(`
          devices:devices(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Extraer los dispositivos del resultado anidado
      const devicesData = (devices as any)?.devices || [];
      setData(devicesData);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError(err.message || 'Error al cargar dispositivos');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDevices
  };
};
