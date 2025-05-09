
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Home, Tv, Users, Settings, HelpCircle, User, Bell, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, label }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 text-sidebar-foreground hover:bg-secondary/20 transition-colors ${
            isActive ? 'active-nav-item' : ''
          }`
        }
        onClick={() => setOpen(false)}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="font-mono uppercase text-sm">{label}</span>
      </NavLink>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-sidebar-background">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold font-mono text-white">GeoEntry</h2>
        </div>
        <nav className="space-y-1 py-4">
          <NavItem to="/" icon={Home} label="Home" />
          <NavItem to="/devices" icon={Tv} label="Devices" />
          <NavItem to="/logs" icon={BarChart2} label="Stats & Logs" />
          <NavItem to="/group" icon={Users} label="Group" />
          <NavItem to="/notifications" icon={Bell} label="Notifications" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
          <NavItem to="/support" icon={HelpCircle} label="Support" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
