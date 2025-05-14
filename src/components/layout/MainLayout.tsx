import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { EmergencyReset } from '../EmergencyReset';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
      
      {/* Componente de emergencia - solo en desarrollo */}
      {import.meta.env.DEV && <EmergencyReset />}
    </div>
  );
};

export default MainLayout;
