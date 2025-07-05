/**
 * Página de lista de eventos de proximidad
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { useProximityEvents } from '../../hooks/useProximityEvents';
import { useLog } from '../../contexts/LogContext';
import { ProximityEvent } from '../../types/api';

/**
 * Página de lista de eventos de proximidad
 */
const EventList: React.FC = () => {
  const navigate = useNavigate();
  const { data: events, isLoading, error } = useProximityEvents();
  const { addLog } = useLog();

  // Agregar eventos a los logs cuando se cargan
  React.useEffect(() => {
    if (events) {
      events.slice(0, 5).forEach(event => {
        addLog(event);
      });
    }
  }, [events, addLog]);

  const handleView = (event: ProximityEvent) => {
    navigate(`/proximity-events/${event.id}`);
  };

  const columns = [
    {
      key: 'type',
      label: 'Tipo',
      render: (type: string) => (
        <Badge variant={type === 'enter' ? 'default' : 'secondary'}>
          {type === 'enter' ? 'Entrada' : 'Salida'}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'user.full_name',
      label: 'Usuario',
      render: (_, event: ProximityEvent) => event.user?.full_name || 'Usuario desconocido',
    },
    {
      key: 'home_location_name',
      label: 'Ubicación',
      render: (location: string) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {location}
        </div>
      ),
    },
    {
      key: 'device.name',
      label: 'Dispositivo',
      render: (_, event: ProximityEvent) => event.device?.name || 'Dispositivo desconocido',
    },
    {
      key: 'created_at',
      label: 'Fecha y Hora',
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {new Date(date).toLocaleString()}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos de Proximidad</h1>
          <p className="text-muted-foreground">
            Historial de eventos de entrada y salida
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los eventos: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Eventos de Proximidad</h1>
        <p className="text-muted-foreground">
          Historial completo de eventos de entrada y salida del sistema
        </p>
      </div>

      <DataTable
        data={events || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar eventos..."
        onView={handleView}
        showActions={true}
        actions={{ view: true, edit: false, delete: false }}
        emptyMessage="No hay eventos de proximidad registrados"
      />
    </div>
  );
};

export default EventList;
