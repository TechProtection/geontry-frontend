/**
 * Hook simplificado para eventos de proximidad sin caché complejo
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ProximityEvent } from '@/types';

interface UseProximityEventsSimpleReturn {
  data: ProximityEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProximityEventsSimple = (): UseProximityEventsSimpleReturn => {
  const [data, setData] = useState<ProximityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    if (!user?.id) {
      setData([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: events, error } = await supabase
        .from('profiles')
        .select(`
          proximity_events:proximity_events(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Extraer los eventos del resultado anidado
      const eventsData = (events as any)?.proximity_events || [];
      setData(eventsData);
    } catch (err: any) {
      console.error('Error fetching proximity events:', err);
      setError(err.message || 'Error al cargar eventos de proximidad');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchEvents
  };
};
