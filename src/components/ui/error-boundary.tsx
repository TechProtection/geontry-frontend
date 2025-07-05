/**
 * Componente para manejo de errores reutilizable
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorBoundaryProps {
  error?: Error | string | null;
  onRetry?: () => void;
  title?: string;
  className?: string;
  showRetry?: boolean;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry,
  title = 'Ha ocurrido un error',
  className = '',
  showRetry = true
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`p-6 ${className}`}>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {errorMessage || 'Se ha producido un error inesperado.'}
        </AlertDescription>
        {showRetry && onRetry && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
};

export default ErrorBoundary;
