/**
 * Página de login moderna para GeoEntry
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContextNew';
import { MapPin, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('¡Bienvenido a GeoEntry!');
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas');
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@geoentry.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">GeoEntry</h1>
          <p className="text-muted-foreground">
            Sistema inteligente de ubicaciones
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Access */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-sm">Acceso Demo</h3>
              <p className="text-xs text-muted-foreground">
                Usa las credenciales de prueba para explorar la aplicación
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDemoLogin}
                className="w-full"
              >
                Cargar Credenciales Demo
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Email: demo@geoentry.com</p>
                <p>Contraseña: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Ubicaciones Inteligentes</span>
            </div>
            <p className="text-xs text-blue-600/80 mt-1">
              Monitoreo automático de entradas y salidas
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Control Automatizado</span>
            </div>
            <p className="text-xs text-green-600/80 mt-1">
              Activación inteligente de dispositivos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
