
import React from 'react';

interface DeviceCardProps {
  title: string;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ title }) => {
  return (
    <div className="border border-border rounded-lg aspect-square bg-secondary/20 flex items-center justify-center">
      <span className="font-mono">{title}</span>
    </div>
  );
};

export default DeviceCard;
