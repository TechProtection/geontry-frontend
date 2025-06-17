// Sistema de caché avanzado para la aplicación
import { CACHE_CONFIG, CACHE_EVENTS, getEnvironmentConfig } from './cache-config';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
  hits: number;
  lastAccessed: number;
}

interface CacheConfig {
  ttl: number; // Time to live en milisegundos
  maxSize: number; // Tamaño máximo del caché
  enableStats: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;
  private stats: CacheStats;
  private listeners: Set<(event: string, key: string, data?: any) => void> = new Set();

  constructor(config: CacheConfig) {
    this.config = config;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      size: 0,
      hitRate: 0,
    };

    // Limpiar caché expirado periódicamente
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60000); // Cada minuto
    }
  }

  set<T>(key: string, data: T, customTtl?: number): void {
    const ttl = customTtl || this.config.ttl;
    const now = Date.now();
    
    // Limpiar caché si está lleno
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl,
      hits: 0,
      lastAccessed: now
    });

    this.stats.sets++;
    this.stats.size = this.cache.size;
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
      this.cache.delete(key);
      this.stats.size = this.cache.size;
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
      this.cache.delete(key);
      this.stats.size = this.cache.size;
      this.emit(CACHE_EVENTS.EXPIRE, key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    if (this.cache.delete(key)) {
      this.stats.deletes++;
      this.stats.size = this.cache.size;
      this.emit(CACHE_EVENTS.DELETE, key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.emit(CACHE_EVENTS.CLEAR, 'all');
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
      this.cache.delete(key);
      this.emit(CACHE_EVENTS.EXPIRE, key);
    });

    if (keysToDelete.length > 0) {
      this.stats.size = this.cache.size;
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
          console.error('Error in cache listener:', error);
        }
      });
    }
  }

  // Obtener estadísticas del caché
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Suscribirse a eventos de caché
  subscribe(listener: (event: string, key: string, data?: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Obtener información detallada del caché
  getDetails() {
    const items: Array<{key: string, size: number, hits: number, lastAccessed: Date, expiresAt: Date}> = [];
    
    this.cache.forEach((item, key) => {
      items.push({
        key,
        size: JSON.stringify(item.data).length,
        hits: item.hits,
        lastAccessed: new Date(item.lastAccessed),
        expiresAt: new Date(item.expiry)
      });
    });

    return {
      stats: this.getStats(),
      items: items.sort((a, b) => b.hits - a.hits), // Ordenar por hits
      config: this.config
    };
  }
}

const envConfig = getEnvironmentConfig();

// Instancias de caché con configuraciones específicas
export const appCache = new Cache({
  ttl: CACHE_CONFIG.TTL.PROFILE,
  maxSize: CACHE_CONFIG.MAX_SIZE.PROFILE,
  enableStats: envConfig.ENABLE_CACHE_STATS
});

export const profileCache = new Cache({
  ttl: CACHE_CONFIG.TTL.PROFILE,
  maxSize: CACHE_CONFIG.MAX_SIZE.PROFILE,
  enableStats: envConfig.ENABLE_CACHE_STATS
});

export const deviceCache = new Cache({
  ttl: CACHE_CONFIG.TTL.DEVICES,
  maxSize: CACHE_CONFIG.MAX_SIZE.DEVICES,
  enableStats: envConfig.ENABLE_CACHE_STATS
});

export const sensorCache = new Cache({
  ttl: CACHE_CONFIG.TTL.SENSORS,
  maxSize: CACHE_CONFIG.MAX_SIZE.SENSORS,
  enableStats: envConfig.ENABLE_CACHE_STATS
});

// Funciones utilitarias para el caché
export const generateCacheKey = (...parts: string[]): string => {
  return parts.join(':');
};

export const invalidateCache = (pattern: string): void => {
  [appCache, profileCache, deviceCache, sensorCache].forEach(cache => {
    const keys = Array.from((cache as any).cache.keys()) as string[];
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    });
  });
};

export const invalidateUserCache = (userId: string): void => {
  const patterns = [`profile:${userId}`, `devices:${userId}`, `sensors:${userId}`];
  patterns.forEach(pattern => invalidateCache(pattern));
};

export const getAllCacheStats = () => {
  return {
    app: appCache.getStats(),
    profile: profileCache.getStats(),
    device: deviceCache.getStats(),
    sensor: sensorCache.getStats(),
  };
};

// Debugging en desarrollo
if (envConfig.DEBUG_CACHE && typeof window !== 'undefined') {
  (window as any).cacheDebug = {
    stats: getAllCacheStats,
    details: {
      app: () => appCache.getDetails(),
      profile: () => profileCache.getDetails(),
      device: () => deviceCache.getDetails(),
      sensor: () => sensorCache.getDetails(),
    },
    clear: {
      app: () => appCache.clear(),
      profile: () => profileCache.clear(),
      device: () => deviceCache.clear(),
      sensor: () => sensorCache.clear(),
      all: () => {
        appCache.clear();
        profileCache.clear();
        deviceCache.clear();
        sensorCache.clear();
      }
    }
  };
}
