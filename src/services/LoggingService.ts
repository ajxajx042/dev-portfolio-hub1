// Comprehensive Logging Service - Records all actions persistently
export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'auth' | 'data' | 'system' | 'security' | 'navigation' | 'user_action';
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
  userId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

const LOG_STORAGE_KEY = 'nexus_audit_logs';
const MAX_LOGS = 500;

class LoggingService {
  private logs: LogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      // Keep only last MAX_LOGS entries
      if (this.logs.length > MAX_LOGS) {
        this.logs = this.logs.slice(-MAX_LOGS);
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Failed to save logs:', e);
    }
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSimulatedIP(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  log(type: LogEntry['type'], level: LogEntry['level'], message: string, source: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type,
      level,
      message,
      source,
      metadata,
      ipAddress: this.getSimulatedIP(),
      userAgent: navigator.userAgent.substring(0, 100),
    };

    this.logs.push(entry);
    this.saveLogs();
    return entry;
  }

  // Convenience methods
  logAuth(message: string, userId?: string, success = true) {
    return this.log('auth', success ? 'success' : 'error', message, 'Auth Service', { userId });
  }

  logNavigation(page: string, userId?: string) {
    return this.log('navigation', 'info', `Page visited: ${page}`, 'Router', { page, userId });
  }

  logDataAccess(action: string, resource: string, userId?: string) {
    return this.log('data', 'info', `${action}: ${resource}`, 'Data Service', { action, resource, userId });
  }

  logSecurity(message: string, level: LogEntry['level'] = 'warning') {
    return this.log('security', level, message, 'Security Module');
  }

  logSystem(message: string, source: string = 'System') {
    return this.log('system', 'info', message, source);
  }

  logUserAction(action: string, details?: Record<string, any>) {
    return this.log('user_action', 'info', action, 'User Activity', details);
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs].reverse();
  }

  getLogsByType(type: LogEntry['type']): LogEntry[] {
    return this.logs.filter(l => l.type === type).reverse();
  }

  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(l => l.level === level).reverse();
  }

  searchLogs(query: string): LogEntry[] {
    const q = query.toLowerCase();
    return this.logs.filter(l =>
      l.message.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q) ||
      l.type.includes(q)
    ).reverse();
  }

  getStats() {
    return {
      total: this.logs.length,
      byType: {
        auth: this.logs.filter(l => l.type === 'auth').length,
        data: this.logs.filter(l => l.type === 'data').length,
        system: this.logs.filter(l => l.type === 'system').length,
        security: this.logs.filter(l => l.type === 'security').length,
        navigation: this.logs.filter(l => l.type === 'navigation').length,
        user_action: this.logs.filter(l => l.type === 'user_action').length,
      },
      byLevel: {
        info: this.logs.filter(l => l.level === 'info').length,
        warning: this.logs.filter(l => l.level === 'warning').length,
        error: this.logs.filter(l => l.level === 'error').length,
        success: this.logs.filter(l => l.level === 'success').length,
      },
      last24h: this.logs.filter(l => {
        const logTime = new Date(l.timestamp).getTime();
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return logTime > dayAgo;
      }).length,
    };
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }
}

export const loggingService = new LoggingService();
