/**
 * Página de eventos de proximidad
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Smartphone, ArrowUpCircle, ArrowDownCircle, Search, Filter, Download } from 'lucide-react';
import { useProximityEventsSimple } from '@/hooks/useProximityEventsSimple';
import { useLocationsSimple } from '@/hooks/useLocationsSimple';
import { useDevicesSimple } from '@/hooks/useDevicesSimple';
import { ProximityEvent } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'enter' | 'exit'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  
  const { data: events, isLoading: eventsLoading } = useProximityEventsSimple();
  const { data: locations } = useLocationsSimple();
  const { data: devices } = useDevicesSimple();

  const filteredEvents = events?.filter(event => {
    const deviceName = event.device?.name || 'Dispositivo desconocido';
    const matchesSearch = event.home_location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesLocation = filterLocation === 'all' || event.home_location_name === filterLocation;
    const matchesDevice = filterDevice === 'all' || deviceName === filterDevice;
    
    return matchesSearch && matchesType && matchesLocation && matchesDevice;
  }) || [];

  const getEventStats = () => {
    if (!events) return { total: 0, today: 0, enters: 0, exits: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.created_at);
      return eventDate >= today;
    });
    
    return {
      total: events.length,
      today: todayEvents.length,
      enters: events.filter(e => e.type === 'enter').length,
      exits: events.filter(e => e.type === 'exit').length
    };
  };

  const stats = getEventStats();

  if (eventsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Eventos de Proximidad</h1>
            <p className="text-muted-foreground">
              Historial completo de entradas y salidas de dispositivos
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Cargando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Eventos de Proximidad</h1>
          <p className="text-muted-foreground mt-1">
            Historial completo de entradas y salidas de dispositivos
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Eventos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eventos Hoy</p>
                <p className="text-2xl font-bold text-green-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entradas</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.enters}</p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Salidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.exits}</p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: 'all' | 'enter' | 'exit') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="enter">Entradas</SelectItem>
                <SelectItem value="exit">Salidas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ubicaciones</SelectItem>
                {locations?.map(location => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los dispositivos</SelectItem>
                {devices?.map(device => (
                  <SelectItem key={device.id} value={device.name}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historial de Eventos ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    event.type === 'enter' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {event.type === 'enter' ? (
                      <ArrowUpCircle className="h-5 w-5" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={event.type === 'enter' ? 'default' : 'destructive'}>
                        {event.type === 'enter' ? 'Entrada' : 'Salida'}
                      </Badge>
                      <span className="font-medium">{event.device?.name || 'Dispositivo desconocido'}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.home_location_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-4 w-4" />
                        <span>{event.device?.name || 'Dispositivo desconocido'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    {format(new Date(event.created_at), 'dd/MM/yyyy', { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.created_at), 'HH:mm:ss', { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || filterType !== 'all' || filterLocation !== 'all' || filterDevice !== 'all'
                  ? 'No se encontraron eventos'
                  : 'No hay eventos registrados'
                }
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' || filterLocation !== 'all' || filterDevice !== 'all'
                  ? 'Intenta ajustar los filtros para encontrar eventos'
                  : 'Los eventos aparecerán aquí cuando los dispositivos entren o salgan de las ubicaciones'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
