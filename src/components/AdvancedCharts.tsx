/**
 * Componentes de gráficos avanzados para métricas
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, MapPin, Activity } from 'lucide-react';

interface TimeSpentData {
  date: string;
  hoursInside: number;
  hoursOutside: number;
  totalHours: number;
}

interface LocationActivityData {
  name: string;
  entries: number;
  exits: number;
  avgDuration: number;
  color: string;
}

interface UserActivityData {
  name: string;
  totalEvents: number;
  timeInside: number;
  timeOutside: number;
}

interface DeviceStatusData {
  name: string;
  value: number;
  color: string;
}

/**
 * Gráfico de tiempo dentro vs fuera por día
 */
export const TimeSpentChart: React.FC<{ data: TimeSpentData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Tiempo Dentro vs Fuera (Últimos 7 días)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          />
          <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}h`,
              name === 'hoursInside' ? 'Tiempo Dentro' : 'Tiempo Fuera'
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="hoursInside"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.6}
            name="Tiempo Dentro"
          />
          <Area
            type="monotone"
            dataKey="hoursOutside"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Tiempo Fuera"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

/**
 * Gráfico de actividad por ubicación
 */
export const LocationActivityChart: React.FC<{ data: LocationActivityData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Actividad por Ubicación
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entries" fill="#3b82f6" name="Entradas" />
          <Bar dataKey="exits" fill="#f59e0b" name="Salidas" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

/**
 * Gráfico circular de estado de dispositivos
 */
export const DeviceStatusChart: React.FC<{ data: DeviceStatusData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Estado de Dispositivos
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

/**
 * Tabla de actividad de usuarios
 */
export const UserActivityTable: React.FC<{ data: UserActivityData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Actividad de Usuarios
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{user.name}</h4>
              <p className="text-sm text-muted-foreground">
                {user.totalEvents} eventos registrados
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-green-600">
                  {user.timeInside.toFixed(1)}h
                </div>
                <div className="text-xs text-muted-foreground">Dentro</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-red-600">
                  {user.timeOutside.toFixed(1)}h
                </div>
                <div className="text-xs text-muted-foreground">Fuera</div>
              </div>
              <Badge variant="outline">
                {((user.timeInside / (user.timeInside + user.timeOutside)) * 100).toFixed(0)}% dentro
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Métricas rápidas en tarjetas
 */
interface QuickMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

export const QuickMetrics: React.FC<{ metrics: QuickMetric[] }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {metrics.map((metric, index) => (
      <Card key={index}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {metric.change}
              </p>
            </div>
            <div className="text-muted-foreground">
              {metric.icon}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

/**
 * Gráfico de línea de eventos en tiempo real
 */
export const RealTimeEventsChart: React.FC<{ data: any[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Eventos en Tiempo Real (Última hora)
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString('es-ES')}
          />
          <Line 
            type="monotone" 
            dataKey="events" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
