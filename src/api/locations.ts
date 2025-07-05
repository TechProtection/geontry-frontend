/**
 * Servicios de API para ubicaciones
 */

import { apiClient } from './apiClient';
import { Location } from '../types/api';

interface CreateLocationData {
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active?: boolean;
}

interface UpdateLocationData {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  is_active?: boolean;
}

/**
 * Obtiene lista de todas las ubicaciones
 */
export const listLocations = async (): Promise<Location[]> => {
  return apiClient.get('/locations');
};

/**
 * Crea una nueva ubicación
 */
export const createLocation = async (data: CreateLocationData): Promise<Location> => {
  return apiClient.post('/locations', data);
};

/**
 * Obtiene una ubicación por ID
 */
export const getLocation = async (id: string): Promise<Location> => {
  return apiClient.get(`/locations/${id}`);
};

/**
 * Actualiza una ubicación existente
 */
export const updateLocation = async (id: string, data: UpdateLocationData): Promise<Location> => {
  return apiClient.put(`/locations/${id}`, data);
};

/**
 * Elimina una ubicación
 */
export const deleteLocation = async (id: string): Promise<void> => {
  return apiClient.delete(`/locations/${id}`);
};

/**
 * Obtiene ubicaciones activas
 */
export const getActiveLocations = async (): Promise<Location[]> => {
  return apiClient.get('/locations/active');
};
