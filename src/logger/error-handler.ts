import { createLogger, Logger } from './logger';
import { AppErrorOptions, ErrorHandlerConfig, LogLevel } from '../types/logger.types';

/**
 * Custom application error class with structured context
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context: Record<string, unknown>;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
    
    this.name = this.constructor.name;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.statusCode = options.statusCode || 500;
    this.context = options.context || {};
    this.isOperational = options.isOperational ?? true;
    this.timestamp = new Date();
    
    // Set cause if provided (ES2022 feature)
    if (options.cause) {
      this.cause = options.cause;
    }
  }

  /**
   * Convert error to a safe object for logging/API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

/**
 * Specialized error classes for common scenarios
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      context,
      isOperational: true,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, unknown>) {
    super(message, {
      code: 'AUTHENTICATION_ERROR',
      statusCode: 401,
      context,
      isOperational: true,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, unknown>) {
    super(message, {
      code: 'AUTHORIZATION_ERROR',
      statusCode: 403,
      context,
      isOperational: true,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(`${resource} not found${identifier ? `: ${identifier}` : ''}`, {
      code: 'NOT_FOUND',
      statusCode: 404,
      context: { resource, identifier },
      isOperational: true,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, {
      code: 'CONFLICT',
      statusCode: 409,
      context,
      isOperational: true,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: Error, context?: Record<string, unknown>) {
    super(`External service error: ${service}`, {
      code: 'EXTERNAL_SERVICE_ERROR',
      statusCode: 502,
      context: { service, ...context },
      cause: originalError,
      isOperational: true,
    });
  }
}

/**
 * Default error handler configuration
 */
const DEFAULT_ERROR_CONFIG: ErrorHandlerConfig = {
  logStackTrace: true,
  exitOnUncaught: true,
};

/**
 * Global error handler for centralized error management
 */
export class GlobalErrorHandler {
  private logger: Logger;
  private config: ErrorHandlerConfig;

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = { ...DEFAULT_ERROR_CONFIG, ...config };
    this.logger = createLogger({
      context: 'ErrorHandler',
      level: LogLevel.ERROR,
      format: 'pretty',
    });
  }

  /**
   * Handle an error with full context logging
   */
  handle(error: Error, additionalContext?: Record<string, unknown>): void {
    const context = {
      ...additionalContext,
      ...(error instanceof AppError ? error.context : {}),
    };

    if (error instanceof AppError) {
      this.handleAppError(error, context);
    } else {
      this.handleUnknownError(error, context);
    }

    // Call custom error hook if configured
    if (this.config.onError) {
      try {
        this.config.onError(error, context);
      } catch (hookError) {
        this.logger.error('Error in error hook', hookError);
      }
    }
  }

  /**
   * Handle known application errors
   */
  private handleAppError(error: AppError, context: Record<string, unknown>): void {
    const metadata = {
      errorCode: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      ...context,
    };

    if (error.isOperational) {
      // Operational errors are expected (validation, auth, not found, etc.)
      this.logger.warn(`Operational error: ${error.message}`, metadata);
    } else {
      // Non-operational errors are bugs that need attention
      this.logger.error('Non-operational error occurred', error, metadata);
    }
  }

  /**
   * Handle unknown/unexpected errors
   */
  private handleUnknownError(error: Error, context: Record<string, unknown>): void {
    this.logger.error('Unexpected error occurred', error, {
      errorType: error.constructor.name,
      ...context,
    });
  }

  /**
   * Setup global error handlers for uncaught exceptions and rejections
   */
  setupGlobalHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.logger.fatal('Uncaught exception', error, {
        type: 'uncaughtException',
      });

      if (this.config.exitOnUncaught) {
        this.logger.info('Process will exit due to uncaught exception');
        process.exit(1);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      
      this.logger.error('Unhandled promise rejection', error, {
        type: 'unhandledRejection',
      });
    });

    // Handle process warnings
    process.on('warning', (warning: Error) => {
      this.logger.warn('Process warning', {
        name: warning.name,
        message: warning.message,
        stack: warning.stack,
      });
    });

    this.logger.info('Global error handlers initialized');
  }

  /**
   * Wrap an async function with error handling
   */
  wrapAsync<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    context?: Record<string, unknown>
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    }) as T;
  }

  /**
   * Create an error boundary for a section of code
   */
  async boundary<T>(
    operation: () => Promise<T>,
    fallback: T,
    context?: Record<string, unknown>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error as Error, context);
      return fallback;
    }
  }
}

/**
 * Create a global error handler instance
 */
export function createErrorHandler(config?: Partial<ErrorHandlerConfig>): GlobalErrorHandler {
  return new GlobalErrorHandler(config);
}

/**
 * Default global error handler
 */
export const globalErrorHandler = createErrorHandler();
