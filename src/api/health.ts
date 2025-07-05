/**
 * Servicios de API para endpoints de salud del sistema
 */

import { apiClient } from './apiClient';
import { HealthResponse, CorsTestResponse } from '../types/api';

/**
 * Obtiene el estado básico de la API
 */
export const getApiRoot = async (): Promise<{ status: string }> => {
  return apiClient.get('/');
};

/**
 * Obtiene información detallada de salud del sistema
 */
export const getHealth = async (): Promise<HealthResponse> => {
  return apiClient.get('/health');
};

/**
 * Prueba la configuración CORS
 */
export const getCorsTest = async (): Promise<CorsTestResponse> => {
  return apiClient.get('/cors-test');
};
