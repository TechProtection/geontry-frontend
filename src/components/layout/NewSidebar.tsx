/**
 * Componente de navegación lateral
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Smartphone,
  MapPin,
  Users,
  Activity,
  Calendar,
  FileText,
  Heart,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useDevices } from '../../hooks/useDevices';
import { useLocations } from '../../hooks/useLocations';
import { useProfiles } from '../../hooks/useProfiles';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  isActive?: boolean;
  children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon: Icon,
  label,
  badge,
  isActive = false,
  children,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Link
        to={to}
        onClick={handleClick}
        className={cn(
          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
        {badge && (
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
            {badge}
          </Badge>
        )}
        {hasChildren && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        )}
      </Link>
      {hasChildren && isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Componente principal de la barra lateral
 */
const NewSidebar: React.FC = () => {
  const location = useLocation();
  const { data: devices } = useDevices();
  const { data: locations } = useLocations();
  const { data: profiles } = useProfiles();

  const isActive = (path: string) => {
    if (path === '/' || path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <SidebarItem
              to="/"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={isActive('/')}
            />
            
            <SidebarItem
              to="/devices"
              icon={Smartphone}
              label="Dispositivos"
              badge={devices?.length}
              isActive={isActive('/devices')}
            />
            
            <SidebarItem
              to="/locations"
              icon={MapPin}
              label="Ubicaciones"
              badge={locations?.length}
              isActive={isActive('/locations')}
            />
            
            <SidebarItem
              to="/profiles"
              icon={Users}
              label="Perfiles"
              badge={profiles?.length}
              isActive={isActive('/profiles')}
            />
            
            <SidebarItem
              to="/sensors"
              icon={Activity}
              label="Sensores"
              isActive={isActive('/sensors')}
            />
            
            <SidebarItem
              to="/proximity-events"
              icon={Calendar}
              label="Eventos de Proximidad"
              isActive={isActive('/proximity-events')}
            />
            
            <SidebarItem
              to="/logs"
              icon={FileText}
              label="Logs"
              isActive={isActive('/logs')}
            />
            
            <SidebarItem
              to="/health"
              icon={Heart}
              label="Estado del Sistema"
              isActive={isActive('/health')}
            />
            
            <div className="my-2 border-t" />
            
            <SidebarItem
              to="/settings"
              icon={Settings}
              label="Configuración"
              isActive={isActive('/settings')}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;
