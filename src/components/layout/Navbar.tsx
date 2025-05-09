
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileNav from '@/pages/MobileMenu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <MobileNav />
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/settings">
          <button className="p-2 rounded-full hover:bg-secondary">
            <Settings className="h-5 w-5" />
          </button>
        </Link>
        <Link to="/notifications">
          <button className="p-2 rounded-full hover:bg-secondary">
            <Bell className="h-5 w-5" />
          </button>
        </Link>
        <Link to="/profile" className="flex items-center gap-2">
          <span className="hidden md:inline-block">Pedro</span>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarFallback style={{ backgroundColor: '#1e88e5' }}>P</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
