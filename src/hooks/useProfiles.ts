/**
 * Hooks para gestión de perfiles de usuario
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listProfiles,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileByEmail,
  getActiveProfiles,
} from '../api/users';

/**
 * Hook para obtener lista de perfiles
 */
export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: listProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un perfil específico
 */
export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener perfiles activos
 */
export const useActiveProfiles = () => {
  return useQuery({
    queryKey: ['profiles', 'active'],
    queryFn: getActiveProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar perfil por email
 */
export const useProfileByEmail = (email: string) => {
  return useQuery({
    queryKey: ['profile', 'email', email],
    queryFn: () => getProfileByEmail(email),
    enabled: !!email && email.includes('@'),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para crear un nuevo perfil
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles', 'active'] });
      toast.success('Perfil creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el perfil');
      console.error('Error creating profile:', error);
    },
  });
};

/**
 * Hook para actualizar un perfil existente
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateProfile>[1]) => 
      updateProfile(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      queryClient.invalidateQueries({ queryKey: ['profiles', 'active'] });
      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    },
  });
};

/**
 * Hook para eliminar un perfil
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.removeQueries({ queryKey: ['profile', profileId] });
      queryClient.invalidateQueries({ queryKey: ['profiles', 'active'] });
      toast.success('Perfil eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el perfil');
      console.error('Error deleting profile:', error);
    },
  });
};
