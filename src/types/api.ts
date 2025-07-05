/**
 * Tipos de datos para la API de GeoEntry
 */

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
}

export interface HealthResponse {
  uptime: number;
  version: string;
  status: string;
  timestamp: string;
}

export interface CorsTestResponse {
  cors: boolean;
  origin: string;
  method: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'smart_lock' | 'light' | 'thermostat' | 'camera' | 'sensor' | 'other';
  profile_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  devices?: Device[];
}

export interface Sensor {
  id: string;
  name: string;
  type: 'proximity' | 'temperature' | 'motion' | 'light' | 'other';
  device_id: string;
  profile_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  device?: Device;
  profile?: Profile;
}

export interface ProximityEvent {
  id: string;
  type: 'enter' | 'exit';
  user_id: string;
  device_id: string;
  location_id: string;
  home_location_name: string;
  created_at: string;
  user?: Profile;
  device?: Device;
  location?: Location;
}

export interface LogEntry {
  id: string;
  type: 'enter' | 'exit';
  message: string;
  user_name: string;
  location_name: string;
  timestamp: string;
}

export interface DashboardStats {
  total_devices: number;
  total_locations: number;
  total_users: number;
  total_events: number;
  active_devices: number;
  active_locations: number;
}

export interface ProximityEventStats {
  date: string;
  enter_count: number;
  exit_count: number;
}

export interface DeviceTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}
