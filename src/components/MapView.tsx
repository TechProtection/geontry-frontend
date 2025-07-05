/**
 * Mapa interactivo para visualizar ubicaciones de GeoEntry
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocations } from '@/hooks/useLocationsNew';
import { useDevices } from '@/hooks/useDevicesNew';
import { useProximityEvents } from '@/hooks/useProximityEventsNew';
import { Location, Device } from '@/types';
import { MapPin, Home, Smartphone, Activity } from 'lucide-react';

// Iconos personalizados para el mapa
const createCustomIcon = (color: string, size: number = 32) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const locationIcon = createCustomIcon('#3b82f6', 40);
const deviceIcon = createCustomIcon('#10b981', 32);

// Componente principal del mapa
const InteractiveMap: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([-12.0677412, -77.0664982]);
  const [mapZoom, setMapZoom] = useState(13);

  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: devices, isLoading: devicesLoading } = useDevices();
  const { data: events } = useProximityEvents();

  useEffect(() => {
    if (locations && locations.length > 0) {
      const firstLocation = locations[0];
      setMapCenter([firstLocation.latitude, firstLocation.longitude]);
    }
  }, [locations]);

  const getLocationStatus = (location: Location) => {
    const locationEvents = events?.filter(event => event.home_location_id === location.id) || [];
    const recentEvents = locationEvents.filter(event => {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      return now.getTime() - eventDate.getTime() < 24 * 60 * 60 * 1000;
    });
    
    const lastEvent = locationEvents[0];
    const isCurrentlyOccupied = lastEvent?.type === 'enter';
    
    return {
      isCurrentlyOccupied,
      recentEventsCount: recentEvents.length,
      lastEventTime: lastEvent?.created_at,
    };
  };

  const getDeviceCurrentLocation = (device: Device) => {
    const deviceEvents = events?.filter(event => event.device_id === device.id) || [];
    const lastEvent = deviceEvents[0];
    return lastEvent?.type === 'enter' ? lastEvent.home_location_name : null;
  };

  if (locationsLoading || devicesLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando mapa...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Ubicaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Ubicaciones ({locations?.length || 0})</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Dispositivos Activos</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <div className="w-4 h-4 bg-purple-500 rounded-full opacity-50"></div>
              <span className="text-sm font-medium">Radio de Geofencing</span>
            </div>
          </div>

          <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full z-0"
              style={{ minHeight: '600px', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {locations?.map((location) => {
                const status = getLocationStatus(location);
                return (
                  <React.Fragment key={location.id}>
                    <Marker
                      position={[location.latitude, location.longitude]}
                      icon={locationIcon}
                    >
                      <Popup className="min-w-[280px]">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              <Home className="h-5 w-5" />
                              {location.name}
                            </h3>
                            <Badge variant={status.isCurrentlyOccupied ? "default" : "secondary"}>
                              {status.isCurrentlyOccupied ? "Ocupado" : "Libre"}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Radio:</span>
                              <span>{location.radius} metros</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Eventos (24h):</span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {status.recentEventsCount}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Estado:</span>
                              <span className={`font-medium ${location.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                {location.is_active ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            
                            {location.address && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <strong>Dirección:</strong><br />
                                {location.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    
                    <Circle
                      center={[location.latitude, location.longitude]}
                      radius={location.radius}
                      pathOptions={{
                        color: location.is_active ? '#3b82f6' : '#6b7280',
                        fillColor: location.is_active ? '#3b82f6' : '#6b7280',
                        fillOpacity: status.isCurrentlyOccupied ? 0.3 : 0.1,
                        weight: 2,
                      }}
                    />
                  </React.Fragment>
                );
              })}

              {devices?.map((device) => {
                const currentLocation = getDeviceCurrentLocation(device);
                const locationData = locations?.find(loc => loc.name === currentLocation);
                
                if (!locationData) return null;
                
                return (
                  <Marker
                    key={device.id}
                    position={[locationData.latitude, locationData.longitude]}
                    icon={deviceIcon}
                  >
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                          <Smartphone className="h-5 w-5" />
                          {device.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Tipo:</span>
                            <span>{device.type}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Ubicación:</span>
                            <span className="text-blue-600">{currentLocation}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Usuario:</span>
                            <span>{device.profile?.full_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="text-xs">{device.profile?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Ubicaciones Monitoreadas</h4>
              <p className="text-2xl font-bold text-blue-600">{locations?.length || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Dispositivos Registrados</h4>
              <p className="text-2xl font-bold text-green-600">{devices?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMap;
