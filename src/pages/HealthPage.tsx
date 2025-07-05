/**
 * Página de estado del sistema
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Server, 
  Wifi,
  RefreshCw 
} from 'lucide-react';
import { useApiRoot, useHealth, useCorsTest } from '../hooks/useHealth';

/**
 * Página de estado del sistema
 */
const HealthPage: React.FC = () => {
  const { data: apiRoot, isLoading: apiLoading, error: apiError, refetch: refetchApi } = useApiRoot();
  const { data: health, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useHealth();
  const { data: corsTest, isLoading: corsLoading, error: corsError, refetch: refetchCors } = useCorsTest();

  const handleRefreshAll = () => {
    refetchApi();
    refetchHealth();
  };

  const handleTestCors = () => {
    refetchCors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estado del Sistema</h1>
          <p className="text-muted-foreground">
            Monitoreo de la salud y conectividad del sistema
          </p>
        </div>
        <Button onClick={handleRefreshAll} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Estado de la API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Estado de la API
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apiLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <span className="text-sm">Verificando...</span>
              </div>
            ) : apiError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error de conexión: {apiError.message}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Conectado</span>
                </div>
                <Badge variant="default">
                  Estado: {apiRoot?.status || 'OK'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del servidor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Información del Servidor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : healthError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Error: {healthError.message}
                </AlertDescription>
              </Alert>
            ) : health ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Versión</p>
                  <p className="font-medium">{health.version}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tiempo Activo</p>
                  <p className="font-medium">
                    {Math.floor(health.uptime / 3600)} horas
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Actualización</p>
                  <p className="font-medium text-sm">
                    {new Date(health.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Test CORS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Configuración CORS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handleTestCors} 
                disabled={corsLoading}
                className="w-full"
              >
                {corsLoading ? 'Probando...' : 'Probar CORS'}
              </Button>
              
              {corsError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    CORS Error: {corsError.message}
                  </AlertDescription>
                </Alert>
              ) : corsTest ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    CORS configurado correctamente
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Respuesta completa de la API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Respuesta de /api</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {apiRoot ? JSON.stringify(apiRoot, null, 2) : 'No disponible'}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respuesta de /api/health</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
              {health ? JSON.stringify(health, null, 2) : 'No disponible'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthPage;
