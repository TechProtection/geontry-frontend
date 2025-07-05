/**
 * Ejemplo de uso del AuthContext mejorado con Supabase
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Componente de ejemplo que demuestra todas las funcionalidades del AuthContext
 */
const AuthExampleComponent: React.FC = () => {
  const { 
    user, 
    profile, 
    session, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    refreshProfile, 
    updateProfile 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Estados para actualización de perfil
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [newAvatarUrl, setNewAvatarUrl] = useState(profile?.avatar_url || '');

  const handleAuth = async () => {
    try {
      if (isSignUpMode) {
        const result = await signUp(email, password, username);
        if (result.error) {
          toast.error(result.error.message);
        } else {
          toast.success('Registro exitoso. Verifica tu email.');
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          toast.error(result.error.message);
        } else {
          toast.success('¡Bienvenido!');
        }
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success('Sesión cerrada correctamente');
    }
  };

  const handleRefreshProfile = async () => {
    setUpdating(true);
    try {
      const updatedProfile = await refreshProfile();
      if (updatedProfile) {
        toast.success('Perfil actualizado');
      } else {
        toast.error('No se pudo cargar el perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const result = await updateProfile({
        username: newUsername || null,
        avatar_url: newAvatarUrl || null
      });
      
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Perfil actualizado exitosamente');
      }
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AuthContext - Ejemplo de Uso</h1>
        <p className="text-muted-foreground">Demostración de todas las funcionalidades de autenticación con Supabase</p>
      </div>

      {/* Estado de Autenticación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {user ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            Estado de Autenticación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Usuario</Label>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? "Autenticado" : "No autenticado"}
              </Badge>
            </div>
            <div>
              <Label>Sesión</Label>
              <Badge variant={session ? "default" : "secondary"}>
                {session ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <div>
              <Label>Perfil</Label>
              <Badge variant={profile ? "default" : "secondary"}>
                {profile ? "Cargado" : "No disponible"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {!user ? (
        /* Formulario de Login/Registro */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isSignUpMode ? 'Registro' : 'Iniciar Sesión'}
            </CardTitle>
            <CardDescription>
              {isSignUpMode ? 'Crea una nueva cuenta' : 'Ingresa con tu cuenta existente'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {isSignUpMode && (
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario (opcional)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="mi_usuario"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAuth} className="flex-1">
                {isSignUpMode ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSignUpMode(!isSignUpMode)}
              >
                {isSignUpMode ? 'Ya tengo cuenta' : 'Crear cuenta'}
              </Button>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Credenciales de prueba:</strong><br />
                Email: demo@geoentry.com<br />
                Contraseña: demo123
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        /* Panel de Usuario Autenticado */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Usuario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username || ''} />
                  ) : (
                    <AvatarFallback>
                      {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{profile?.username || 'Sin nombre'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label>Perfil creado</Label>
                  <p className="text-sm">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <Label>Última actualización</Label>
                  <p className="text-sm">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleRefreshProfile}
                disabled={updating}
                className="w-full"
              >
                {updating ? 'Actualizando...' : 'Refrescar Perfil'}
              </Button>
            </CardContent>
          </Card>

          {/* Actualizar Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Actualizar Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUsername">Nombre de usuario</Label>
                <Input
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nuevo nombre de usuario"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newAvatarUrl">URL del Avatar</Label>
                <Input
                  id="newAvatarUrl"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </div>

              <Button 
                onClick={handleUpdateProfile}
                disabled={updating}
                className="w-full"
              >
                {updating ? 'Guardando...' : 'Actualizar Perfil'}
              </Button>

              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
          <CardDescription>Estado interno del AuthContext</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Estado de carga</Label>
              <p className="font-mono">{loading.toString()}</p>
            </div>
            <div>
              <Label>ID de sesión</Label>
              <p className="font-mono text-xs">{session?.access_token ? 'Token presente' : 'Sin token'}</p>
            </div>
            <div>
              <Label>Proveedor de auth</Label>
              <p className="font-mono">{user?.app_metadata?.provider || 'N/A'}</p>
            </div>
            <div>
              <Label>Última actividad</Label>
              <p className="font-mono text-xs">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthExampleComponent;
