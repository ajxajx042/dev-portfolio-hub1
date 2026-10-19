// Security Service - Session management, validation, threat detection
export interface Session {
  id: string;
  userId: string;
  startTime: string;
  lastActivity: string;
  ip: string;
  device: string;
  location: string;
  isActive: boolean;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'suspicious' | '2fa_verify';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
}

const SESSIONS_KEY = 'nexus_sessions';
const SECURITY_EVENTS_KEY = 'nexus_security_events';
const RATE_LIMIT_KEY = 'nexus_rate_limit';

class SecurityService {
  // Session Management
  createSession(userId: string): Session {
    const session: Session = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ip: this.getSimulatedIP(),
      device: this.getDevice(),
      location: this.getSimulatedLocation(),
      isActive: true,
    };

    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return session;
  }

  getSessions(): Session[] {
    try {
      return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  getActiveSessions(): Session[] {
    return this.getSessions().filter(s => s.isActive);
  }

  endSession(sessionId: string) {
    const sessions = this.getSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      sessions[idx].isActive = false;
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  }

  endAllSessions(userId: string) {
    const sessions = this.getSessions();
    sessions.forEach(s => {
      if (s.userId === userId) s.isActive = false;
    });
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  updateSessionActivity(sessionId: string) {
    const sessions = this.getSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx >= 0) {
      sessions[idx].lastActivity = new Date().toISOString();
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  }

  // Security Events
  recordSecurityEvent(type: SecurityEvent['type'], severity: SecurityEvent['severity'], description: string): SecurityEvent {
    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type,
      severity,
      description,
      resolved: false,
    };

    const events = this.getSecurityEvents();
    events.push(event);
    // Keep last 200 events
    if (events.length > 200) events.splice(0, events.length - 200);
    localStorage.setItem(SECURITY_EVENTS_KEY, JSON.stringify(events));
    return event;
  }

  getSecurityEvents(): SecurityEvent[] {
    try {
      return JSON.parse(localStorage.getItem(SECURITY_EVENTS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  resolveEvent(eventId: string) {
    const events = this.getSecurityEvents();
    const idx = events.findIndex(e => e.id === eventId);
    if (idx >= 0) {
      events[idx].resolved = true;
      localStorage.setItem(SECURITY_EVENTS_KEY, JSON.stringify(events));
    }
  }

  // Rate Limiting
  checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const key = `${RATE_LIMIT_KEY}_${action}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{"count":0,"resetAt":0}');
      const now = Date.now();

      if (now > data.resetAt) {
        localStorage.setItem(key, JSON.stringify({ count: 1, resetAt: now + windowMs }));
        return true;
      }

      if (data.count >= maxAttempts) {
        return false;
      }

      data.count++;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      return true;
    }
  }

  // Input Validation & Sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password: string): { valid: boolean; strength: number; issues: string[] } {
    const issues: string[] = [];
    let strength = 0;

    if (password.length < 8) issues.push('At least 8 characters');
    else strength += 25;

    if (!/[A-Z]/.test(password)) issues.push('One uppercase letter');
    else strength += 25;

    if (!/[a-z]/.test(password)) issues.push('One lowercase letter');
    else strength += 15;

    if (!/[0-9]/.test(password)) issues.push('One number');
    else strength += 20;

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) issues.push('One special character');
    else strength += 15;

    return { valid: issues.length === 0, strength, issues };
  }

  // Password Hashing Simulation (in real app, use bcrypt on server)
  hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `hashed_${Math.abs(hash).toString(36)}_${password.length}`;
  }

  // CSRF Token Generation
  generateCSRFToken(): string {
    const token = `csrf_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  validateCSRFToken(token: string): boolean {
    return sessionStorage.getItem('csrf_token') === token;
  }

  // Security Score
  getSecurityScore(): number {
    let score = 100;
    const events = this.getSecurityEvents();
    const unresolved = events.filter(e => !e.resolved);

    unresolved.forEach(e => {
      if (e.severity === 'critical') score -= 20;
      else if (e.severity === 'high') score -= 10;
      else if (e.severity === 'medium') score -= 5;
      else score -= 2;
    });

    return Math.max(0, score);
  }

  // Helpers
  private getSimulatedIP(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  private getDevice(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Mobile')) return 'Mobile Device';
    if (ua.includes('Tablet')) return 'Tablet';
    return 'Desktop Browser';
  }

  private getSimulatedLocation(): string {
    const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Mumbai, IN', 'São Paulo, BR', 'Dubai, AE'];
    return locations[Math.floor(Math.random() * locations.length)];
  }
}

export const securityService = new SecurityService();
