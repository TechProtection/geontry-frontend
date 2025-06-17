import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useData, useDataStats } from '@/contexts/DataContext';
import { Loader2, RefreshCw, Plus, Smartphone, Lightbulb, Thermometer, Wind } from 'lucide-react';

const DeviceIcons = {
  smartphone: Smartphone,
  lighting: Lightbulb,
  climate: Thermometer,
  ventilation: Wind,
};

const Devices: React.FC = () => {
  const { profile } = useAuth();
  const { 
    devices, 
    devicesLoading: loading, 
    devicesError: error, 
    addDevice, 
    refreshDevices,
    devicesLastFetch: lastFetch 
  } = useData();
  const { devices: deviceStats } = useDataStats();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
  });

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.type) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const success = await addDevice({
      name: newDevice.name,
      type: newDevice.type,
      profile_id: profile!.id,
    });

    if (success) {
      setAddDialogOpen(false);
      setNewDevice({ name: '', type: '' });
      toast({
        title: "Dispositivo agregado",
        description: "El dispositivo se ha agregado exitosamente",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo agregar el dispositivo",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await refreshDevices();
    toast({
      title: "Lista actualizada",
      description: "La lista de dispositivos se ha actualizado",
    });
  };

  if (loading) {
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

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-500">
              <RefreshCw className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error al cargar dispositivos</h3>
              <p className="text-muted-foreground">{error}</p>
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
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Dispositivos</h1>            
            <p className="text-muted-foreground">
              Gestiona tus dispositivos IoT desde aquí ({deviceStats.total} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Dispositivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Dispositivo</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo dispositivo IoT en tu cuenta
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="device-name">Nombre del dispositivo</Label>
                    <Input
                      id="device-name"
                      value={newDevice.name}
                      onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                      placeholder="Ej: Luz del salón"
                    />
                  </div>
                  <div>
                    <Label htmlFor="device-type">Tipo de dispositivo</Label>
                    <Select 
                      value={newDevice.type} 
                      onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lighting">Iluminación</SelectItem>
                        <SelectItem value="climate">Climatización</SelectItem>
                        <SelectItem value="security">Seguridad</SelectItem>
                        <SelectItem value="entertainment">Entretenimiento</SelectItem>
                        <SelectItem value="appliance">Electrodoméstico</SelectItem>
                        <SelectItem value="sensor">Sensor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddDevice}>
                    Agregar Dispositivo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Información de caché en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Información de Caché</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">              <p><strong>Dispositivos cargados:</strong> {devices.length}</p>
              <p><strong>Última actualización:</strong> {lastFetch ? new Date(lastFetch).toLocaleString() : 'Nunca'}</p>
              <p><strong>Estado:</strong> {loading ? 'Cargando' : 'Completo'}</p>
              <p><strong>Estadísticas:</strong> Total: {deviceStats.total}, Activos: {deviceStats.active}</p>
            </CardContent>
          </Card>
        )}

        {/* Lista de dispositivos */}
        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground mb-4">
                <Smartphone className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hay dispositivos registrados</h3>
              <p className="text-muted-foreground text-center mb-6">
                Comienza agregando tu primer dispositivo IoT
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Dispositivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => {
              const IconComponent = DeviceIcons[device.type as keyof typeof DeviceIcons] || Smartphone;
              
              return (
                <Card key={device.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{device.name}</CardTitle>
                          <CardDescription className="text-sm">
                            Tipo: {device.type}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">Activo</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      <p>ID: {device.id}</p>
                      <p>Registrado: {new Date(device.created_at || '').toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Devices;
