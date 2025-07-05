/**
 * Página del Dashboard principal
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import LogViewer from '../components/LogViewer';
import { useDevices } from '../hooks/useDevices';
import { useLocations } from '../hooks/useLocations';
import { useProfiles } from '../hooks/useProfiles';
import { useProximityEvents } from '../hooks/useProximityEvents';
import { useHealth } from '../hooks/useHealth';
import { 
  Smartphone, 
  MapPin, 
  Users, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';

/**
 * Componente principal del Dashboard
 */
const Dashboard: React.FC = () => {
  const { data: devices, isLoading: devicesLoading } = useDevices();
  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const { data: proximityEvents, isLoading: eventsLoading } = useProximityEvents();
  const { data: health, isLoading: healthLoading } = useHealth();

  // Calcular estadísticas
  const activeDevices = devices?.filter(d => d.is_active).length || 0;
  const activeLocations = locations?.filter(l => l.is_active).length || 0;
  const todayEvents = proximityEvents?.filter(e => {
    const eventDate = new Date(e.created_at);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }).length || 0;

  // Eventos recientes (últimos 10)
  const recentEvents = proximityEvents?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema GeoEntry
        </p>
      </div>

      {/* Estado de salud del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span className="text-sm text-muted-foreground">
                Verificando estado del sistema...
              </span>
            </div>
          ) : health ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sistema operativo. Versión: {health.version} | 
                Tiempo activo: {Math.floor(health.uptime / 3600)} horas
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No se puede conectar con el servidor. Verifique la conexión.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Dispositivos"
          value={devices?.length || 0}
          description={`${activeDevices} activos`}
          icon={Smartphone}
          change={{
            value: activeDevices,
            type: 'neutral'
          }}
          isLoading={devicesLoading}
        />
        
        <StatsCard
          title="Ubicaciones"
          value={locations?.length || 0}
          description={`${activeLocations} activas`}
          icon={MapPin}
          change={{
            value: activeLocations,
            type: 'neutral'
          }}
          isLoading={locationsLoading}
        />
        
        <StatsCard
          title="Usuarios"
          value={profiles?.length || 0}
          description="Perfiles registrados"
          icon={Users}
          isLoading={profilesLoading}
        />
        
        <StatsCard
          title="Eventos Hoy"
          value={todayEvents}
          description="Eventos de proximidad"
          icon={Calendar}
          change={{
            value: todayEvents > 0 ? `+${todayEvents}` : '0',
            type: todayEvents > 0 ? 'increase' : 'neutral'
          }}
          isLoading={eventsLoading}
        />
      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border rounded animate-pulse">
                    <div className="h-4 w-4 bg-gray-300 rounded" />
                    <div className="h-4 flex-1 bg-gray-300 rounded" />
                    <div className="h-4 w-16 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No hay eventos recientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`h-3 w-3 rounded-full ${
                      event.type === 'enter' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {event.user?.full_name || 'Usuario'} {event.type === 'enter' ? 'entró a' : 'salió de'} {event.home_location_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logs del sistema */}
        <LogViewer 
          title="Logs del Sistema" 
          maxHeight="400px" 
          showActions={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
