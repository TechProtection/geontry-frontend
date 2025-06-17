import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, Edit, Trash2, LogOut, User } from 'lucide-react';
import { useProfileData } from '@/hooks/use-data';

const ProfilePage: React.FC = () => {  const { 
    user, 
    profile, 
    signOut, 
    loading: authLoading, 
    refreshProfile,
    profileLoading: contextProfileLoading,
    profileError: contextProfileError 
  } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook personalizado para datos del perfil con más control
  const { 
    profile: hookProfile, 
    loading: profileLoading, 
    error: profileError,
    updateProfile,
    refreshProfile: refreshProfileData,
    lastFetch
  } = useProfileData(user?.id);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    avatar_url: '',
  });
  // Usar el perfil del contexto (ya optimizado) prioritariamente
  const currentProfile = profile;
  const isLoading = authLoading || contextProfileLoading;

  // Actualizar formulario cuando el perfil esté disponible
  useEffect(() => {
    if (currentProfile) {
      setEditForm({
        full_name: currentProfile.full_name || '',
        avatar_url: currentProfile.avatar_url || '',
      });
    }
  }, [currentProfile]);
  const handleRefresh = async () => {
    try {
      await refreshProfile();
      toast({
        title: "Perfil actualizado",
        description: "Los datos del perfil se han actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };
  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        throw new Error("Usuario no identificado");
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Refrescar el perfil del contexto
      await refreshProfile();

      setEditDialogOpen(false);
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user?.id) {
        throw new Error("Usuario no identificado");
      }

      // Primero eliminar el perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      // Después cerrar sesión
      await signOut();
      navigate('/login');
      
      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada permanentemente.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la cuenta",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  // Pantalla de carga
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  // Error en la carga del perfil
  if (contextProfileError && !currentProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-500">
              <RefreshCw className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error al cargar el perfil</h3>
              <p className="text-muted-foreground">{contextProfileError}</p>
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

  // Mostrar información de depuración si no hay perfil
  if (!currentProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-yellow-500">
              <RefreshCw className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Perfil no encontrado</h3>
              <p className="text-muted-foreground">
                No se pudo cargar la información del perfil
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Usuario ID: {user?.id || 'No disponible'}
              </p>
              <p className="text-xs text-muted-foreground">
                Última actualización: {lastFetch ? new Date(lastFetch).toLocaleString() : 'Nunca'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
              <Button onClick={handleSignOut} variant="destructive">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentProfile.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(currentProfile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{currentProfile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{currentProfile.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Rol: {currentProfile.role}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Fecha de registro</p>
                    <p>{new Date(currentProfile.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última actualización</p>
                    <p>{new Date(currentProfile.updated_at || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setEditDialogOpen(true)} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </CardFooter>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription>
                Gestiona tu cuenta y configuraciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Cuenta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta
                      y todos los datos asociados de nuestros servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar cuenta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        {/* Dialog de Edición */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Actualiza tu información personal aquí. Los cambios se guardarán automáticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nombre completo</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="avatar_url">URL del Avatar</Label>
                <Input
                  id="avatar_url"
                  value={editForm.avatar_url}
                  onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
