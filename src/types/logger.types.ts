/**
 * Log levels in order of severity (lowest to highest)
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * String representation of log levels
 */
export type LogLevelString = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Structured log entry with all metadata
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevelString;
  message: string;
  context?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  error?: ErrorInfo;
}

/**
 * Structured error information for logging
 */
export interface ErrorInfo {
  name: string;
  message: string;
  stack?: string;
  code?: string | number;
  cause?: ErrorInfo;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  level: LogLevel;
  /** Logger context/name (e.g., service name, module name) */
  context?: string;
  /** Whether to include timestamps */
  timestamps: boolean;
  /** Output format */
  format: 'json' | 'pretty';
  /** Whether to colorize output (only for pretty format) */
  colorize: boolean;
  /** Custom metadata to include in every log */
  defaultMetadata?: Record<string, unknown>;
}

/**
 * Interface for log formatters
 */
export interface LogFormatter {
  format(entry: LogEntry): string;
}

/**
 * Interface for log transports (output destinations)
 */
export interface LogTransport {
  log(formattedMessage: string, entry: LogEntry): void;
}

/**
 * Child logger options
 */
export interface ChildLoggerOptions {
  context?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Application error with additional context
 */
export interface AppErrorOptions {
  /** Error code for programmatic handling */
  code?: string;
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Additional context for debugging */
  context?: Record<string, unknown>;
  /** Original error that caused this error */
  cause?: Error;
  /** Whether this error is operational (expected) vs programmer error */
  isOperational?: boolean;
}

/**
 * Global error handler configuration
 */
export interface ErrorHandlerConfig {
  /** Whether to log the full stack trace */
  logStackTrace: boolean;
  /** Whether to exit on unhandled errors */
  exitOnUncaught: boolean;
  /** Custom error hook for notifications */
  onError?: (error: Error, context: Record<string, unknown>) => void;
}
