
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart, Users, Settings, HelpCircle, User, Bell, Tv, BarChart2 } from 'lucide-react';

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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
