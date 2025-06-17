// Sistema de caché persistente para la aplicación
import { CACHE_CONFIG, CACHE_EVENTS, getEnvironmentConfig } from './cache-config';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
  hits: number;
  lastAccessed: number;
  version: number;
}

interface CacheConfig {
  ttl: number; // Time to live en milisegundos
  maxSize: number; // Tamaño máximo del caché
  enableStats: boolean;
  persistent: boolean; // Persistir en localStorage
  storageKey: string; // Clave para localStorage
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
  lastClear: number;
}

class PersistentCache {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;
  private stats: CacheStats;
  private listeners: Set<(event: string, key: string, data?: any) => void> = new Set();
  private storagePrefix: string;
  private isHydrated = false;

  constructor(config: CacheConfig) {
    this.config = config;
    this.storagePrefix = `cache_${config.storageKey}_`;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      size: 0,
      hitRate: 0,
      lastClear: Date.now(),
    };

    // Hidratar desde localStorage si está habilitado
    if (config.persistent && typeof window !== 'undefined') {
      this.hydrateFromStorage();
      
      // Limpiar caché expirado cada minuto
      setInterval(() => this.cleanup(), 60000);
      
      // Guardar en localStorage antes de cerrar
      window.addEventListener('beforeunload', () => this.persistToStorage());
    } else {
      // Solo limpiar caché expirado si no es persistente
      if (typeof window !== 'undefined') {
        setInterval(() => this.cleanup(), 60000);
      }
    }
  }

  private hydrateFromStorage(): void {
    try {
      const keys = this.getStorageKeys();
      let loadedItems = 0;
      
      keys.forEach(key => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          try {
            const parsed: CacheItem<any> = JSON.parse(storedData);
            const cacheKey = key.replace(this.storagePrefix, '');
            
            // Verificar si el item no ha expirado
            if (Date.now() <= parsed.expiry) {
              this.cache.set(cacheKey, parsed);
              loadedItems++;
            } else {
              // Limpiar item expirado del storage
              localStorage.removeItem(key);
            }
          } catch (parseError) {
            // Si hay error al parsear, eliminar el item
            localStorage.removeItem(key);
          }
        }
      });
      
      this.stats.size = this.cache.size;
      this.isHydrated = true;
      
      if (loadedItems > 0) {
        console.log(`[Cache] Hydrated ${loadedItems} items from localStorage`);
      }
    } catch (error) {
      console.warn('[Cache] Error hydrating from storage:', error);
      this.isHydrated = true;
    }
  }

  private persistToStorage(): void {
    if (!this.config.persistent) return;
    
    try {
      // Limpiar storage anterior
      this.clearStorage();
      
      // Guardar items actuales
      this.cache.forEach((item, key) => {
        // Solo persistir items que no han expirado
        if (Date.now() <= item.expiry) {
          const storageKey = this.storagePrefix + key;
          localStorage.setItem(storageKey, JSON.stringify(item));
        }
      });
    } catch (error) {
      console.warn('[Cache] Error persisting to storage:', error);
    }
  }

  private getStorageKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  private clearStorage(): void {
    const keys = this.getStorageKeys();
    keys.forEach(key => localStorage.removeItem(key));
  }

  set<T>(key: string, data: T, customTtl?: number): void {
    const ttl = customTtl || this.config.ttl;
    const now = Date.now();
    
    // Limpiar caché si está lleno
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiry: now + ttl,
      hits: 0,
      lastAccessed: now,
      version: 1
    };

    this.cache.set(key, item);
    this.stats.sets++;
    this.stats.size = this.cache.size;
    
    // Persistir inmediatamente si está habilitado
    if (this.config.persistent && this.isHydrated) {
      try {
        const storageKey = this.storagePrefix + key;
        localStorage.setItem(storageKey, JSON.stringify(item));
      } catch (error) {
        console.warn(`[Cache] Error persisting key ${key}:`, error);
      }
    }
    
    this.emit(CACHE_EVENTS.SET, key, data);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.updateHitRate();
      this.emit(CACHE_EVENTS.MISS, key);
      return null;
    }

    // Verificar si el item ha expirado
    if (Date.now() > item.expiry) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      this.emit(CACHE_EVENTS.EXPIRE, key);
      return null;
    }

    // Actualizar estadísticas de acceso
    item.hits++;
    item.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();
    this.emit(CACHE_EVENTS.HIT, key);

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Verificar si el item ha expirado
    if (Date.now() > item.expiry) {
      this.delete(key);
      this.emit(CACHE_EVENTS.EXPIRE, key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    if (this.cache.delete(key)) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
      
      // Eliminar del storage también
      if (this.config.persistent) {
        try {
          const storageKey = this.storagePrefix + key;
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.warn(`[Cache] Error removing key ${key} from storage:`, error);
        }
      }
      
      this.emit(CACHE_EVENTS.DELETE, key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.lastClear = Date.now();
    
    // Limpiar storage también
    if (this.config.persistent) {
      this.clearStorage();
    }
    
    this.emit(CACHE_EVENTS.CLEAR, 'all');
  }

  // Obtener datos de forma stale-while-revalidate
  async getWithRevalidation<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options?: { 
      forceRevalidation?: boolean;
      revalidationTtl?: number;
    }
  ): Promise<T> {
    const { forceRevalidation = false, revalidationTtl } = options || {};
    
    // Si no hay revalidación forzada, intentar obtener del caché
    if (!forceRevalidation) {
      const cached = this.get<T>(key);
      if (cached) {
        // Datos están disponibles, revalidar en background si es necesario
        const item = this.cache.get(key);
        const shouldRevalidate = item && (Date.now() - item.timestamp) > (revalidationTtl || this.config.ttl / 2);
        
        if (shouldRevalidate) {
          // Revalidar en background
          fetcher().then(newData => {
            this.set(key, newData);
          }).catch(error => {
            console.warn(`[Cache] Background revalidation failed for key ${key}:`, error);
          });
        }
        
        return cached;
      }
    }
    
    // No hay datos en caché o revalidación forzada, obtener datos frescos
    const data = await fetcher();
    this.set(key, data);
    return data;
  }

  // Limpiar items expirados
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.delete(key);
    });

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired items`);
    }
  }

  // Evitar el elemento menos usado (LRU)
  private evictLeastUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((item, key) => {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      console.log(`[Cache] Evicting least used key: ${oldestKey}`);
      this.delete(oldestKey);
    }
  }

  private updateHitRate(): void {
    const totalRequests = this.stats.hits + this.stats.misses;
    this.stats.hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
  }

  private emit(event: string, key: string, data?: any): void {
    if (this.config.enableStats) {
      this.listeners.forEach(listener => {
        try {
          listener(event, key, data);
        } catch (error) {
          console.error('[Cache] Error in cache listener:', error);
        }
      });
    }
  }

  // Invalidar por patrón
  invalidatePattern(pattern: string): number {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.includes(pattern) || key.match(new RegExp(pattern))) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.delete(key));
    
    return keysToDelete.length;
  }

  // Obtener estadísticas del caché
  getStats(): CacheStats & { memoryUsage?: number } {
    let memoryUsage = 0;
    
    // Calcular uso aproximado de memoria
    this.cache.forEach((item) => {
      try {
        memoryUsage += JSON.stringify(item).length * 2; // chars to bytes (aproximado)
      } catch (e) {
        // Ignorar errores de stringify
      }
    });
    
    return { 
      ...this.stats,
      memoryUsage: Math.round(memoryUsage / 1024) // KB
    };
  }

  // Suscribirse a eventos de caché
  subscribe(listener: (event: string, key: string, data?: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Obtener información detallada del caché
  getDetails() {
    const items: Array<{
      key: string;
      size: number;
      hits: number;
      lastAccessed: Date;
      expiresAt: Date;
      version: number;
    }> = [];
    
    this.cache.forEach((item, key) => {
      try {
        items.push({
          key,
          size: JSON.stringify(item.data).length * 2, // aproximado
          hits: item.hits,
          lastAccessed: new Date(item.lastAccessed),
          expiresAt: new Date(item.expiry),
          version: item.version
        });
      } catch (e) {
        // Ignorar items que no se pueden stringify
      }
    });

    return {
      stats: this.getStats(),
      items: items.sort((a, b) => b.hits - a.hits), // Ordenar por hits
      config: this.config,
      isHydrated: this.isHydrated
    };
  }
}

const envConfig = getEnvironmentConfig();

// Instancias de caché con configuraciones específicas
export const profileCache = new PersistentCache({
  ttl: CACHE_CONFIG.TTL.PROFILE,
  maxSize: CACHE_CONFIG.MAX_SIZE.PROFILE,
  enableStats: envConfig.ENABLE_CACHE_STATS,
  persistent: envConfig.CACHE_PERSISTENCE,
  storageKey: 'profiles'
});

export const deviceCache = new PersistentCache({
  ttl: CACHE_CONFIG.TTL.DEVICES,
  maxSize: CACHE_CONFIG.MAX_SIZE.DEVICES,
  enableStats: envConfig.ENABLE_CACHE_STATS,
  persistent: envConfig.CACHE_PERSISTENCE,
  storageKey: 'devices'
});

export const sensorCache = new PersistentCache({
  ttl: CACHE_CONFIG.TTL.SENSORS,
  maxSize: CACHE_CONFIG.MAX_SIZE.SENSORS,
  enableStats: envConfig.ENABLE_CACHE_STATS,
  persistent: envConfig.CACHE_PERSISTENCE,
  storageKey: 'sensors'
});

export const locationCache = new PersistentCache({
  ttl: CACHE_CONFIG.TTL.LOCATIONS,
  maxSize: CACHE_CONFIG.MAX_SIZE.LOCATIONS,
  enableStats: envConfig.ENABLE_CACHE_STATS,
  persistent: envConfig.CACHE_PERSISTENCE,
  storageKey: 'locations'
});

export const appCache = new PersistentCache({
  ttl: CACHE_CONFIG.TTL.AUTH,
  maxSize: CACHE_CONFIG.MAX_SIZE.AUTH,
  enableStats: envConfig.ENABLE_CACHE_STATS,
  persistent: false, // Auth no debe persistir por seguridad
  storageKey: 'app'
});

// Funciones utilitarias para el caché
export const generateCacheKey = (...parts: string[]): string => {
  return parts.filter(Boolean).join(':');
};

export const invalidateCache = (pattern: string): void => {
  const caches = [profileCache, deviceCache, sensorCache, locationCache, appCache];
  let totalInvalidated = 0;
  
  caches.forEach(cache => {
    totalInvalidated += cache.invalidatePattern(pattern);
  });
  
  if (totalInvalidated > 0) {
    console.log(`[Cache] Invalidated ${totalInvalidated} items matching pattern: ${pattern}`);
  }
};

export const invalidateUserCache = (userId: string): void => {
  const patterns = [
    `profile:${userId}`,
    `devices:${userId}`,
    `sensors:${userId}`,
    `locations:${userId}`
  ];
  
  patterns.forEach(pattern => invalidateCache(pattern));
};

export const getAllCacheStats = () => {
  return {
    profile: profileCache.getStats(),
    device: deviceCache.getStats(),
    sensor: sensorCache.getStats(),
    location: locationCache.getStats(),
    app: appCache.getStats(),
  };
};

export const clearAllCaches = () => {
  profileCache.clear();
  deviceCache.clear();
  sensorCache.clear();
  locationCache.clear();
  appCache.clear();
  console.log('[Cache] All caches cleared');
};

// Debugging en desarrollo
if (envConfig.DEBUG_CACHE && typeof window !== 'undefined') {
  (window as any).cacheDebug = {
    stats: getAllCacheStats,
    details: {
      profile: () => profileCache.getDetails(),
      device: () => deviceCache.getDetails(),
      sensor: () => sensorCache.getDetails(),
      location: () => locationCache.getDetails(),
      app: () => appCache.getDetails(),
    },
    clear: {
      profile: () => profileCache.clear(),
      device: () => deviceCache.clear(),
      sensor: () => sensorCache.clear(),
      location: () => locationCache.clear(),
      app: () => appCache.clear(),
      all: clearAllCaches
    },
    invalidate: {
      user: invalidateUserCache,
      pattern: invalidateCache
    }
  };
  
  console.log('[Cache] Debug interface available at window.cacheDebug');
}
