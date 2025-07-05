/**
 * Componente de loading simple y reutilizable
 */

import React from 'react';

interface SimpleLoadingProps {
  title: string;
  description?: string;
  message?: string;
}

export const SimpleLoading: React.FC<SimpleLoadingProps> = ({ 
  title, 
  description, 
  message = "Cargando..." 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

interface SimpleErrorProps {
  title: string;
  description?: string;
  error: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const SimpleError: React.FC<SimpleErrorProps> = ({
  title,
  description,
  error,
  onRetry,
  retryLabel = "Reintentar"
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
