/**
 * Página de lista de usuarios
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DataTable from '../../components/DataTable';
import { useProfiles, useDeleteProfile } from '../../hooks/useProfiles';
import { Profile } from '../../types/api';

/**
 * Página de lista de usuarios
 */
const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { data: profiles, isLoading, error } = useProfiles();
  const deleteProfile = useDeleteProfile();

  const handleEdit = (profile: Profile) => {
    navigate(`/profiles/${profile.id}/edit`);
  };

  const handleView = (profile: Profile) => {
    navigate(`/profiles/${profile.id}`);
  };

  const handleDelete = async (profile: Profile) => {
    if (window.confirm(`¿Está seguro de eliminar el perfil "${profile.full_name}"?`)) {
      deleteProfile.mutate(profile.id);
    }
  };

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (_, profile: Profile) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          <AvatarFallback>
            {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      width: '80px',
    },
    {
      key: 'full_name',
      label: 'Nombre Completo',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Rol',
      render: (role: string) => (
        role === 'ADMIN' ? 'Administrador' : 'Usuario'
      ),
    },
    {
      key: 'is_active',
      label: 'Estado',
    },
    {
      key: 'created_at',
      label: 'Creado',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfiles</h1>
          <p className="text-muted-foreground">
            Gestión de perfiles de usuario
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los perfiles: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfiles</h1>
        <p className="text-muted-foreground">
          Gestión de perfiles de usuario del sistema
        </p>
      </div>

      <DataTable
        data={profiles || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar perfiles..."
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        createPath="/profiles/new"
        createLabel="Crear Perfil"
        emptyMessage="No hay perfiles registrados"
      />
    </div>
  );
};

export default UserList;
