/**
 * Aplicación principal de GeoEntry
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Contextos
import { ThemeProvider } from './contexts/ThemeContext';
import { LogProvider } from './contexts/LogContext';
import { AuthProvider } from './contexts/NewAuthContext';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import Layout from './components/layout/Layout';

// Páginas
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/Devices/DeviceList';
import DeviceForm from './pages/Devices/DeviceForm';
import DeviceDetail from './pages/Devices/DeviceDetail';
import LocationList from './pages/Locations/LocationList';
import LocationForm from './pages/Locations/LocationForm';
import LocationDetail from './pages/Locations/LocationDetail';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import UserDetail from './pages/Users/UserDetail';
import SensorList from './pages/Sensors/SensorList';
import SensorForm from './pages/Sensors/SensorForm';
import SensorDetail from './pages/Sensors/SensorDetail';
import EventList from './pages/ProximityEvents/EventList';
import EventDetail from './pages/ProximityEvents/EventDetail';
import LogsPage from './pages/LogsPage';
import HealthPage from './pages/HealthPage';
import SettingsPage from './pages/SettingsPage';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (reemplaza cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Componente principal de la aplicación
 */
const NewApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LogProvider>
            <TooltipProvider>
              <Router>
                <Routes>
                  {/* Ruta de login */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Ruta principal redirige a dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Todas las rutas protegidas están envueltas en ProtectedRoute y Layout */}
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    {/* Dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Dispositivos */}
                    <Route path="devices" element={<DeviceList />} />
                    <Route path="devices/new" element={<DeviceForm />} />
                    <Route path="devices/:id" element={<DeviceDetail />} />
                    <Route path="devices/:id/edit" element={<DeviceForm />} />
                    
                    {/* Ubicaciones */}
                    <Route path="locations" element={<LocationList />} />
                    <Route path="locations/new" element={<LocationForm />} />
                    <Route path="locations/:id" element={<LocationDetail />} />
                    <Route path="locations/:id/edit" element={<LocationForm />} />
                    
                    {/* Perfiles/Usuarios */}
                    <Route path="profiles" element={<UserList />} />
                    <Route path="profiles/new" element={<UserForm />} />
                    <Route path="profiles/:id" element={<UserDetail />} />
                    <Route path="profiles/:id/edit" element={<UserForm />} />
                    
                    {/* Sensores */}
                    <Route path="sensors" element={<SensorList />} />
                    <Route path="sensors/new" element={<SensorForm />} />
                    <Route path="sensors/:id" element={<SensorDetail />} />
                    <Route path="sensors/:id/edit" element={<SensorForm />} />
                    
                    {/* Eventos de proximidad */}
                    <Route path="proximity-events" element={<EventList />} />
                    <Route path="proximity-events/:id" element={<EventDetail />} />
                    
                    {/* Logs */}
                    <Route path="logs" element={<LogsPage />} />
                    
                    {/* Estado del sistema */}
                    <Route path="health" element={<HealthPage />} />
                    
                    {/* Configuración */}
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </Router>
              
              {/* Notificaciones */}
              <Toaster />
            </TooltipProvider>
          </LogProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default NewApp;
});

/**
 * Componente principal de la aplicación
 */
const NewApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LogProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                {/* Ruta principal redirige a dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Todas las rutas están envueltas en el Layout */}
                <Route path="/*" element={<Layout />}>
                  {/* Dashboard */}
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Dispositivos */}
                  <Route path="devices" element={<DeviceList />} />
                  <Route path="devices/new" element={<DeviceForm />} />
                  <Route path="devices/:id" element={<DeviceDetail />} />
                  <Route path="devices/:id/edit" element={<DeviceForm />} />
                  
                  {/* Ubicaciones */}
                  <Route path="locations" element={<LocationList />} />
                  <Route path="locations/new" element={<LocationForm />} />
                  <Route path="locations/:id" element={<LocationDetail />} />
                  <Route path="locations/:id/edit" element={<LocationForm />} />
                  
                  {/* Perfiles/Usuarios */}
                  <Route path="profiles" element={<UserList />} />
                  <Route path="profiles/new" element={<UserForm />} />
                  <Route path="profiles/:id" element={<UserDetail />} />
                  <Route path="profiles/:id/edit" element={<UserForm />} />
                  
                  {/* Sensores */}
                  <Route path="sensors" element={<SensorList />} />
                  <Route path="sensors/new" element={<SensorForm />} />
                  <Route path="sensors/:id" element={<SensorDetail />} />
                  <Route path="sensors/:id/edit" element={<SensorForm />} />
                  
                  {/* Eventos de proximidad */}
                  <Route path="proximity-events" element={<EventList />} />
                  <Route path="proximity-events/:id" element={<EventDetail />} />
                  
                  {/* Logs */}
                  <Route path="logs" element={<LogsPage />} />
                  
                  {/* Estado del sistema */}
                  <Route path="health" element={<HealthPage />} />
                  
                  {/* Configuración */}
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </Router>
            
            {/* Notificaciones */}
            <Toaster />
          </TooltipProvider>
        </LogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default NewApp;
