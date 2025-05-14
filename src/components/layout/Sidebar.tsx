import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart, Users, Settings, HelpCircle, User, Bell, Tv, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

const NavItem = ({ to, icon: Icon, label, exact = false }: {
  to: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sidebar-foreground hover:bg-secondary/20 transition-colors ${
          isActive ? 'active-nav-item' : ''
        }`
      }
      end={exact}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span className="font-mono uppercase text-sm">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Primero limpiar localStorage manualmente para evitar problemas
    window.localStorage.removeItem('supabase.auth.token');
    window.localStorage.removeItem('sb-session');
    
    // Luego intentar cerrar sesión normalmente
    await signOut();
    
    // Navegar al login incluso si algo salió mal con el signOut
    navigate("/login");
    
    // Notificar al usuario
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  // Agregar un manejador de emergencia para cuando el botón normal no funcione
  const handleForceSignOut = () => {
    // Limpiar todo el localStorage
    window.localStorage.clear();
    // Redireccionar a la página de login
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-sidebar-background border-r border-border shrink-0 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-2xl font-bold font-mono text-white">GeoEntry</h1>
        </div>
        <div className="flex-1">
          <div className="py-3">
            <nav className="space-y-1">
              <NavItem to="/" icon={Home} label="Home" exact />
              <NavItem to="/devices" icon={Tv} label="Devices" />
              <NavItem to="/logs" icon={BarChart2} label="Stats & Logs" />
              <NavItem to="/group" icon={Users} label="Group" />
              <NavItem to="/notifications" icon={Bell} label="Notifications" />
              <NavItem to="/settings" icon={Settings} label="Settings" />
              <NavItem to="/support" icon={HelpCircle} label="Support" />
              <NavItem to="/profile" icon={User} label="Profile" />
            </nav>
          </div>
          <div className="mt-auto pt-4 border-t border-border space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
