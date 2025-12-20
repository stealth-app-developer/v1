import { createLogger, Logger, LogLevel } from '../logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request/Response logging middleware
 * Demonstrates patterns for HTTP request logging including:
 * - Request/response correlation
 * - Timing metrics
 * - Sanitized logging (excluding sensitive data)
 * - Error handling
 */

const logger = createLogger({
  context: 'HTTP',
  level: LogLevel.DEBUG,
  format: 'pretty',
});

/**
 * Simulated HTTP Request interface
 */
export interface HttpRequest {
  method: string;
  url: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body?: unknown;
  ip?: string;
  userAgent?: string;
}

/**
 * Simulated HTTP Response interface
 */
export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: unknown;
}

/**
 * Context passed through the request lifecycle
 */
export interface RequestContext {
  correlationId: string;
  logger: Logger;
  startTime: number;
  request: HttpRequest;
}

/**
 * Headers that should be masked in logs
 */
const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
  'set-cookie',
]);

/**
 * Request body fields that should be masked
 */
const SENSITIVE_BODY_FIELDS = new Set([
  'password',
  'confirmPassword',
  'currentPassword',
  'newPassword',
  'token',
  'secret',
  'apiKey',
  'creditCard',
  'cvv',
  'ssn',
]);

/**
 * Sanitize headers by masking sensitive values
 */
function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    if (SENSITIVE_HEADERS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize request body by masking sensitive fields
 */
function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map(sanitizeBody);
  }

  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (SENSITIVE_BODY_FIELDS.has(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Log incoming request
 */
export function logRequest(request: HttpRequest): RequestContext {
  const correlationId = request.headers['x-correlation-id'] || uuidv4();
  const startTime = performance.now();
  
  // Create a child logger with correlation ID
  const requestLogger = logger.child({
    context: 'HTTP',
    metadata: { correlationId },
  });
  requestLogger.setCorrelationId(correlationId);

  // Log request
  requestLogger.info('Incoming request', {
    method: request.method,
    path: request.path,
    query: request.query,
    ip: request.ip,
    userAgent: request.userAgent,
    headers: sanitizeHeaders(request.headers),
  });

  // Log request body for non-GET requests (if present)
  if (request.body && request.method !== 'GET') {
    requestLogger.debug('Request body', {
      body: sanitizeBody(request.body),
    });
  }

  return {
    correlationId,
    logger: requestLogger,
    startTime,
    request,
  };
}

/**
 * Log outgoing response
 */
export function logResponse(context: RequestContext, response: HttpResponse): void {
  const duration = performance.now() - context.startTime;
  const durationMs = Math.round(duration * 100) / 100;
  
  const logLevel = response.statusCode >= 500 ? 'error' :
                   response.statusCode >= 400 ? 'warn' : 'info';
  
  const logData = {
    method: context.request.method,
    path: context.request.path,
    statusCode: response.statusCode,
    duration_ms: durationMs,
  };

  switch (logLevel) {
    case 'error':
      context.logger.error('Request completed with error', undefined, logData);
      break;
    case 'warn':
      context.logger.warn('Request completed with client error', logData);
      break;
    default:
      context.logger.info('Request completed', logData);
  }

  // Log slow requests
  if (durationMs > 1000) {
    context.logger.warn('Slow request detected', {
      ...logData,
      threshold_ms: 1000,
    });
  }
}

/**
 * Log request error
 */
export function logRequestError(context: RequestContext, error: Error): void {
  const duration = performance.now() - context.startTime;
  
  context.logger.error('Request failed', error, {
    method: context.request.method,
    path: context.request.path,
    duration_ms: Math.round(duration * 100) / 100,
  });
}

/**
 * Express-style middleware function type
 */
type NextFunction = () => Promise<void>;
type MiddlewareHandler = (req: HttpRequest, context: RequestContext) => Promise<HttpResponse>;

/**
 * Create a logging middleware wrapper
 * This demonstrates how to wrap handlers with logging
 */
export function withRequestLogging(handler: MiddlewareHandler): (req: HttpRequest) => Promise<HttpResponse> {
  return async (req: HttpRequest): Promise<HttpResponse> => {
    const context = logRequest(req);
    
    try {
      const response = await handler(req, context);
      logResponse(context, response);
      return response;
    } catch (error) {
      logRequestError(context, error as Error);
      
      // Return error response
      return {
        statusCode: 500,
        headers: { 'content-type': 'application/json' },
        body: { error: 'Internal Server Error' },
      };
    }
  };
}

/**
 * Create request logging middleware for route groups
 */
export function createRequestLoggingMiddleware(): {
  before: (req: HttpRequest) => RequestContext;
  after: (context: RequestContext, response: HttpResponse) => void;
  error: (context: RequestContext, error: Error) => void;
} {
  return {
    before: logRequest,
    after: logResponse,
    error: logRequestError,
  };
}
