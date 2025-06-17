import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { Profile } from '@/integrations/supabase/types'
import { useProfileData, useCacheInvalidation } from '@/hooks/use-data'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  signOut: () => Promise<void>
  loading: boolean
  refreshProfile: () => Promise<Profile | null>
  isAuthenticated: boolean
  profileLoading: boolean
  profileError: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Usar el hook personalizado para manejar datos del perfil con caché mejorado
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError,
    updateProfile,
    refreshProfile: refreshProfileData,
    isStale,
    isFetching
  } = useProfileData(user?.id, {
    staleTime: 15 * 60 * 1000, // 15 minutos
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })
  
  const { invalidateUserData, invalidateAllCache } = useCacheInvalidation()

  // Función optimizada para refrescar perfil
  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    if (!user?.id) {
      console.warn('Cannot refresh profile: No user ID available');
      return null;
    }
    
    try {
      return await refreshProfileData();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return null;
    }
  }, [user?.id, refreshProfileData]);

  // Función de logout optimizada
  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      
      // Limpiar estado local primero
      setSession(null);
      setUser(null);
      
      // Invalidar caché del usuario
      if (user?.id) {
        invalidateUserData(user.id);
      }
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during signOut:', error);
      }
      
      // Limpiar almacenamiento local relacionado con auth
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-session');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      console.log('Sign out complete');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [user?.id, invalidateUserData]);

  // Inicialización de autenticación mejorada
  useEffect(() => {
    let isMounted = true;
    console.log('AuthContext initializing...');
    
    const initAuth = async () => {
      try {
        console.log('Getting session from Supabase');
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) setLoading(false);
          return;
        }
        
        const currentSession = sessionData?.session;
        console.log('Session retrieved:', currentSession ? 'Found' : 'None');
        
        if (currentSession && isMounted) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) setLoading(false);
      }
    };
    
    initAuth();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (isMounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Si se cierra sesión, limpiar caché
          if (!newSession?.user) {
            invalidateAllCache();
          }
        }
      }
    );
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [invalidateAllCache]);

  // El loading combinado incluye tanto auth como profile (solo al inicio)
  const combinedLoading = loading;
  const isAuthenticated = !!(session && user);

  const value = {
    session,
    user,
    profile,
    signOut,
    loading: combinedLoading,
    refreshProfile,
    isAuthenticated,
    profileLoading,
    profileError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}