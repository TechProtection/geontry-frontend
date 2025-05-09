
import React from 'react';

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, children }) => {
  return (
    <div className="geo-card h-full">
      <h3 className="text-lg font-mono uppercase mb-3">{title}</h3>
      <div className="h-[calc(100%-2rem)]">
        {children}
      </div>
    </div>
  );
};

export default StatsCard;
