/**
 * Contexto de autenticación
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Simular verificación de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simular verificación de token almacenado
        const token = localStorage.getItem('auth_token');
        if (token) {
          // En una implementación real, verificaríamos el token con la API
          // Por ahora, simulamos un usuario autenticado
          const mockUser: User = {
            id: '1',
            full_name: 'Usuario Demo',
            email: 'demo@geoentry.com',
            role: 'ADMIN',
            avatar_url: undefined,
          };
          dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simular llamada a API de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciales demo
      if (email === 'demo@geoentry.com' && password === 'demo123') {
        const user: User = {
          id: '1',
          full_name: 'Usuario Demo',
          email: 'demo@geoentry.com',
          role: 'ADMIN',
          avatar_url: undefined,
        };
        
        // Guardar token simulado
        localStorage.setItem('auth_token', 'demo_token_123');
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error de autenticación' 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
  }

  const createProfile = async (userId: string) => {
    try {
      // Verificamos nuevamente que tenemos un userId válido
      if (!userId) return null;

      const newProfile = {
        id: userId,
        username: user?.email?.split('@')[0] || null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      console.log('Profile created successfully:', data[0]);
      return data[0] as Profile;
    } catch (error) {
      console.error('Error in createProfile:', error);
      return null;
    }
  }

  const refreshProfile = async () => {
    if (!user?.id) {
      console.warn('Cannot refresh profile: No user ID available');
      return null;
    }
    
    console.log('Refreshing profile for user:', user.id);
    const profileData = await fetchProfile(user.id);
    
    if (profileData) {
      console.log('Setting profile:', profileData);
      setProfile(profileData);
    } else {
      console.warn('Failed to refresh profile');
    }
    
    return profileData;
  }

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
          
          // Fetch profile with retry logic
          const fetchProfileWithRetry = async (retries = 3, delay = 500) => {
            for (let i = 0; i < retries; i++) {
              console.log(`Fetching profile attempt ${i+1}/${retries}`);
              const profileData = await fetchProfile(currentSession.user.id);
              
              if (profileData) {
                if (isMounted) setProfile(profileData);
                break;
              } else if (i < retries - 1) {
                console.log(`Retry in ${delay}ms`);
                await new Promise(r => setTimeout(r, delay));
                delay *= 2; // Exponential backoff
              }
            }
          };
          
          await fetchProfileWithRetry();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    initAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        if (isMounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            const profileData = await fetchProfile(newSession.user.id);
            if (isMounted) setProfile(profileData);
          } else {
            if (isMounted) setProfile(null);
          }
        }
      }
    );
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      // First clear state
      setProfile(null);
      setUser(null);
      setSession(null);
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-session');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      console.log('Sign out complete');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const value = {
    session,
    user,
    profile,
    signOut,
    loading,
    refreshProfile
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