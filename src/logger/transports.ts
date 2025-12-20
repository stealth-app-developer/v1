import { LogEntry, LogTransport, LogLevel } from '../types/logger.types';

/**
 * Console transport - outputs logs to stdout/stderr
 */
export class ConsoleTransport implements LogTransport {
  private readonly errorLevels = new Set(['error', 'fatal']);

  log(formattedMessage: string, entry: LogEntry): void {
    if (this.errorLevels.has(entry.level)) {
      console.error(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
}

/**
 * File transport placeholder - can be extended for file-based logging
 * In production, you'd typically use a proper logging library like winston
 */
export class FileTransport implements LogTransport {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  log(formattedMessage: string, _entry: LogEntry): void {
    // In a real implementation, this would write to a file
    // Using async file operations with buffering
    // For now, we just demonstrate the interface
    console.log(`[FileTransport:${this.filePath}] ${formattedMessage}`);
  }
}

/**
 * Memory transport - stores logs in memory (useful for testing)
 */
export class MemoryTransport implements LogTransport {
  private logs: Array<{ message: string; entry: LogEntry }> = [];
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  log(formattedMessage: string, entry: LogEntry): void {
    this.logs.push({ message: formattedMessage, entry });
    
    // Prevent memory bloat
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
  }

  /**
   * Get all stored logs
   */
  getLogs(): Array<{ message: string; entry: LogEntry }> {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: string): Array<{ message: string; entry: LogEntry }> {
    return this.logs.filter(log => log.entry.level === level);
  }

  /**
   * Clear all stored logs
   */
  clear(): void {
    this.logs = [];
  }
}

/**
 * Factory function to create a console transport
 */
export function createConsoleTransport(): LogTransport {
  return new ConsoleTransport();
}
