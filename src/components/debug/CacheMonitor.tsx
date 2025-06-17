import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllCacheStats, clearAllCaches } from '@/lib/persistent-cache';
import { RefreshCw, Trash2, Database, TrendingUp, Clock } from 'lucide-react';

interface CacheMonitorProps {
  className?: string;
}

export function CacheMonitor({ className }: CacheMonitorProps) {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Solo mostrar en desarrollo
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  const refreshStats = () => {
    setStats(getAllCacheStats());
  };

  const clearCaches = () => {
    clearAllCaches();
    refreshStats();
  };

  useEffect(() => {
    if (isVisible) {
      refreshStats();
      
      // Actualizar cada 5 segundos
      const interval = setInterval(refreshStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible || !stats) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatHitRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Monitor de Caché
            </CardTitle>
            <CardDescription>
              Estadísticas en tiempo real del sistema de caché
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={clearCaches}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).map(([cacheName, cacheStats]: [string, any]) => (
                <div key={cacheName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">{cacheName}</h4>
                    <Badge variant={cacheStats.hitRate > 70 ? "default" : cacheStats.hitRate > 40 ? "secondary" : "destructive"}>
                      {formatHitRate(cacheStats.hitRate)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{cacheStats.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hits:</span>
                      <span className="text-green-600">{cacheStats.hits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Misses:</span>
                      <span className="text-red-600">{cacheStats.misses}</span>
                    </div>
                    {cacheStats.memoryUsage && (
                      <div className="flex justify-between">
                        <span>Memoria:</span>
                        <span>{formatBytes(cacheStats.memoryUsage * 1024)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {Object.entries(stats).map(([cacheName, cacheStats]: [string, any]) => (
              <Card key={cacheName}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base capitalize flex items-center gap-2">
                    {cacheName === 'profile' && <TrendingUp className="h-4 w-4" />}
                    {cacheName === 'device' && <Database className="h-4 w-4" />}
                    {cacheName === 'sensor' && <Clock className="h-4 w-4" />}
                    {cacheName === 'location' && <RefreshCw className="h-4 w-4" />}
                    {cacheName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Total Requests:</span>
                        <span>{cacheStats.hits + cacheStats.misses}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Cache Hits:</span>
                        <span className="text-green-600">{cacheStats.hits}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Cache Misses:</span>
                        <span className="text-red-600">{cacheStats.misses}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Hit Rate:</span>
                        <Badge variant={cacheStats.hitRate > 70 ? "default" : cacheStats.hitRate > 40 ? "secondary" : "destructive"}>
                          {formatHitRate(cacheStats.hitRate)}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Items Cached:</span>
                        <span>{cacheStats.size}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Sets/Deletes:</span>
                        <span>{cacheStats.sets}/{cacheStats.deletes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default CacheMonitor;
