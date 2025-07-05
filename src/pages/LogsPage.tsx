/**
 * Página de logs del sistema
 */

import React from 'react';
import LogViewer from '../components/LogViewer';

/**
 * Página dedicada a los logs del sistema
 */
const LogsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs del Sistema</h1>
        <p className="text-muted-foreground">
          Registro completo de actividades del sistema GeoEntry
        </p>
      </div>

      <LogViewer 
        title="Registro de Actividades" 
        maxHeight="calc(100vh - 300px)"
        showActions={true}
      />
    </div>
  );
};

export default LogsPage;
