/**
 * Componente de gráficos y métricas avanzadas para GeoEntry
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Area, 
  AreaChart 
} from 'recharts';
import { useProximityEvents } from '@/hooks/useProximityEventsNew';
import { useLocations } from '@/hooks/useLocationsNew';
import { useDevices } from '@/hooks/useDevicesNew';
import { ProximityEvent, Location, Device } from '@/types';
import { 
  Clock, 
  MapPin, 
  Smartphone, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Home, 
  User,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

// Colores para los gráficos
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

interface TimeAnalysis {
  location: string;
  timeInside: number;
  timeOutside: number;
  totalEvents: number;
  averageStay: number;
}

interface ActivityData {
  hour: string;
  enters: number;
  exits: number;
  total: number;
}

interface DeviceActivity {
  device: string;
  events: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

// Hook personalizado para análisis de tiempo
const useTimeAnalysis = (): TimeAnalysis[] => {
  const { data: events } = useProximityEvents();
  const { data: locations } = useLocations();
  
  if (!events || !locations) return [];
  
  const analysis: TimeAnalysis[] = [];
  
  locations.forEach(location => {
    const locationEvents = events.filter(e => e.home_location_id === location.id);
    const enterEvents = locationEvents.filter(e => e.type === 'enter');
    const exitEvents = locationEvents.filter(e => e.type === 'exit');
    
    let totalTimeInside = 0;
    let totalTimeOutside = 0;
    let validPairs = 0;
    
    // Calcular tiempo dentro de cada ubicación
    enterEvents.forEach(enterEvent => {
      const correspondingExit = exitEvents.find(exitEvent => 
        exitEvent.device_id === enterEvent.device_id &&
        new Date(exitEvent.created_at) > new Date(enterEvent.created_at)
      );
      
      if (correspondingExit) {
        const timeInside = differenceInMinutes(
          new Date(correspondingExit.created_at),
          new Date(enterEvent.created_at)
        );
        totalTimeInside += timeInside;
        validPairs++;
      }
    });
    
    // Calcular tiempo fuera (aproximado)
    if (validPairs > 0) {
      const avgTimeInside = totalTimeInside / validPairs;
      totalTimeOutside = Math.max(0, (locationEvents.length * 60) - totalTimeInside);
    }
    
    analysis.push({
      location: location.name,
      timeInside: totalTimeInside,
      timeOutside: totalTimeOutside,
      totalEvents: locationEvents.length,
      averageStay: validPairs > 0 ? totalTimeInside / validPairs : 0,
    });
  });
  
  return analysis;
};

// Hook para análisis de actividad por horas
const useActivityAnalysis = (): ActivityData[] => {
  const { data: events } = useProximityEvents();
  
  if (!events) return [];
  
  const activityByHour: { [key: string]: ActivityData } = {};
  
  // Inicializar todas las horas
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0') + ':00';
    activityByHour[hourStr] = {
      hour: hourStr,
      enters: 0,
      exits: 0,
      total: 0,
    };
  }
  
  // Contar eventos por hora
  events.forEach(event => {
    const hour = new Date(event.created_at).getHours();
    const hourStr = hour.toString().padStart(2, '0') + ':00';
    
    if (event.type === 'enter') {
      activityByHour[hourStr].enters++;
    } else {
      activityByHour[hourStr].exits++;
    }
    activityByHour[hourStr].total++;
  });
  
  return Object.values(activityByHour);
};

// Hook para análisis de dispositivos
const useDeviceAnalysis = (): DeviceActivity[] => {
  const { data: events } = useProximityEvents();
  const { data: devices } = useDevices();
  
  if (!events || !devices) return [];
  
  const deviceAnalysis: DeviceActivity[] = devices.map(device => {
    const deviceEvents = events.filter(e => e.device_id === device.id);
    const lastEvent = deviceEvents[0];
    const isActive = lastEvent ? 
      new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000 : false;
    
    return {
      device: device.name,
      events: deviceEvents.length,
      lastActive: lastEvent ? format(new Date(lastEvent.created_at), 'dd/MM/yyyy HH:mm', { locale: es }) : 'Nunca',
      status: isActive ? 'active' : 'inactive',
    };
  });
  
  return deviceAnalysis.sort((a, b) => b.events - a.events);
};

// Componente de métricas rápidas
const QuickMetrics: React.FC = () => {
  const { data: events } = useProximityEvents();
  const { data: locations } = useLocations();
  const { data: devices } = useDevices();
  
  const today = new Date();
  const todayEvents = events?.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate >= startOfDay(today) && eventDate <= endOfDay(today);
  }) || [];
  
  const activeDevices = devices?.filter(device => {
    const lastEvent = events?.find(e => e.device_id === device.id);
    return lastEvent && new Date().getTime() - new Date(lastEvent.created_at).getTime() < 24 * 60 * 60 * 1000;
  }) || [];
  
  const occupiedLocations = locations?.filter(location => {
    const lastEvent = events?.find(e => e.home_location_id === location.id);
    return lastEvent?.type === 'enter';
  }) || [];
  
  const metrics = [
    {
      title: 'Eventos Hoy',
      value: todayEvents.length,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Dispositivos Activos',
      value: activeDevices.length,
      icon: Smartphone,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ubicaciones Ocupadas',
      value: occupiedLocations.length,
      icon: Home,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Ubicaciones',
      value: locations?.length || 0,
      icon: MapPin,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Componente de gráfico de tiempo dentro/fuera
const TimeChart: React.FC = () => {
  const timeAnalysis = useTimeAnalysis();
  
  const chartData = timeAnalysis.map(item => ({
    location: item.location,
    'Tiempo Dentro (min)': item.timeInside,
    'Tiempo Fuera (min)': item.timeOutside,
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Análisis de Tiempo por Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Tiempo Dentro (min)" fill="#3b82f6" />
            <Bar dataKey="Tiempo Fuera (min)" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de gráfico de actividad por horas
const ActivityChart: React.FC = () => {
  const activityData = useActivityAnalysis();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5" />
          Actividad por Horas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="enters" stackId="1" stroke="#10b981" fill="#10b981" />
            <Area type="monotone" dataKey="exits" stackId="1" stroke="#ef4444" fill="#ef4444" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de distribución de eventos
const EventDistribution: React.FC = () => {
  const { data: events } = useProximityEvents();
  const { data: locations } = useLocations();
  
  if (!events || !locations) return null;
  
  const distributionData = locations.map(location => ({
    name: location.name,
    value: events.filter(e => e.home_location_id === location.id).length,
  })).filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Distribución de Eventos por Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de análisis de dispositivos
const DeviceAnalysisCard: React.FC = () => {
  const deviceAnalysis = useDeviceAnalysis();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Análisis de Dispositivos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deviceAnalysis.map((device, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium">{device.device}</p>
                  <p className="text-sm text-muted-foreground">
                    Último evento: {device.lastActive}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{device.events}</p>
                <p className="text-sm text-muted-foreground">eventos</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal
const AdvancedAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Métricas rápidas */}
      <QuickMetrics />
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeChart />
        <ActivityChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventDistribution />
        <DeviceAnalysisCard />
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
