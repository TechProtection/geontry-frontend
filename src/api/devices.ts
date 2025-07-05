/**
 * Servicios de API para dispositivos
 */

import { apiClient } from './apiClient';
import { Device } from '../types/api';

interface CreateDeviceData {
  name: string;
  type: Device['type'];
  profile_id: string;
}

interface UpdateDeviceData {
  name?: string;
  type?: Device['type'];
  is_active?: boolean;
}

/**
 * Obtiene lista de todos los dispositivos
 */
export const listDevices = async (): Promise<Device[]> => {
  return apiClient.get('/devices');
};

/**
 * Crea un nuevo dispositivo
 */
export const createDevice = async (data: CreateDeviceData): Promise<Device> => {
  return apiClient.post('/devices', data);
};

/**
 * Obtiene un dispositivo por ID
 */
export const getDevice = async (id: string): Promise<Device> => {
  return apiClient.get(`/devices/${id}`);
};

/**
 * Actualiza un dispositivo existente
 */
export const updateDevice = async (id: string, data: UpdateDeviceData): Promise<Device> => {
  return apiClient.put(`/devices/${id}`, data);
};

/**
 * Elimina un dispositivo
 */
export const deleteDevice = async (id: string): Promise<void> => {
  return apiClient.delete(`/devices/${id}`);
};

/**
 * Obtiene dispositivos por perfil de usuario
 */
export const getDevicesByProfile = async (profileId: string): Promise<Device[]> => {
  return apiClient.get(`/devices/profile/${profileId}`);
};
