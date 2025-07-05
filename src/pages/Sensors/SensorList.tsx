/**
 * Página de lista de sensores
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Activity } from 'lucide-react';

const SensorList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sensores</h1>
          <p className="text-muted-foreground">
            Gestión de sensores del sistema
          </p>
        </div>
        <Button disabled className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Sensor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sin datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No hay sensores configurados</h3>
            <p className="text-muted-foreground mb-4">
              La funcionalidad de sensores estará disponible próximamente.
            </p>
            <Button disabled>
              Configurar Sensores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorList;
