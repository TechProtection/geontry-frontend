
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Map from '@/components/dashboard/Map';
import StatsCard from '@/components/dashboard/StatsCard';
import { Home, Lock, Lightbulb, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Welcome to GeoEntry</h2>
                <p className="text-muted-foreground max-w-3xl">
                  GeoEntry is an intelligent system that activates your home when you're nearby. 
                  Our solution includes electronic locks, automatic lighting with brightness sensors, 
                  environmental control (temperature), and home fragrances - all in one integrated solution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Lock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Smart Lock</h3>
              <p className="text-sm text-muted-foreground">Automatic door control</p>
            </div>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">Smart Lighting</h3>
              <p className="text-sm text-muted-foreground">Brightness-sensitive lighting</p>
            </div>
          </div>
          <div className="bg-cyan-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-full">
              <Thermometer className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-medium">Climate Control</h3>
              <p className="text-sm text-muted-foreground">Temperature management</p>
            </div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Droplets className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Aromatic System</h3>
              <p className="text-sm text-muted-foreground">Home fragrance control</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px]">
            <Map />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Usage Statistics</h2>
            <div className="space-y-4">
              <StatsCard title="Energy Used" value="124 kWh" change="+12%" type="increase" />
              <StatsCard title="Devices Active" value="8/12" change="+3" type="neutral" />
              <StatsCard title="Temperature" value="22°C" change="-2°C" type="decrease" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
