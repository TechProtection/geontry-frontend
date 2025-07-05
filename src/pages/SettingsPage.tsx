/**
 * Página de configuración
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { useLog } from '../contexts/LogContext';
import { Settings, Moon, Sun, Monitor, FileText } from 'lucide-react';

/**
 * Página de configuración
 */
const SettingsPage: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { logs, clearLogs, exportLogs } = useLog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Personaliza tu experiencia con GeoEntry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuración de tema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {actualTheme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Seleccionar tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Oscuro
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Sistema
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Selecciona tu tema preferido. "Sistema" seguirá la configuración de tu dispositivo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestión de Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Total de logs almacenados: <strong>{logs.length}</strong>
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={exportLogs}
                  disabled={logs.length === 0}
                  className="flex-1"
                >
                  Exportar CSV
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearLogs}
                  disabled={logs.length === 0}
                  className="flex-1"
                >
                  Limpiar Logs
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Los logs se almacenan localmente en tu navegador y se pueden exportar en formato CSV.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración general */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones del sistema
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto-actualización</Label>
                <p className="text-sm text-muted-foreground">
                  Actualizar datos automáticamente
                </p>
              </div>
              <Switch id="auto-refresh" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Modo Debug</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar información adicional en consola
                </p>
              </div>
              <Switch id="debug-mode" />
            </div>
          </CardContent>
        </Card>

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Versión</p>
                <p>1.0.0</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Build</p>
                <p>2025.01.01</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Navegador</p>
                <p>{navigator.userAgent.split(' ')[0]}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Plataforma</p>
                <p>{navigator.platform}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
