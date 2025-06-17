// Configuración centralizada de caché para la aplicación
export const CACHE_CONFIG = {
  // Tiempos de vida del caché en milisegundos
  TTL: {
    PROFILE: 30 * 60 * 1000,      // 30 minutos - Los perfiles cambian poco
    DEVICES: 5 * 60 * 1000,       // 5 minutos - Los dispositivos pueden cambiar más frecuentemente
    SENSORS: 2 * 60 * 1000,       // 2 minutos - Los sensores cambian frecuentemente
    LOCATIONS: 15 * 60 * 1000,    // 15 minutos - Las ubicaciones cambian poco
    LOGS: 1 * 60 * 1000,          // 1 minuto - Los logs cambian constantemente
    AUTH: 60 * 60 * 1000,         // 1 hora - La información de auth es crítica
  },
  
  // Tamaños máximos de caché
  MAX_SIZE: {
    PROFILE: 50,
    DEVICES: 200,
    SENSORS: 500,
    LOCATIONS: 100,
    LOGS: 1000,
    AUTH: 10,
  },
  
  // Configuraciones de retry y backoff
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 500,
    BACKOFF_FACTOR: 2,
    MAX_DELAY: 5000,
  },
  
  // Configuraciones de optimización
  OPTIMIZATION: {
    BATCH_SIZE: 50,               // Tamaño de lote para operaciones en masa
    DEBOUNCE_DELAY: 300,          // Retraso de debounce para búsquedas
    THROTTLE_INTERVAL: 1000,      // Intervalo de throttle para actualizaciones
    STALE_WHILE_REVALIDATE: true, // Usar datos stale mientras se revalida
  }
};

// Claves de caché estandarizadas
export const CACHE_KEYS = {
  PROFILE: (userId: string) => `profile:${userId}`,
  DEVICES: (userId: string) => `devices:${userId}`,
  DEVICE: (deviceId: string) => `device:${deviceId}`,
  SENSORS: (deviceId: string) => `sensors:${deviceId}`,
  LOCATIONS: (userId: string) => `locations:${userId}`,
  LOGS: (userId: string, type?: string) => type ? `logs:${userId}:${type}` : `logs:${userId}`,
  AUTH_SESSION: (userId: string) => `auth:session:${userId}`,
  USER_PREFERENCES: (userId: string) => `preferences:${userId}`,
};

// Patrones de invalidación de caché
export const CACHE_INVALIDATION_PATTERNS = {
  USER_DATA: (userId: string) => [`profile:${userId}`, `devices:${userId}`, `locations:${userId}`],
  DEVICE_DATA: (deviceId: string) => [`device:${deviceId}`, `sensors:${deviceId}`],
  ALL_USER_CACHE: (userId: string) => `*:${userId}*`,
};

// Configuraciones de red y timeouts
export const NETWORK_CONFIG = {
  REQUEST_TIMEOUT: 15000,        // 15 segundos
  RETRY_TIMEOUT: 30000,          // 30 segundos para reintentos
  KEEP_ALIVE_TIMEOUT: 5000,      // 5 segundos
  MAX_CONCURRENT_REQUESTS: 10,   // Máximo de requests concurrentes
};

// Configuraciones de desarrollo vs producción
export const getEnvironmentConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    DEBUG_CACHE: isDev,
    ENABLE_CACHE_STATS: isDev,
    CACHE_PERSISTENCE: !isDev,
    AGGRESSIVE_CLEANUP: !isDev,
    LOG_LEVEL: isDev ? 'debug' : 'warn',
  };
};

// Configuraciones de storage
export const STORAGE_CONFIG = {
  PREFIX: 'geontry_',
  SEPARATOR: ':',
  COMPRESSION: true,
  ENCRYPTION: false, // Podría habilitarse para datos sensibles
  MAX_STORAGE_SIZE: 10 * 1024 * 1024, // 10MB
};

// Eventos de caché para debugging y monitoreo
export const CACHE_EVENTS = {
  HIT: 'cache:hit',
  MISS: 'cache:miss',
  SET: 'cache:set',
  DELETE: 'cache:delete',
  CLEAR: 'cache:clear',
  EXPIRE: 'cache:expire',
  ERROR: 'cache:error',
};

// Configuraciones de métricas y monitoreo
export const METRICS_CONFIG = {
  ENABLE_METRICS: true,
  METRICS_INTERVAL: 60000, // 1 minuto
  TRACK_PERFORMANCE: true,
  TRACK_ERRORS: true,
  TRACK_CACHE_EFFICIENCY: true,
};
