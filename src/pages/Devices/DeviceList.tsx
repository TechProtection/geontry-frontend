/**
 * Página de lista de dispositivos
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { useDevices, useDeleteDevice } from '../../hooks/useDevices';
import { useProfiles } from '../../hooks/useProfiles';
import { Device } from '../../types/api';

/**
 * Página de lista de dispositivos
 */
const DeviceList: React.FC = () => {
  const navigate = useNavigate();
  const { data: devices, isLoading, error } = useDevices();
  const { data: profiles } = useProfiles();
  const deleteDevice = useDeleteDevice();

  const handleEdit = (device: Device) => {
    navigate(`/devices/${device.id}/edit`);
  };

  const handleView = (device: Device) => {
    navigate(`/devices/${device.id}`);
  };

  const handleDelete = async (device: Device) => {
    if (window.confirm(`¿Está seguro de eliminar el dispositivo "${device.name}"?`)) {
      deleteDevice.mutate(device.id);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (type: string) => {
        const typeLabels = {
          smart_lock: 'Cerradura Inteligente',
          light: 'Luz',
          thermostat: 'Termostato',
          camera: 'Cámara',
          sensor: 'Sensor',
          other: 'Otro',
        };
        return typeLabels[type as keyof typeof typeLabels] || type;
      },
    },
    {
      key: 'profile.full_name',
      label: 'Usuario',
      render: (_, device: Device) => device.profile?.full_name || 'No asignado',
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
          <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
          <p className="text-muted-foreground">
            Gestión de dispositivos IoT
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los dispositivos: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
        <p className="text-muted-foreground">
          Gestión de dispositivos IoT conectados al sistema
        </p>
      </div>

      <DataTable
        data={devices || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Buscar dispositivos..."
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        createPath="/devices/new"
        createLabel="Crear Dispositivo"
        emptyMessage="No hay dispositivos registrados"
      />
    </div>
  );
};

export default DeviceList;
