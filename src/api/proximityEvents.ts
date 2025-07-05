/**
 * Servicios de API para eventos de proximidad
 */

import { apiClient } from './apiClient';
import { ProximityEvent } from '../types/api';

interface CreateProximityEventData {
  type: ProximityEvent['type'];
  user_id: string;
  device_id: string;
  location_id: string;
  home_location_name: string;
}

/**
 * Obtiene lista de todos los eventos de proximidad
 */
export const listProximityEvents = async (): Promise<ProximityEvent[]> => {
  return apiClient.get('/proximity-events');
};

/**
 * Crea un nuevo evento de proximidad
 */
export const createProximityEvent = async (data: CreateProximityEventData): Promise<ProximityEvent> => {
  return apiClient.post('/proximity-events', data);
};

/**
 * Obtiene un evento de proximidad por ID
 */
export const getProximityEvent = async (id: string): Promise<ProximityEvent> => {
  return apiClient.get(`/proximity-events/${id}`);
};

/**
 * Obtiene eventos de proximidad por usuario
 */
export const getProximityEventsByUser = async (userId: string): Promise<ProximityEvent[]> => {
  return apiClient.get(`/proximity-events/user/${userId}`);
};

/**
 * Obtiene eventos de proximidad por dispositivo
 */
export const getProximityEventsByDevice = async (deviceId: string): Promise<ProximityEvent[]> => {
  return apiClient.get(`/proximity-events/device/${deviceId}`);
};

/**
 * Obtiene eventos de proximidad por ubicación
 */
export const getProximityEventsByLocation = async (locationId: string): Promise<ProximityEvent[]> => {
  return apiClient.get(`/proximity-events/location/${locationId}`);
};

/**
 * Obtiene eventos de proximidad filtrados por tipo
 */
export const getProximityEventsByType = async (type: ProximityEvent['type']): Promise<ProximityEvent[]> => {
  return apiClient.get(`/proximity-events/type/${type}`);
};

/**
 * Obtiene eventos de proximidad en un rango de fechas
 */
export const getProximityEventsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ProximityEvent[]> => {
  return apiClient.get(`/proximity-events/date-range?start=${startDate}&end=${endDate}`);
};
