/**
 * Componente para visualización de logs
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Trash2, RefreshCw } from 'lucide-react';
import type { LogEntry } from '../types/api';
import { useLog } from '../contexts/LogContext';

interface LogViewerProps {
  logs?: LogEntry[];
  isLoading?: boolean;
  showActions?: boolean;
  maxHeight?: string;
  title?: string;
}

/**
 * Componente de skeleton para logs
 */
const LogSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-2 p-2 border rounded">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>
    ))}
  </div>
);

/**
 * Componente de entrada de log individual
 */
const LogEntry: React.FC<{ log: LogEntry }> = ({ log }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'enter':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exit':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <Badge className={getTypeColor(log.type)}>
        {log.type === 'enter' ? 'Entrada' : 'Salida'}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {log.message}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {log.user_name}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {log.location_name}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {formatTime(log.timestamp)}
      </div>
    </div>
  );
};

/**
 * Componente principal de visualización de logs
 */
const LogViewer: React.FC<LogViewerProps> = ({
  logs: externalLogs,
  isLoading = false,
  showActions = true,
  maxHeight = "400px",
  title = "Logs del Sistema",
}) => {
  const { logs: contextLogs, clearLogs, exportLogs } = useLog();
  const logs = externalLogs || contextLogs;

  const handleRefresh = () => {
    // Trigger a refresh - this would be implemented based on your data source
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LogSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {showActions && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
                disabled={logs.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay logs disponibles</p>
          </div>
        ) : (
          <ScrollArea className="space-y-2" style={{ maxHeight }}>
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default LogViewer;
