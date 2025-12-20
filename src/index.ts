/**
 * Logging Implementation - Example Usage and Patterns
 * 
 * This file demonstrates best practices for logging key operations:
 * - Basic logging with different levels
 * - Structured logging with metadata
 * - Request tracing with correlation IDs
 * - Error handling and logging
 * - Performance monitoring
 * - Service-specific logging patterns
 */

import {
  createLogger,
  LogLevel,
  Logger,
  globalErrorHandler,
  AppError,
  ValidationError,
  NotFoundError,
  ExternalServiceError,
} from './logger';

import { withRequestLogging, HttpRequest, HttpResponse, RequestContext } from './middleware';
import * as DatabaseService from './services/database.service';
import * as AuthService from './services/auth.service';
import * as OrderService from './services/order.service';

// =============================================================================
// PATTERN 1: Basic Logger Configuration
// =============================================================================

/**
 * Create loggers for different parts of your application
 */
const appLogger = createLogger({
  context: 'Application',
  level: LogLevel.DEBUG,
  format: 'pretty',
  colorize: true,
  defaultMetadata: {
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  },
});

// For production, use JSON format for log aggregation systems
const productionLogger = createLogger({
  context: 'Application',
  level: LogLevel.INFO,
  format: 'json',
  colorize: false,
});

// =============================================================================
// PATTERN 2: Log Levels and When to Use Them
// =============================================================================

function demonstrateLogLevels(): void {
  const logger = createLogger({ context: 'LogLevels', level: LogLevel.DEBUG });

  // DEBUG: Detailed information for debugging
  // Use for: variable values, flow tracing, internal state
  logger.debug('Processing request payload', {
    payloadSize: 1024,
    contentType: 'application/json',
  });

  // INFO: General operational information
  // Use for: successful operations, state changes, milestones
  logger.info('User signed up successfully', {
    userId: 'user-123',
    plan: 'premium',
  });

  // WARN: Something unexpected but non-critical
  // Use for: deprecated API usage, retry attempts, missing optional config
  logger.warn('Rate limit threshold approaching', {
    currentRate: 95,
    limit: 100,
    windowSeconds: 60,
  });

  // ERROR: Something went wrong but the app continues
  // Use for: caught exceptions, failed operations, API errors
  logger.error('Failed to send email notification', new Error('SMTP connection refused'), {
    recipient: 'user@example.com',
    emailType: 'welcome',
  });

  // FATAL: Critical error, app may need to stop
  // Use for: database connection loss, out of memory, corrupted state
  logger.fatal('Database connection pool exhausted', new Error('Connection timeout'), {
    activeConnections: 100,
    maxConnections: 100,
  });
}

// =============================================================================
// PATTERN 3: Structured Logging with Metadata
// =============================================================================

function demonstrateStructuredLogging(): void {
  const logger = createLogger({ context: 'StructuredLogging', level: LogLevel.DEBUG });

  // Include relevant context in every log
  logger.info('Payment processed', {
    orderId: 'order-456',
    amount: 99.99,
    currency: 'USD',
    paymentMethod: 'credit_card',
    cardLastFour: '4242',
    // Never log full card numbers, CVV, or passwords!
  });

  // Use consistent field names across your application
  logger.info('API request completed', {
    endpoint: '/api/users',
    method: 'GET',
    statusCode: 200,
    duration_ms: 45,
    userId: 'user-123',
  });
}

// =============================================================================
// PATTERN 4: Request Tracing with Correlation IDs
// =============================================================================

async function demonstrateCorrelationIds(): Promise<void> {
  const logger = createLogger({ context: 'CorrelationDemo', level: LogLevel.DEBUG });
  
  // Generate a correlation ID at the start of a request
  const correlationId = logger.generateCorrelationId();
  
  logger.info('Starting complex operation', { step: 1 });
  
  // Pass to child services
  const childLogger = logger.child({
    context: 'ChildService',
    metadata: { operation: 'complex' },
  });
  
  childLogger.info('Processing in child service', { step: 2 });
  
  // All logs now share the same correlation ID for easy tracing
  logger.info('Operation completed', { step: 3 });
}

// =============================================================================
// PATTERN 5: Performance Monitoring
// =============================================================================

async function demonstratePerformanceLogging(): Promise<void> {
  const logger = createLogger({ context: 'Performance', level: LogLevel.DEBUG });
  
  // Use the built-in timer
  const endTimer = logger.time('database_query');
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Timer logs duration automatically
  endTimer();
  
  // Manual timing for more control
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 100));
  const duration = performance.now() - start;
  
  logger.info('Custom operation completed', {
    operation: 'data_processing',
    duration_ms: Math.round(duration * 100) / 100,
    recordsProcessed: 1000,
  });
}

// =============================================================================
// PATTERN 6: Error Handling with Custom Errors
// =============================================================================

async function demonstrateErrorHandling(): Promise<void> {
  // Setup global handlers (do this once at app startup)
  globalErrorHandler.setupGlobalHandlers();
  
  // Use specialized error classes
  function validateInput(data: { email?: string }): void {
    if (!data.email) {
      throw new ValidationError('Email is required', {
        field: 'email',
        received: undefined,
      });
    }
  }
  
  async function getUser(id: string): Promise<{ id: string; name: string }> {
    const user = null; // Simulate not found
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return user;
  }
  
  async function callExternalApi(): Promise<void> {
    try {
      throw new Error('Connection refused');
    } catch (error) {
      throw new ExternalServiceError('PaymentGateway', error as Error, {
        endpoint: '/charge',
        timeout: 5000,
      });
    }
  }
  
  // Use error boundary for graceful degradation
  const result = await globalErrorHandler.boundary(
    async () => {
      await callExternalApi();
      return 'success';
    },
    'fallback_value',
    { operation: 'external_call' }
  );
  
  console.log('Result with fallback:', result);
}

// =============================================================================
// PATTERN 7: HTTP Request/Response Logging
// =============================================================================

async function demonstrateRequestLogging(): Promise<void> {
  // Create a handler that uses the request logger middleware
  const handler = withRequestLogging(async (req: HttpRequest, context: RequestContext): Promise<HttpResponse> => {
    // Use the context logger for request-scoped logging
    context.logger.info('Processing business logic');
    
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: { message: 'Success', correlationId: context.correlationId },
    };
  });
  
  // Simulate an incoming request
  const request: HttpRequest = {
    method: 'POST',
    url: 'http://api.example.com/users',
    path: '/users',
    query: { include: 'profile' },
    headers: {
      'content-type': 'application/json',
      'authorization': 'Bearer secret-token', // Will be redacted in logs
    },
    body: {
      email: 'user@example.com',
      password: 'secret123', // Will be redacted in logs
    },
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
  };
  
  const response = await handler(request);
  console.log('Response:', response);
}

// =============================================================================
// PATTERN 8: Service Layer Logging
// =============================================================================

async function demonstrateServiceLogging(): Promise<void> {
  // Database operations with logging
  await DatabaseService.connect('mongodb://localhost:27017/mydb');
  
  const record = await DatabaseService.insert('users', {
    name: 'John Doe',
    email: 'john@example.com',
  });
  
  await DatabaseService.update('users', record.id, { name: 'Jane Doe' });
  await DatabaseService.disconnect();
  
  // Auth operations with logging
  await AuthService.register('user@example.com', 'password123', 'user');
  const loginResult = await AuthService.login('user@example.com', 'password123');
  
  if (loginResult.token) {
    await AuthService.validateToken(loginResult.token);
  }
  
  // Order operations with logging and metrics
  const order = await OrderService.createOrder('customer-1', [
    { productId: 'prod-1', quantity: 2, unitPrice: 29.99 },
    { productId: 'prod-2', quantity: 1, unitPrice: 49.99 },
  ]);
  
  await OrderService.updateOrderStatus(order.id, 'confirmed');
  await OrderService.updateOrderStatus(order.id, 'processing');
}

// =============================================================================
// MAIN: Run All Demonstrations
// =============================================================================

async function main(): Promise<void> {
  appLogger.info('Starting logging demonstration');
  
  console.log('\n=== Log Levels ===');
  demonstrateLogLevels();
  
  console.log('\n=== Structured Logging ===');
  demonstrateStructuredLogging();
  
  console.log('\n=== Correlation IDs ===');
  await demonstrateCorrelationIds();
  
  console.log('\n=== Performance Monitoring ===');
  await demonstratePerformanceLogging();
  
  console.log('\n=== Error Handling ===');
  await demonstrateErrorHandling();
  
  console.log('\n=== Request Logging ===');
  await demonstrateRequestLogging();
  
  console.log('\n=== Service Layer Logging ===');
  await demonstrateServiceLogging();
  
  appLogger.info('Logging demonstration completed');
}

// Export for external use
export {
  demonstrateLogLevels,
  demonstrateStructuredLogging,
  demonstrateCorrelationIds,
  demonstratePerformanceLogging,
  demonstrateErrorHandling,
  demonstrateRequestLogging,
  demonstrateServiceLogging,
};

// Run if executed directly
main().catch(error => {
  appLogger.fatal('Demonstration failed', error);
  process.exit(1);
});
