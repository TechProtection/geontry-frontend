/**
 * Página de lista de ubicaciones
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LocationList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ubicaciones</h1>
        <p className="text-muted-foreground">
          Gestión de ubicaciones y geocercas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La gestión de ubicaciones estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationList;
