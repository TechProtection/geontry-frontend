/**
 * Componente de mapa interactivo con Leaflet
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Smartphone } from 'lucide-react';

// Fix para los iconos de Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
  is_active: boolean;
  profile_id?: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

interface MapProps {
  locations: Location[];
  devices?: Device[];
  center?: LatLngTuple;
  zoom?: number;
  height?: string;
  onLocationClick?: (location: Location) => void;
  showDevices?: boolean;
  showRadius?: boolean;
}

const DEFAULT_CENTER: LatLngTuple = [-12.0464, -77.0428]; // Lima, Perú

/**
 * Componente para ajustar la vista del mapa
 */
const MapController: React.FC<{ center: LatLngTuple; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

/**
 * Crear icono personalizado para dispositivos
 */
const createDeviceIcon = (type: string, isActive: boolean) => {
  const color = isActive ? '#22c55e' : '#ef4444';
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
        <path d="M2 17h20v2H2zm1.15-4.05L4 11l.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95.85-1.95.85 1.95L20 11l-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95-.85-1.95-.85 1.95z"/>
      </svg>
    </div>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(iconHtml)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const InteractiveMap: React.FC<MapProps> = ({
  locations,
  devices = [],
  center = DEFAULT_CENTER,
  zoom = 13,
  height = '400px',
  onLocationClick,
  showDevices = false,
  showRadius = true,
}) => {
  // Calcular el centro automáticamente si hay ubicaciones
  const mapCenter: LatLngTuple = React.useMemo(() => {
    if (locations.length > 0) {
      const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
      return [avgLat, avgLng];
    }
    return center;
  }, [locations, center]);

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Renderizar ubicaciones */}
        {locations.map((location) => (
          <React.Fragment key={location.id}>
            <Marker
              position={[location.latitude, location.longitude]}
              eventHandlers={{
                click: () => onLocationClick?.(location),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    <h3 className="font-semibold">{location.name}</h3>
                  </div>
                  
                  {location.address && (
                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={location.is_active ? 'default' : 'secondary'}>
                      {location.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Radio: {location.radius}m
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div>Lat: {location.latitude.toFixed(6)}</div>
                    <div>Lng: {location.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Mostrar círculo de radio si está habilitado */}
            {showRadius && (
              <Circle
                center={[location.latitude, location.longitude]}
                radius={location.radius}
                pathOptions={{
                  color: location.is_active ? '#22c55e' : '#ef4444',
                  fillColor: location.is_active ? '#22c55e' : '#ef4444',
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Renderizar dispositivos si está habilitado */}
        {showDevices && devices
          .filter(device => device.latitude && device.longitude)
          .map((device) => (
            <Marker
              key={device.id}
              position={[device.latitude!, device.longitude!]}
              icon={createDeviceIcon(device.type, device.is_active)}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-4 w-4" />
                    <h3 className="font-semibold">{device.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={device.is_active ? 'default' : 'secondary'}>
                      {device.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {device.type}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <div>Lat: {device.latitude!.toFixed(6)}</div>
                    <div>Lng: {device.longitude!.toFixed(6)}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
