/**
 * Componente de depuración para verificar el estado del AuthContext
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AuthDebugComponent: React.FC = () => {
  const { user, profile, session, loading } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          AuthContext Debug Status
        </CardTitle>
        <CardDescription>
          Estado actual del contexto de autenticación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de carga */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Loading State:</span>
          <Badge variant={loading ? "secondary" : "default"}>
            {loading ? "Cargando..." : "Completado"}
          </Badge>
        </div>

        {/* Usuario */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Usuario:</span>
          <div className="flex items-center gap-2">
            {user ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={user ? "default" : "destructive"}>
              {user ? "Autenticado" : "No autenticado"}
            </Badge>
          </div>
        </div>

        {/* Sesión */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Sesión:</span>
          <div className="flex items-center gap-2">
            {session ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={session ? "default" : "destructive"}>
              {session ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>

        {/* Perfil */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Perfil:</span>
          <div className="flex items-center gap-2">
            {profile ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={profile ? "default" : "destructive"}>
              {profile ? "Cargado" : "No disponible"}
            </Badge>
          </div>
        </div>

        {/* Detalles del usuario */}
        {user && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <h4 className="font-medium">Detalles del Usuario:</h4>
            <div className="text-sm space-y-1">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Username:</strong> {profile?.username || 'No definido'}</div>
              <div><strong>Creado:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Estado del contexto */}
        <div className="text-xs text-muted-foreground">
          <strong>AuthContext Status:</strong> 
          {loading ? " Inicializando..." : " Listo ✓"}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugComponent;
