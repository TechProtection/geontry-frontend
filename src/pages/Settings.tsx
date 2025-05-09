
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LampFloor, AirVent, Blinds, Thermometer, Droplets, Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const [lightBrightness, setLightBrightness] = useState(75);
  const [temperature, setTemperature] = useState(22);
  const [humidity, setHumidity] = useState(50);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd implement actual theme switching here
    toast({
      title: darkMode ? "Light Mode Activated" : "Dark Mode Activated",
      description: "Your theme preference has been updated.",
    });
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language Changed",
      description: value === 'en' ? "Language set to English" : "Idioma establecido a Español",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure global application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <Label>Language</Label>
              </div>
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({
                title: "Device Connection",
                description: "Scanning for new devices to connect...",
              })}
            >
              Connect New Device
            </Button>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="lighting">
          <TabsList className="mb-6">
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <LampFloor className="h-4 w-4" />
              <span>Lighting</span>
            </TabsTrigger>
            <TabsTrigger value="climate" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span>Climate</span>
            </TabsTrigger>
            <TabsTrigger value="blinds" className="flex items-center gap-2">
              <Blinds className="h-4 w-4" />
              <span>Blinds</span>
            </TabsTrigger>
            <TabsTrigger value="aromatics" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              <span>Aromatics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lighting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Smart Lighting Controls</CardTitle>
                <CardDescription>Control brightness, color, and automation for your smart lights.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lights">Automatic Lights</Label>
                  <Switch id="auto-lights" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="brightness">Brightness</Label>
                    <span className="text-sm text-muted-foreground">{lightBrightness}%</span>
                  </div>
                  <Slider
                    id="brightness"
                    value={[lightBrightness]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setLightBrightness(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="night-mode">Night Mode</Label>
                  <Switch id="night-mode" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="climate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Climate Control</CardTitle>
                <CardDescription>Adjust temperature, humidity, and ventilation settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ac-mode">Air Conditioning</Label>
                  <Switch id="ac-mode" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <span className="text-sm text-muted-foreground">{temperature}°C</span>
                  </div>
                  <Slider
                    id="temperature"
                    value={[temperature]}
                    min={16}
                    max={30}
                    step={0.5}
                    onValueChange={(value) => setTemperature(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <span className="text-sm text-muted-foreground">{humidity}%</span>
                  </div>
                  <Slider
                    id="humidity"
                    value={[humidity]}
                    min={30}
                    max={70}
                    step={1}
                    onValueChange={(value) => setHumidity(value[0])}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blinds">
            <Card>
              <CardHeader>
                <CardTitle>Smart Blinds</CardTitle>
                <CardDescription>Configure your motorized blinds and shades.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-blinds">Automatic Schedule</Label>
                  <Switch id="auto-blinds" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="light-sensor">Light Sensor Control</Label>
                  <Switch id="light-sensor" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="privacy-mode">Privacy Mode</Label>
                  <Switch id="privacy-mode" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="aromatics">
            <Card>
              <CardHeader>
                <CardTitle>Aromatic Diffusers</CardTitle>
                <CardDescription>Control your smart diffusers and scent schedules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-diffuser">Automatic Diffuser</Label>
                  <Switch id="auto-diffuser" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="scent-cycling">Scent Cycling</Label>
                  <Switch id="scent-cycling" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sleep-mode">Sleep Mode Fragrance</Label>
                  <Switch id="sleep-mode" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
