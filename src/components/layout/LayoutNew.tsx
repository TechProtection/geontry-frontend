/**
 * Layout principal con sidebar y navbar
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthCheck } from '@/hooks/useDashboard';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Home, 
  MapPin, 
  Smartphone, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Activity,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { data: healthCheck } = useHealthCheck();
  const { navigateToPage } = useAppNavigation();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      icon: MapPin,
      label: 'Ubicaciones',
      path: '/locations',
      active: location.pathname.startsWith('/locations'),
    },
    {
      icon: Smartphone,
      label: 'Dispositivos',
      path: '/devices',
      active: location.pathname.startsWith('/devices'),
    },
    {
      icon: Activity,
      label: 'Eventos',
      path: '/events',
      active: location.pathname.startsWith('/events'),
    },
    {
      icon: BarChart3,
      label: 'Analíticas',
      path: '/analytics',
      active: location.pathname.startsWith('/analytics'),
    },
    {
      icon: Settings,
      label: 'Configuración',
      path: '/settings',
      active: location.pathname.startsWith('/settings'),
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GeoEntry</h1>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigateToPage(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              item.active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Health Status */}
        {healthCheck && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado API</span>
            <Badge variant={healthCheck.status === 'OK' ? 'default' : 'destructive'} className="text-xs">
              {healthCheck.status === 'OK' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {healthCheck.status}
            </Badge>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.username || user?.email?.split('@')[0] || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <Button
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

const TopNavbar: React.FC = () => {
  const [language, setLanguage] = React.useState('es');
  
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-end gap-4">
        {/* Language Selector */}
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 h-8">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
