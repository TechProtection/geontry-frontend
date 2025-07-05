/**
 * Hook simplificado para ubicaciones sin caché complejo
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Location } from '@/types';

interface UseLocationsSimpleReturn {
  data: Location[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLocationsSimple = (): UseLocationsSimpleReturn => {
  const [data, setData] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLocations = useCallback(async () => {
    if (!user?.id) {
      setData([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: locations, error } = await supabase
        .from('profiles')
        .select(`
          locations:locations(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Extraer las ubicaciones del resultado anidado
      const locationsData = (locations as any)?.locations || [];
      setData(locationsData);
    } catch (err: any) {
      console.error('Error fetching locations:', err);
      setError(err.message || 'Error al cargar ubicaciones');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchLocations
  };
};
