import { v4 as uuidv4 } from 'uuid';
import {
  LogLevel,
  LogLevelString,
  LogEntry,
  LoggerConfig,
  LogFormatter,
  LogTransport,
  ErrorInfo,
  ChildLoggerOptions,
} from '../types/logger.types';
import { createFormatter } from './formatters';
import { createConsoleTransport } from './transports';

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  timestamps: true,
  format: 'pretty',
  colorize: true,
};

/**
 * Map of string log levels to enum values
 */
const LOG_LEVEL_MAP: Record<LogLevelString, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  fatal: LogLevel.FATAL,
};

/**
 * Main Logger class with support for:
 * - Multiple log levels (debug, info, warn, error, fatal)
 * - Structured logging with metadata
 * - Correlation IDs for request tracing
 * - Context-aware child loggers
 * - Configurable formatters and transports
 */
export class Logger {
  private config: LoggerConfig;
  private formatter: LogFormatter;
  private transports: LogTransport[];
  private correlationId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.formatter = createFormatter(this.config.format, this.config.colorize);
    this.transports = [createConsoleTransport()];
  }

  /**
   * Add a custom transport
   */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Set a custom formatter
   */
  setFormatter(formatter: LogFormatter): void {
    this.formatter = formatter;
  }

  /**
   * Set the correlation ID for request tracing
   */
  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  /**
   * Generate a new correlation ID
   */
  generateCorrelationId(): string {
    this.correlationId = uuidv4();
    return this.correlationId;
  }

  /**
   * Get the current correlation ID
   */
  getCorrelationId(): string | undefined {
    return this.correlationId;
  }

  /**
   * Create a child logger with inherited configuration
   */
  child(options: ChildLoggerOptions): Logger {
    const childConfig: Partial<LoggerConfig> = {
      ...this.config,
      context: options.context || this.config.context,
      defaultMetadata: {
        ...this.config.defaultMetadata,
        ...options.metadata,
      },
    };

    const childLogger = new Logger(childConfig);
    childLogger.transports = this.transports;
    childLogger.formatter = this.formatter;
    
    if (this.correlationId) {
      childLogger.setCorrelationId(this.correlationId);
    }

    return childLogger;
  }

  /**
   * Log a debug message
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Log an info message
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    const errorInfo = error ? this.extractErrorInfo(error) : undefined;
    this.log('error', message, metadata, errorInfo);
  }

  /**
   * Log a fatal error message
   */
  fatal(message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    const errorInfo = error ? this.extractErrorInfo(error) : undefined;
    this.log('fatal', message, metadata, errorInfo);
  }

  /**
   * Log with timing information for performance monitoring
   */
  time(label: string): () => void {
    const start = performance.now();
    this.debug(`Timer started: ${label}`);
    
    return () => {
      const duration = performance.now() - start;
      this.info(`Timer ended: ${label}`, { duration_ms: Math.round(duration * 100) / 100 });
    };
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevelString,
    message: string,
    metadata?: Record<string, unknown>,
    error?: ErrorInfo
  ): void {
    // Check if this level should be logged
    if (LOG_LEVEL_MAP[level] < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: this.config.timestamps ? new Date().toISOString() : '',
      level,
      message,
      context: this.config.context,
      correlationId: this.correlationId,
      metadata: { ...this.config.defaultMetadata, ...metadata },
      error,
    };

    // Clean up empty metadata
    if (entry.metadata && Object.keys(entry.metadata).length === 0) {
      delete entry.metadata;
    }

    const formattedMessage = this.formatter.format(entry);

    for (const transport of this.transports) {
      transport.log(formattedMessage, entry);
    }
  }

  /**
   * Extract error information including cause chain
   */
  private extractErrorInfo(error: unknown): ErrorInfo {
    if (error instanceof Error) {
      const info: ErrorInfo = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      // Handle error codes (common in Node.js)
      if ('code' in error) {
        info.code = (error as { code: string | number }).code;
      }

      // Handle error cause (ES2022 Error cause)
      if ('cause' in error && error.cause) {
        info.cause = this.extractErrorInfo(error.cause);
      }

      return info;
    }

    // Handle non-Error objects
    return {
      name: 'UnknownError',
      message: String(error),
    };
  }
}

/**
 * Create a configured logger instance
 */
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}

/**
 * Default logger instance for convenience
 */
export const defaultLogger = createLogger();
