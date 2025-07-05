/**
 * Cliente API para GeoEntry
 */

import { Location, Device, ProximityEvent, HealthCheck, CreateLocationRequest, UpdateLocationRequest, CreateDeviceRequest, UpdateDeviceRequest } from '@/types';

const API_BASE_URL = 'https://geoentry-rest-api.onrender.com/api';

class APIClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

  // Health Check
  async getHealth(): Promise<HealthCheck> {
    return this.request<HealthCheck>('/health');
  }

  // Dashboard Stats (calculados del lado del cliente)
  async getDashboardStats() {
    const [locations, devices, events] = await Promise.all([
      this.getLocations(),
      this.getDevices(),
      this.getProximityEvents(),
    ]);

    const activeDevices = devices.filter(device => {
      const lastEvent = events.find(e => e.device_id === device.id);
      return lastEvent && new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000;
    });

    const locationsWithEvents = locations.filter(location => 
      events.some(e => e.home_location_id === location.id)
    );

    // Calcular tiempo promedio dentro/fuera
    let totalTimeInside = 0;
    let totalTimeOutside = 0;
    let validPairs = 0;

    locations.forEach(location => {
      const locationEvents = events.filter(e => e.home_location_id === location.id);
      const enterEvents = locationEvents.filter(e => e.type === 'enter');
      const exitEvents = locationEvents.filter(e => e.type === 'exit');

      enterEvents.forEach(enterEvent => {
        const correspondingExit = exitEvents.find(exitEvent => 
          exitEvent.device_id === enterEvent.device_id &&
          new Date(exitEvent.created_at) > new Date(enterEvent.created_at)
        );

        if (correspondingExit) {
          const timeInside = new Date(correspondingExit.created_at).getTime() - new Date(enterEvent.created_at).getTime();
          totalTimeInside += timeInside;
          validPairs++;
        }
      });
    });

    const avgTimeInside = validPairs > 0 ? totalTimeInside / validPairs / (1000 * 60) : 0; // en minutos
    const avgTimeOutside = Math.max(0, 720 - avgTimeInside); // asumiendo 12 horas de actividad

    // Ubicación más activa
    const locationEventCounts = locations.map(location => ({
      name: location.name,
      events: events.filter(e => e.home_location_id === location.id).length,
    }));

    const mostActiveLocation = locationEventCounts.reduce((max, location) => 
      location.events > max.events ? location : max, 
      { name: '', events: 0 }
    );

    return {
      totalLocations: locations.length,
      totalDevices: devices.length,
      totalEvents: events.length,
      activeDevices: activeDevices.length,
      locationsWithEvents: locationsWithEvents.length,
      averageTimeInside: Math.round(avgTimeInside),
      averageTimeOutside: Math.round(avgTimeOutside),
      mostActiveLocation,
      recentEvents: events.slice(0, 10),
    };
  }

  // Estadísticas de ubicación
  async getLocationStats(locationId: string) {
    const events = await this.getProximityEvents();
    const locationEvents = events.filter(e => e.home_location_id === locationId);
    
    const enterEvents = locationEvents.filter(e => e.type === 'enter');
    const exitEvents = locationEvents.filter(e => e.type === 'exit');
    
    let totalTimeInside = 0;
    let validPairs = 0;
    
    enterEvents.forEach(enterEvent => {
      const correspondingExit = exitEvents.find(exitEvent => 
        exitEvent.device_id === enterEvent.device_id &&
        new Date(exitEvent.created_at) > new Date(enterEvent.created_at)
      );
      
      if (correspondingExit) {
        const timeInside = new Date(correspondingExit.created_at).getTime() - new Date(enterEvent.created_at).getTime();
        totalTimeInside += timeInside;
        validPairs++;
      }
    });
    
    const lastEvent = locationEvents[0];
    const isCurrentlyInside = lastEvent?.type === 'enter';
    
    return {
      totalEvents: locationEvents.length,
      enterEvents: enterEvents.length,
      exitEvents: exitEvents.length,
      averageStayTime: validPairs > 0 ? totalTimeInside / validPairs / (1000 * 60) : 0,
      lastEventTime: lastEvent?.created_at || null,
      isCurrentlyInside,
    };
  }

  // Estadísticas de dispositivo
  async getDeviceStats(deviceId: string) {
    const events = await this.getProximityEvents();
    const deviceEvents = events.filter(e => e.device_id === deviceId);
    
    const lastEvent = deviceEvents[0];
    const isActive = lastEvent ? 
      new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000 : false;
    
    const currentLocation = lastEvent?.type === 'enter' ? lastEvent.home_location_name : null;
    
    return {
      totalEvents: deviceEvents.length,
      lastEventTime: lastEvent?.created_at || null,
      currentLocation,
      isActive,
      batteryLevel: Math.floor(Math.random() * 100) + 1, // Simulado
      signalStrength: Math.floor(Math.random() * 100) + 1, // Simulado
    };
  }
}

export const apiClient = new APIClient();
