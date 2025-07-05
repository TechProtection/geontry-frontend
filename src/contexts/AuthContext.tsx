/**
 * Contexto de autenticación con Supabase
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Tipo de perfil basado en la base de datos de Supabase
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  refreshProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: Error }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil del usuario
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Función para crear un nuevo perfil
  const createProfile = async (userId: string, username?: string): Promise<Profile | null> => {
    try {
      const newProfile = {
        id: userId,
        username: username || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      return null;
    }
  };

  // Función para refrescar el perfil
  const refreshProfile = async (): Promise<Profile | null> => {
    if (!user?.id) {
      console.warn('Cannot refresh profile: No user ID available');
      return null;
    }
    
    const profileData = await fetchProfile(user.id);
    
    if (profileData) {
      setProfile(profileData);
    }
    
    return profileData;
  };

  // Función para actualizar el perfil
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: Error }> => {
    if (!user?.id) {
      return { error: new Error('No hay usuario autenticado') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error: new Error(error.message) };
      }

      if (data) {
        setProfile(data);
      }

      return {};
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: error as Error };
    }
  };

  // Función de inicio de sesión
  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        return { error };
      }

      return {};
    } catch (error) {
      console.error('Unexpected error in signIn:', error);
      return { error: error as AuthError };
    }
  };

  // Función de registro
  const signUp = async (email: string, password: string, username?: string): Promise<{ error?: AuthError }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || null
          }
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        return { error };
      }

      // Si el usuario se creó exitosamente, crear su perfil
      if (data.user && !data.session) {
        // Usuario creado pero necesita confirmar email
        console.log('Usuario creado, necesita confirmar email');
      } else if (data.user && data.session) {
        // Usuario creado y logueado inmediatamente
        await createProfile(data.user.id, username);
      }

      return {};
    } catch (error) {
      console.error('Unexpected error in signUp:', error);
      return { error: error as AuthError };
    }
  };

  // Función de cierre de sesión
  const signOut = async (): Promise<{ error?: AuthError }> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }

      // Limpiar estado local
      setProfile(null);
      setUser(null);
      setSession(null);

      return {};
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      return { error: error as AuthError };
    }
  };

  // Efecto para manejar cambios en el estado de autenticación
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Obtener sesión actual
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        const currentSession = sessionData?.session;
        
        if (currentSession && isMounted) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Cargar perfil o crearlo si no existe
          let profileData = await fetchProfile(currentSession.user.id);
          
          if (!profileData) {
            // Si no existe el perfil, crearlo
            profileData = await createProfile(
              currentSession.user.id,
              currentSession.user.user_metadata?.username
            );
          }
          
          if (profileData && isMounted) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initAuth();
    
    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        if (!isMounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Cargar perfil cuando el usuario se autentica
          let profileData = await fetchProfile(newSession.user.id);
          
          // Si no existe el perfil (nuevo usuario), crearlo
          if (!profileData) {
            profileData = await createProfile(
              newSession.user.id,
              newSession.user.user_metadata?.username
            );
          }
          
          if (profileData && isMounted) {
            setProfile(profileData);
          }
        } else {
          // Limpiar perfil cuando el usuario se desautentica
          setProfile(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
