export interface Profile {
  id: string;
  role: 'USER' | 'ADMIN';
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  radius: number;
  is_active: boolean;
  created_at: string;
  profile_id: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  profile_id: string;
  created_at: string;
  profile?: Profile;
  sensors?: Sensor[];
}

export interface Sensor {
  id: string;
  name: string;
  type: string;
  unit: string;
  device_id: string;
  created_at: string;
  device?: Device;
}

export interface ProximityEvent {
  id: string;
  type: 'enter' | 'exit';
  home_location_id: string;
  home_location_name: string;
  latitude: number;
  longitude: number;
  distance: number;
  device_id: string;
  user_id: string;
  created_at: string;
  device?: Device;
  user?: Profile;
  location?: Location;
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface HealthCheck {
  status: 'OK' | 'ERROR';
  timestamp: string;
  environment: string;
  version: string;
  database: string;
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
  };
}

export interface DashboardStats {
  totalLocations: number;
  totalDevices: number;
  totalEvents: number;
  activeDevices: number;
  locationsWithEvents: number;
  averageTimeInside: number;
  averageTimeOutside: number;
  mostActiveLocation: {
    name: string;
    events: number;
  };
  recentEvents: ProximityEvent[];
}

export interface LocationWithStats extends Location {
  totalEvents: number;
  enterEvents: number;
  exitEvents: number;
  averageStayTime: number;
  lastEventTime: string | null;
  isCurrentlyInside: boolean;
}

export interface DeviceWithStats extends Device {
  totalEvents: number;
  lastEventTime: string | null;
  currentLocation: string | null;
  isActive: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface EventFilters {
  timeRange?: TimeRange;
  deviceIds?: string[];
  locationIds?: string[];
  eventTypes?: ('enter' | 'exit')[];
  userIds?: string[];
}

export interface CreateLocationRequest {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  radius: number;
  is_active: boolean;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> {
  id: string;
}

export interface CreateDeviceRequest {
  name: string;
  type: string;
  profile_id: string;
}

export interface UpdateDeviceRequest extends Partial<CreateDeviceRequest> {
  id: string;
}

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