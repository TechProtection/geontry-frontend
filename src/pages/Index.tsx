
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Map from '@/components/dashboard/Map';
import StatsCard from '@/components/dashboard/StatsCard';
import CacheMonitor from '@/components/debug/CacheMonitor';
import { Home, Lock, Lightbulb, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData, useDataStats, useAppState } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index: React.FC = () => {
  const { profile } = useAuth();
  const { devices, refreshDevices } = useData();
  const { devices: deviceStats } = useDataStats();
  const { isAppReady } = useAppState();

  const handleRefreshData = async () => {
    await refreshDevices();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  Bienvenido{profile?.full_name ? `, ${profile.full_name}` : ''} a GeoEntry
                </h2>
                <p className="text-muted-foreground max-w-3xl">
                  GeoEntry es un sistema inteligente que activa tu hogar cuando estás cerca. 
                  Nuestra solución incluye cerraduras electrónicas, iluminación automática con sensores de brillo, 
                  control ambiental (temperatura) y fragancias para el hogar - todo en una solución integrada.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Badge variant="secondary">
                    {deviceStats.total} dispositivos
                  </Badge>
                  <Badge variant="secondary">
                    {deviceStats.active} activos
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshData}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar datos
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Lock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Smart Lock</h3>
              <p className="text-sm text-muted-foreground">Control automático de puertas</p>
            </div>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">Smart Lighting</h3>
              <p className="text-sm text-muted-foreground">Iluminación sensible al brillo</p>
            </div>
          </div>
          <div className="bg-cyan-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-full">
              <Thermometer className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-medium">Climate Control</h3>
              <p className="text-sm text-muted-foreground">Gestión de temperatura</p>
            </div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Droplets className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Aromatic System</h3>
              <p className="text-sm text-muted-foreground">Control de fragancia del hogar</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px]">
            <Map />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Estadísticas de Uso</h2>
            <div className="space-y-4">
              <StatsCard title="Energía Usada" value="124 kWh" change="+12%" type="increase" />
              <StatsCard 
                title="Dispositivos Activos" 
                value={`${deviceStats.active}/${deviceStats.total}`} 
                change={`+${deviceStats.active}`} 
                type="neutral" 
              />
              <StatsCard title="Temperatura" value="22°C" change="-2°C" type="decrease" />
            </div>
          </div>
        </div>        
      </div>
    </MainLayout>
  );
};

export default Index;
