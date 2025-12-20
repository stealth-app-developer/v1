import { LogEntry, LogFormatter, LogLevelString } from '../types/logger.types';

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Log level colors
  debug: '\x1b[36m',   // Cyan
  info: '\x1b[32m',    // Green
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  fatal: '\x1b[35m',   // Magenta
  
  // Metadata colors
  timestamp: '\x1b[90m',  // Gray
  context: '\x1b[34m',    // Blue
  message: '\x1b[37m',    // White
} as const;

/**
 * JSON formatter for structured logging
 * Ideal for production environments where logs are ingested by log aggregation systems
 */
export class JsonFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    return JSON.stringify(entry);
  }
}

/**
 * Pretty formatter for human-readable console output
 * Ideal for development environments
 */
export class PrettyFormatter implements LogFormatter {
  private colorize: boolean;

  constructor(colorize: boolean = true) {
    this.colorize = colorize;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];
    
    // Timestamp
    if (entry.timestamp) {
      parts.push(this.color(entry.timestamp, 'timestamp'));
    }
    
    // Log level
    const levelStr = entry.level.toUpperCase().padEnd(5);
    parts.push(this.color(levelStr, entry.level));
    
    // Context
    if (entry.context) {
      parts.push(this.color(`[${entry.context}]`, 'context'));
    }
    
    // Correlation ID
    if (entry.correlationId) {
      parts.push(this.color(`(${entry.correlationId.substring(0, 8)})`, 'timestamp'));
    }
    
    // Message
    parts.push(this.color(entry.message, 'message'));
    
    // Metadata
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(this.color(JSON.stringify(entry.metadata), 'dim'));
    }
    
    // Error info
    if (entry.error) {
      parts.push('\n' + this.formatError(entry.error));
    }
    
    return parts.join(' ');
  }

  private formatError(error: { name: string; message: string; stack?: string; cause?: unknown }): string {
    const lines: string[] = [];
    lines.push(this.color(`  ${error.name}: ${error.message}`, 'error'));
    
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(1);
      for (const line of stackLines) {
        lines.push(this.color(`  ${line.trim()}`, 'dim'));
      }
    }
    
    if (error.cause) {
      lines.push(this.color('  Caused by:', 'warn'));
      lines.push(this.formatError(error.cause as { name: string; message: string; stack?: string; cause?: unknown }));
    }
    
    return lines.join('\n');
  }

  private color(text: string, type: keyof typeof COLORS | LogLevelString): string {
    if (!this.colorize) return text;
    const colorCode = COLORS[type as keyof typeof COLORS] || COLORS.message;
    return `${colorCode}${text}${COLORS.reset}`;
  }
}

/**
 * Factory function to create a formatter based on configuration
 */
export function createFormatter(format: 'json' | 'pretty', colorize: boolean): LogFormatter {
  switch (format) {
    case 'json':
      return new JsonFormatter();
    case 'pretty':
      return new PrettyFormatter(colorize);
    default:
      return new JsonFormatter();
  }
}
