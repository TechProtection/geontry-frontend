
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SmartDevice, { DeviceType } from '@/components/dashboard/SmartDevice';
import { useData, useDataStats } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Devices: React.FC = () => {
  const { devices, devicesLoading, devicesError, refreshDevices } = useData();
  const { devices: deviceStats } = useDataStats();

  const handleRefresh = async () => {
    await refreshDevices();
  };

  if (devicesLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Cargando dispositivos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (devicesError) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-500">
              <RefreshCw className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error al cargar dispositivos</h3>
              <p className="text-muted-foreground">{devicesError}</p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Smart Devices</h1>
            <p className="text-muted-foreground">
              Gestiona todos tus dispositivos conectados ({deviceStats.total} total, {deviceStats.active} activos)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Dispositivo
            </Button>
          </div>
        </div>

        {/* Estadísticas por tipo */}
        {Object.keys(deviceStats.byType).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dispositivos por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(deviceStats.byType).map(([type, count]) => (
                  <Badge key={type} variant="secondary" className="text-sm">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground mb-4">
                <Plus className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay dispositivos registrados</h3>
              <p className="text-muted-foreground text-center mb-6">
                Comienza agregando tu primer dispositivo IoT
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Dispositivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map(device => (
              <SmartDevice
                key={device.id}
                id={device.id}
                name={device.name}
                type={device.type as DeviceType}
                location={`${device.type} Device`} // Temporal hasta que tengas ubicaciones
                defaultOn={true} // Valor por defecto
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Devices;
