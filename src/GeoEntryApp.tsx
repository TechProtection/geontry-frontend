/**
 * Aplicación principal de GeoEntry - Completamente renovada
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContextNew';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/LayoutNew';
import AuthDebugComponent from './components/AuthDebugComponent';

// Páginas
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardNew';
import LocationsPage from './pages/LocationsPage';
import DevicesPage from './pages/DevicesPage';
import EventsPage from './pages/EventsPage';
import SettingsNew from './pages/SettingsNew';
import InteractiveMap from './components/MapView';
import AdvancedAnalytics from './components/AdvancedAnalytics';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Aplicación principal completamente renovada
 */
const GeoEntryApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router>
            <Routes>
                {/* Ruta de debug temporal */}
                <Route path="/debug" element={<AuthDebugComponent />} />
                
                {/* Ruta de login */}
                <Route path="/login" element={<LoginPage />} />
              
              {/* Ruta principal redirige a dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Todas las rutas protegidas */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard principal */}
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Mapa independiente */}
                <Route path="map" element={<InteractiveMap />} />
                
                {/* Analíticas independientes */}
                <Route path="analytics" element={<AdvancedAnalytics />} />
                
                {/* Páginas principales */}
                <Route path="locations" element={<LocationsPage />} />
                <Route path="devices" element={<DevicesPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="settings" element={<SettingsNew />} />
              </Route>

              
            </Routes>
          </Router>
          
          {/* Notificaciones */}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default GeoEntryApp;
