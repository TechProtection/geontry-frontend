import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { Profile } from '@/integrations/supabase/types'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  signOut: () => Promise<void>
  loading: boolean
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    if (!userId) return null;
    
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        
        // Si el perfil no existe, intentamos crearlo
        if (error.code === 'PGRST116') { // No data found
          console.log('Profile not found, attempting to create one');
          return await createProfile(userId);
        }
        return null;
      }
      
      console.log('Profile fetched successfully:', data);
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  }
  const createProfile = async (userId: string) => {
    try {
      // Verificamos nuevamente que tenemos un userId válido
      if (!userId) return null;

      const newProfile = {
        id: userId,
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario',
        email: user?.email || '',
        avatar_url: null,
        role: 'USER' as const,
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