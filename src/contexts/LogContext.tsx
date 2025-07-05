/**
 * Contexto para gestión de logs del sistema
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LogEntry, ProximityEvent } from '../types/api';

interface LogContextType {
  logs: LogEntry[];
  addLog: (event: ProximityEvent) => void;
  clearLogs: () => void;
  exportLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};

interface LogProviderProps {
  children: React.ReactNode;
}

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Cargar logs desde localStorage al inicializar
  useEffect(() => {
    const savedLogs = localStorage.getItem('geoentry-logs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setLogs(parsedLogs);
      } catch (error) {
        console.error('Error parsing saved logs:', error);
      }
    }
  }, []);

  // Guardar logs en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('geoentry-logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((event: ProximityEvent) => {
    const logEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: event.type,
      message: generateLogMessage(event),
      user_name: event.user?.full_name || 'Usuario desconocido',
      location_name: event.home_location_name,
      timestamp: event.created_at,
    };

    setLogs((prevLogs) => [logEntry, ...prevLogs].slice(0, 1000)); // Mantener máximo 1000 logs
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem('geoentry-logs');
  }, []);

  const exportLogs = useCallback(() => {
    const csv = [
      ['Timestamp', 'Type', 'User', 'Location', 'Message'],
      ...logs.map((log) => [
        log.timestamp,
        log.type,
        log.user_name,
        log.location_name,
        log.message,
      ]),
    ];

    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `geoentry-logs-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [logs]);

  const value = {
    logs,
    addLog,
    clearLogs,
    exportLogs,
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};

/**
 * Genera un mensaje de log basado en el evento de proximidad
 */
const generateLogMessage = (event: ProximityEvent): string => {
  const userName = event.user?.full_name || 'Usuario desconocido';
  const locationName = event.home_location_name;
  const time = new Date(event.created_at).toLocaleTimeString();

  if (event.type === 'enter') {
    return `${userName} entró a ${locationName} a las ${time}`;
  } else {
    return `${userName} salió de ${locationName} a las ${time}`;
  }
};
