
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SmartDevice, { DeviceType } from '@/components/dashboard/SmartDevice';

// Sample device data
const devices = [
  { id: '1', name: 'Living Room Lights', type: 'light' as DeviceType, location: 'Living Room', defaultOn: true },
  { id: '2', name: 'Kitchen Lights', type: 'light' as DeviceType, location: 'Kitchen', defaultOn: false },
  { id: '3', name: 'Thermostat', type: 'climate' as DeviceType, location: 'Whole House', defaultOn: true },
  { id: '4', name: 'Bedroom Diffuser', type: 'diffuser' as DeviceType, location: 'Bedroom', defaultOn: false },
  { id: '5', name: 'Living Room Blinds', type: 'blinds' as DeviceType, location: 'Living Room', defaultOn: true },
  { id: '6', name: 'Front Door Lock', type: 'lock' as DeviceType, location: 'Entrance', defaultOn: false },
  { id: '7', name: 'Bathroom Lights', type: 'light' as DeviceType, location: 'Bathroom', defaultOn: false },
  { id: '8', name: 'Office Diffuser', type: 'diffuser' as DeviceType, location: 'Office', defaultOn: true },
];

const Devices: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Smart Devices</h1>
            <p className="text-muted-foreground">Manage all your connected devices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map(device => (
            <SmartDevice
              key={device.id}
              id={device.id}
              name={device.name}
              type={device.type}
              location={device.location}
              defaultOn={device.defaultOn}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Devices;
