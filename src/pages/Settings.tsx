
/**
 * Página de configuración del sistema
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Settings, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  HelpCircle, 
  Mail, 
  MapPin, 
  Smartphone,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContextNew';
import { ThemeToggle } from '@/components/ThemeToggle';

const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  const faqItems = [
    {
      question: "¿Cómo funciona el sistema de geofencing?",
      answer: "El sistema utiliza las coordenadas GPS de los dispositivos para determinar si están dentro del radio definido de una ubicación. Cuando un dispositivo entra o sale de una zona, se genera automáticamente un evento de proximidad."
    },
    {
      question: "¿Qué precisión tiene el seguimiento de ubicación?",
      answer: "La precisión depende del dispositivo y las condiciones del GPS, pero generalmente es de 3-5 metros en condiciones óptimas. El sistema está diseñado para funcionar con rangos de radio que compensan las variaciones de precisión."
    },
    {
      question: "¿Puedo configurar múltiples ubicaciones?",
      answer: "Sí, puedes agregar tantas ubicaciones como necesites. Cada ubicación puede tener su propio nombre, radio de geofencing y configuración de notificaciones."
    },
    {
      question: "¿Cómo se registran los dispositivos?",
      answer: "Los dispositivos se registran automáticamente cuando se conectan al sistema por primera vez. Puedes gestionar los dispositivos desde la sección de Dispositivos, donde también puedes ver su estado y historial de actividad."
    },
    {
      question: "¿Se pueden exportar los datos de eventos?",
      answer: "Sí, puedes exportar el historial de eventos en formato CSV desde la página de Eventos. Los datos incluyen fechas, tipos de evento, dispositivos y ubicaciones."
    },
    {
      question: "¿Cómo funcionan las notificaciones?",
      answer: "El sistema puede enviar notificaciones por correo electrónico y mostrar alertas en tiempo real en la aplicación cuando ocurren eventos de entrada o salida. Puedes configurar qué tipos de eventos quieres recibir."
    },
    {
      question: "¿Qué hago si un dispositivo no aparece en el mapa?",
      answer: "Verifica que el dispositivo esté registrado correctamente y que tenga permisos de ubicación habilitados. También asegúrate de que el dispositivo esté dentro del radio de alguna ubicación configurada."
    },
    {
      question: "¿Puedo cambiar el radio de una ubicación?",
      answer: "Sí, puedes editar las ubicaciones existentes desde la página de Ubicaciones. Puedes modificar el nombre, las coordenadas, el radio y el estado activo/inactivo de cada ubicación."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Personaliza tu experiencia con GeoEntry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Badge variant="outline" className="text-sm">
            v1.0.0
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre modo claro y oscuro
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={() => {}} 
                    disabled
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecciona tu idioma preferido
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones en la aplicación</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir alertas en tiempo real
                  </p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir resúmenes por correo electrónico
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sonidos de notificación</Label>
                  <p className="text-sm text-muted-foreground">
                    Reproducir sonidos para eventos importantes
                  </p>
                </div>
                <Switch 
                  checked={soundNotifications} 
                  onCheckedChange={setSoundNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Actualización automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Actualizar datos automáticamente
                  </p>
                </div>
                <Switch 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Intervalo de actualización</Label>
                  <p className="text-sm text-muted-foreground">
                    Frecuencia de actualización de datos
                  </p>
                </div>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 segundos</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                    <SelectItem value="300">5 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estadísticas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Ubicaciones</span>
                  </div>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dispositivos</span>
                  </div>
                  <Badge variant="secondary">-</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Eventos Hoy</span>
                  </div>
                  <Badge variant="secondary">-</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidad & Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Datos de ubicación:</strong> Encriptados y protegidos
                </p>
                <p>
                  <strong>Almacenamiento:</strong> Servidor seguro con respaldo
                </p>
                <p>
                  <strong>Acceso:</strong> Solo usuarios autorizados
                </p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar Soporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Preguntas Frecuentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline">
          Restaurar por Defecto
        </Button>
        <Button>
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
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
