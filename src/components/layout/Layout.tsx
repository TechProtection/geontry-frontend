/**
 * Componente de layout principal
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import NewNavbar from './NewNavbar';
import NewSidebar from './NewSidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

/**
 * Layout principal de la aplicación
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <NewSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <NewNavbar />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
