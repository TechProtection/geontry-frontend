import { useState } from 'react';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

export function EmergencyReset() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleReset = () => {
    window.localStorage.clear();
    window.location.href = '/login';
  };
  
  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 z-50 rounded-full h-8 w-8 bg-red-600 hover:bg-red-700 border-none"
        onClick={() => setIsOpen(true)}
      >
        <AlertCircle className="h-4 w-4 text-white" />
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border shadow-lg rounded-lg p-4 max-w-xs">
      <h3 className="text-sm font-medium mb-2">Opciones de emergencia</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Si estás experimentando problemas con la sesión, usa estas opciones:
      </p>
      <div className="space-y-2">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={handleReset}
        >
          Reiniciar sesión
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setIsOpen(false)}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}