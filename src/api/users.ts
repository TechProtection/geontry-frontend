/**
 * Servicios de API para perfiles de usuario
 */

import { apiClient } from './apiClient';
import { Profile } from '../types/api';

interface CreateProfileData {
  full_name: string;
  email: string;
  role?: Profile['role'];
  avatar_url?: string;
  is_active?: boolean;
}

interface UpdateProfileData {
  full_name?: string;
  email?: string;
  role?: Profile['role'];
  avatar_url?: string;
  is_active?: boolean;
}

/**
 * Obtiene lista de todos los perfiles de usuario
 */
export const listProfiles = async (): Promise<Profile[]> => {
  return apiClient.get('/users');
};

/**
 * Crea un nuevo perfil de usuario
 */
export const createProfile = async (data: CreateProfileData): Promise<Profile> => {
  return apiClient.post('/users', data);
};

/**
 * Obtiene un perfil por ID
 */
export const getProfile = async (id: string): Promise<Profile> => {
  return apiClient.get(`/users/${id}`);
};

/**
 * Actualiza un perfil existente
 */
export const updateProfile = async (id: string, data: UpdateProfileData): Promise<Profile> => {
  return apiClient.put(`/users/${id}`, data);
};

/**
 * Elimina un perfil
 */
export const deleteProfile = async (id: string): Promise<void> => {
  return apiClient.delete(`/users/${id}`);
};

/**
 * Busca un perfil por email
 */
export const getProfileByEmail = async (email: string): Promise<Profile> => {
  return apiClient.get(`/users/email/${encodeURIComponent(email)}`);
};

/**
 * Obtiene perfiles activos
 */
export const getActiveProfiles = async (): Promise<Profile[]> => {
  return apiClient.get('/users/active');
};
