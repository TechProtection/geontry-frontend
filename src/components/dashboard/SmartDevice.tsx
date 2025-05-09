
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Lightbulb, Thermometer, Wind, Droplets, Blinds } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeviceType = 'light' | 'climate' | 'diffuser' | 'blinds' | 'lock';

interface SmartDeviceProps {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  defaultOn?: boolean;
}

const DeviceIcons = {
  light: Lightbulb,
  climate: Thermometer,
  diffuser: Droplets,
  blinds: Blinds,
  lock: Wind, // Using Wind as placeholder for lock
};

const SmartDevice: React.FC<SmartDeviceProps> = ({ id, name, type, location, defaultOn = false }) => {
  const [isOn, setIsOn] = useState(defaultOn);
  const Icon = DeviceIcons[type];
  
  const getDeviceStatusText = () => {
    switch (type) {
      case 'light': return isOn ? 'On' : 'Off';
      case 'climate': return isOn ? '72°F' : 'Off';
      case 'diffuser': return isOn ? 'Active' : 'Inactive';
      case 'blinds': return isOn ? 'Open' : 'Closed';
      case 'lock': return isOn ? 'Unlocked' : 'Locked';
      default: return isOn ? 'On' : 'Off';
    }
  };

  const getBackgroundColor = () => {
    if (!isOn) return 'bg-secondary/20';
    
    switch(type) {
      case 'light': return 'bg-amber-500/10';
      case 'climate': return 'bg-cyan-500/10';
      case 'diffuser': return 'bg-purple-500/10';
      case 'blinds': return 'bg-blue-500/10';
      case 'lock': return 'bg-green-500/10';
      default: return 'bg-secondary/20';
    }
  };

  return (
    <div className={cn(
      "border border-border rounded-lg p-4 transition-colors",
      getBackgroundColor()
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            isOn ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <Switch 
          checked={isOn} 
          onCheckedChange={setIsOn} 
          className="data-[state=checked]:bg-primary" 
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-mono">Status: <span className="font-semibold">{getDeviceStatusText()}</span></p>
      </div>
    </div>
  );
};

export default SmartDevice;
