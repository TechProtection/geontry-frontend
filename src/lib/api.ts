import { 
  Location, 
  Device, 
  ProximityEvent, 
  HealthCheck, 
  CreateLocationRequest, 
  UpdateLocationRequest, 
  CreateDeviceRequest, 
  UpdateDeviceRequest 
} from '@/types';

const API_BASE_URL = 'https://geoentry-rest-api.onrender.com/api';

class APIClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth(): Promise<HealthCheck> {
    return this.request<HealthCheck>('/health');
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return this.request<Location[]>('/locations');
  }

  async getLocationById(id: string): Promise<Location> {
    return this.request<Location>(`/locations/${id}`);
  }

  async createLocation(location: CreateLocationRequest): Promise<Location> {
    return this.request<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async updateLocation(location: UpdateLocationRequest): Promise<Location> {
    return this.request<Location>(`/locations/${location.id}`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  }

  async deleteLocation(id: string): Promise<void> {
    return this.request<void>(`/locations/${id}`, {
      method: 'DELETE',
    });
  }

  // Devices
  async getDevices(): Promise<Device[]> {
    return this.request<Device[]>('/devices');
  }

  async getDeviceById(id: string): Promise<Device> {
    return this.request<Device>(`/devices/${id}`);
  }

  async createDevice(device: CreateDeviceRequest): Promise<Device> {
    return this.request<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }

  async updateDevice(device: UpdateDeviceRequest): Promise<Device> {
    return this.request<Device>(`/devices/${device.id}`, {
      method: 'PUT',
      body: JSON.stringify(device),
    });
  }

  async deleteDevice(id: string): Promise<void> {
    return this.request<void>(`/devices/${id}`, {
      method: 'DELETE',
    });
  }

  // Proximity Events
  async getProximityEvents(): Promise<ProximityEvent[]> {
    return this.request<ProximityEvent[]>('/proximity-events');
  }

  async getProximityEventById(id: string): Promise<ProximityEvent> {
    return this.request<ProximityEvent>(`/proximity-events/${id}`);
  }

  async getProximityEventsByDevice(deviceId: string): Promise<ProximityEvent[]> {
    return this.request<ProximityEvent[]>(`/proximity-events?device_id=${deviceId}`);
  }

  async getProximityEventsByLocation(locationId: string): Promise<ProximityEvent[]> {
    return this.request<ProximityEvent[]>(`/proximity-events?location_id=${locationId}`);
  }

  async getProximityEventsByUser(userId: string): Promise<ProximityEvent[]> {
    return this.request<ProximityEvent[]>(`/proximity-events?user_id=${userId}`);
  }

  // Analytics and Statistics
  async getLocationStats(locationId: string): Promise<{
    totalEvents: number;
    enterEvents: number;
    exitEvents: number;
    averageStayTime: number;
    lastEventTime: string | null;
  }> {
    const events = await this.getProximityEventsByLocation(locationId);
    
    const enterEvents = events.filter(e => e.type === 'enter');
    const exitEvents = events.filter(e => e.type === 'exit');
    
    let totalStayTime = 0;
    let stayCount = 0;
    
    for (let i = 0; i < enterEvents.length; i++) {
      const enterEvent = enterEvents[i];
      const exitEvent = exitEvents.find(e => 
        e.device_id === enterEvent.device_id && 
        new Date(e.created_at) > new Date(enterEvent.created_at)
      );
      
      if (exitEvent) {
        const stayTime = new Date(exitEvent.created_at).getTime() - new Date(enterEvent.created_at).getTime();
        totalStayTime += stayTime;
        stayCount++;
      }
    }
    
    const averageStayTime = stayCount > 0 ? totalStayTime / stayCount : 0;
    const lastEventTime = events.length > 0 ? events[0].created_at : null;
    
    return {
      totalEvents: events.length,
      enterEvents: enterEvents.length,
      exitEvents: exitEvents.length,
      averageStayTime: averageStayTime / (1000 * 60), // Convert to minutes
      lastEventTime,
    };
  }

  async getDeviceStats(deviceId: string): Promise<{
    totalEvents: number;
    lastEventTime: string | null;
    currentLocation: string | null;
    isActive: boolean;
  }> {
    const events = await this.getProximityEventsByDevice(deviceId);
    
    const lastEvent = events.length > 0 ? events[0] : null;
    const currentLocation = lastEvent?.type === 'enter' ? lastEvent.home_location_name : null;
    const isActive = lastEvent ? new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000 : false;
    
    return {
      totalEvents: events.length,
      lastEventTime: lastEvent?.created_at || null,
      currentLocation,
      isActive,
    };
  }

  async getDashboardStats(): Promise<{
    totalLocations: number;
    totalDevices: number;
    totalEvents: number;
    activeDevices: number;
    recentEvents: ProximityEvent[];
  }> {
    const [locations, devices, events] = await Promise.all([
      this.getLocations(),
      this.getDevices(),
      this.getProximityEvents(),
    ]);

    const recentEvents = events.slice(0, 10);
    
    // Calculate active devices (devices with events in the last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const activeDeviceIds = new Set(
      events
        .filter(e => new Date(e.created_at) > oneDayAgo)
        .map(e => e.device_id)
    );

    return {
      totalLocations: locations.length,
      totalDevices: devices.length,
      totalEvents: events.length,
      activeDevices: activeDeviceIds.size,
      recentEvents,
    };
  }
}

export const apiClient = new APIClient();
export default apiClient;
