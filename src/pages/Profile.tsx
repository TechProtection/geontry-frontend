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
import { Loader2, RefreshCw } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);  const [editForm, setEditForm] = useState({
    full_name: '',
    avatar_url: '',
  });
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Función para cargar el perfil con reintento automático
  const loadProfileWithRetry = async () => {
    setLocalLoading(true);
    try {
      if (user) {
        console.log('Loading profile for user:', user.id);
        const profileData = await refreshProfile();
        
        if (!profileData && retryCount < 2) {
          console.log(`Retrying profile load. Attempt: ${retryCount + 1}`);
          setRetryCount(prev => prev + 1);
          
          // Si el perfil no se cargó, esperamos un momento y volvemos a intentar
          setTimeout(() => {
            loadProfileWithRetry();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      // Finalizar carga local después de un tiempo para no bloquear la UI
      setTimeout(() => {
        setLocalLoading(false);
      }, 800);
    }
  };

  // Efecto para cargar el perfil al montar el componente
  useEffect(() => {
    loadProfileWithRetry();
    
    // Timeout de seguridad para evitar la carga infinita
    const timeoutId = setTimeout(() => {
      setLocalLoading(false);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [user]);
  // Actualizar editForm cuando el perfil esté disponible
  useEffect(() => {
    if (profile) {
      console.log('Setting edit form with profile data:', profile);
      setEditForm({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const getInitials = (fullName: string | null | undefined) => {
    if (!fullName) return user?.email?.charAt(0).toUpperCase() || 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para manejar la recarga manual del perfil
  const handleManualRefresh = async () => {
    setLocalLoading(true);
    await refreshProfile();
    setTimeout(() => {
      setLocalLoading(false);
    }, 800);
  };

  const handleForceReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleForceSignOut = () => {
    window.localStorage.clear();
    window.location.href = '/login';
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        throw new Error("Usuario no identificado");
      }      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
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
  if (localLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Cargando perfil...</p>
            <Button variant="link" onClick={handleForceReset} size="sm">
              ¿Problemas al cargar? Haz clic aquí
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Verificar si tenemos los datos necesarios
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Error al cargar perfil</CardTitle>
              <CardDescription>No se pudo cargar la información del usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No se ha detectado una sesión de usuario válida.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleForceReset}>Reiniciar sesión</Button>
              <Button variant="outline" className="ml-2" onClick={() => navigate("/login")}>
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Contenido principal cuando los datos están disponibles
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">                
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary">{getInitials(profile?.full_name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-2xl">{profile?.full_name || user.email?.split('@')[0] || 'Usuario'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <div className="mt-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs inline-block">
                      {profile?.role || 'USER'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleManualRefresh} 
                  className="rounded-full h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Recargar perfil</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información Personal</h3>                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre completo</p>
                      <p>{profile?.full_name || 'No establecido'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="text-xs font-mono">{user.id}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Información de Cuenta</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Creado el</p>
                      <p>{profile?.created_at ? formatDate(profile.created_at) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Última actualización</p>
                      <p>{profile?.updated_at ? formatDate(profile.updated_at) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                Editar Perfil
              </Button>
              
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                onClick={handleSignOut}
              >
                Cerrar Sesión
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Eliminar Cuenta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                      y eliminará tus datos de nuestros servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>Eliminar Cuenta</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Diálogo para editar perfil */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información de perfil aquí.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={editForm.full_name || ''}
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">URL de Avatar</Label>
              <Input
                id="avatar"
                value={editForm.avatar_url || ''}
                onChange={(e) => setEditForm({...editForm, avatar_url: e.target.value})}
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ProfilePage;
