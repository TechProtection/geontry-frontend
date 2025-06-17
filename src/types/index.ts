export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  full_name: string;
}

export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}