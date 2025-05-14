import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno para Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}