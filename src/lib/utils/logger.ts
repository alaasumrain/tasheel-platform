/**
 * Centralized Logging Utility
 * 
 * Provides structured logging that can be easily replaced with
 * a proper logging service (e.g., Sentry, LogRocket) in the future.
 * 
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 *   logger.error('Error message', error, { context });
 *   logger.warn('Warning message', { context });
 *   logger.info('Info message', { context });
 *   logger.debug('Debug message', { context });
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings
    if (process.env.NODE_ENV === 'production') {
      return level === 'error' || level === 'warn';
    }
    // In development, log everything
    return true;
  }

  private formatMessage(level: LogLevel, message: string, error?: Error | unknown, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const errorStr = error instanceof Error ? ` ${error.message}${error.stack ? `\n${error.stack}` : ''}` : error ? ` ${String(error)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}${errorStr}`;
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog('error')) return;
    
    const formatted = this.formatMessage('error', message, error, context);
    console.error(formatted);
    
    // TODO: Send to error tracking service (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error || new Error(message), { extra: context });
    // }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return;
    
    const formatted = this.formatMessage('warn', message, undefined, context);
    console.warn(formatted);
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;
    
    const formatted = this.formatMessage('info', message, undefined, context);
    console.info(formatted);
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;
    
    const formatted = this.formatMessage('debug', message, undefined, context);
    console.debug(formatted);
  }

  /**
   * Audit logging - for important business events
   * Should eventually write to database audit table
   */
  audit(event: string, userId?: string, details?: LogContext): void {
    const context = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    };
    
    // In production, this should write to database audit table
    if (process.env.NODE_ENV === 'production') {
      // TODO: Write to database audit table
      // await supabase.from('audit_logs').insert({ ... });
      this.info(`[AUDIT] ${event}`, context);
    } else {
      this.info(`[AUDIT] ${event}`, context);
    }
  }
}

export const logger = new Logger();

