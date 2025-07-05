/**
 * Servicios de API para sensores
 */

import { apiClient } from './apiClient';
import { Sensor } from '../types/api';

interface CreateSensorData {
  name: string;
  type: Sensor['type'];
  device_id: string;
  profile_id: string;
}

interface UpdateSensorData {
  name?: string;
  type?: Sensor['type'];
  device_id?: string;
  profile_id?: string;
  is_active?: boolean;
}

/**
 * Obtiene lista de todos los sensores
 */
export const listSensors = async (): Promise<Sensor[]> => {
  return apiClient.get('/sensors');
};

/**
 * Crea un nuevo sensor
 */
export const createSensor = async (data: CreateSensorData): Promise<Sensor> => {
  return apiClient.post('/sensors', data);
};

/**
 * Obtiene un sensor por ID
 */
export const getSensor = async (id: string): Promise<Sensor> => {
  return apiClient.get(`/sensors/${id}`);
};

/**
 * Actualiza un sensor existente
 */
export const updateSensor = async (id: string, data: UpdateSensorData): Promise<Sensor> => {
  return apiClient.put(`/sensors/${id}`, data);
};

/**
 * Elimina un sensor
 */
export const deleteSensor = async (id: string): Promise<void> => {
  return apiClient.delete(`/sensors/${id}`);
};

/**
 * Obtiene sensores por dispositivo
 */
export const getSensorsByDevice = async (deviceId: string): Promise<Sensor[]> => {
  return apiClient.get(`/sensors/device/${deviceId}`);
};

/**
 * Obtiene sensores por perfil
 */
export const getSensorsByProfile = async (profileId: string): Promise<Sensor[]> => {
  return apiClient.get(`/sensors/profile/${profileId}`);
};
