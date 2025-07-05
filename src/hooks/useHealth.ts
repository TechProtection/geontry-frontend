/**
 * Hook para endpoints de salud del sistema
 */

import { useQuery } from '@tanstack/react-query';
import { getApiRoot, getHealth, getCorsTest } from '../api/health';

/**
 * Hook para obtener el estado básico de la API
 */
export const useApiRoot = () => {
  return useQuery({
    queryKey: ['api-root'],
    queryFn: getApiRoot,
    refetchInterval: 30000, // Revalidar cada 30 segundos
    staleTime: 10000, // Considerar stale después de 10 segundos
  });
};

/**
 * Hook para obtener información de salud del sistema
 */
export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 30000, // Revalidar cada 30 segundos
    staleTime: 10000, // Considerar stale después de 10 segundos
  });
};

/**
 * Hook para probar la configuración CORS
 */
export const useCorsTest = () => {
  return useQuery({
    queryKey: ['cors-test'],
    queryFn: getCorsTest,
    enabled: false, // Solo ejecutar manualmente
    staleTime: Infinity, // No revalidar automáticamente
  });
};
