import { createLogger, LogLevel } from '../logger';

/**
 * Database service demonstrating logging for database operations
 */

// Create a logger with database context
const logger = createLogger({
  context: 'DatabaseService',
  level: LogLevel.DEBUG,
  format: 'pretty',
});

export interface DatabaseRecord {
  id: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simulated database connection state
 */
let isConnected = false;
const mockDatabase = new Map<string, DatabaseRecord>();

/**
 * Connect to the database
 */
export async function connect(connectionString: string): Promise<void> {
  const endTimer = logger.time('database_connect');
  
  logger.info('Attempting database connection', {
    connectionString: connectionString.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@'), // Mask credentials
  });

  try {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!connectionString) {
      throw new Error('Connection string is required');
    }

    isConnected = true;
    logger.info('Database connection established successfully', {
      poolSize: 10,
      maxRetries: 3,
    });
  } catch (error) {
    logger.error('Failed to connect to database', error, {
      connectionString: connectionString.replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@'),
    });
    throw error;
  } finally {
    endTimer();
  }
}

/**
 * Disconnect from the database
 */
export async function disconnect(): Promise<void> {
  logger.info('Closing database connection');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 50));
    isConnected = false;
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', error);
    throw error;
  }
}

/**
 * Insert a record into the database
 */
export async function insert(collection: string, data: Record<string, unknown>): Promise<DatabaseRecord> {
  const endTimer = logger.time(`db_insert_${collection}`);
  
  logger.debug('Inserting record', {
    collection,
    dataKeys: Object.keys(data),
  });

  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }

    const record: DatabaseRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDatabase.set(record.id, record);

    logger.info('Record inserted successfully', {
      collection,
      recordId: record.id,
    });

    return record;
  } catch (error) {
    logger.error('Failed to insert record', error, {
      collection,
      dataKeys: Object.keys(data),
    });
    throw error;
  } finally {
    endTimer();
  }
}

/**
 * Find a record by ID
 */
export async function findById(collection: string, id: string): Promise<DatabaseRecord | null> {
  logger.debug('Finding record by ID', { collection, id });

  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }

    const record = mockDatabase.get(id);

    if (record) {
      logger.debug('Record found', { collection, id });
    } else {
      logger.debug('Record not found', { collection, id });
    }

    return record || null;
  } catch (error) {
    logger.error('Failed to find record', error, { collection, id });
    throw error;
  }
}

/**
 * Update a record
 */
export async function update(
  collection: string,
  id: string,
  data: Partial<Record<string, unknown>>
): Promise<DatabaseRecord | null> {
  const endTimer = logger.time(`db_update_${collection}`);
  
  logger.debug('Updating record', {
    collection,
    id,
    updateKeys: Object.keys(data),
  });

  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }

    const existing = mockDatabase.get(id);
    if (!existing) {
      logger.warn('Attempted to update non-existent record', { collection, id });
      return null;
    }

    const updated: DatabaseRecord = {
      ...existing,
      data: { ...existing.data, ...data },
      updatedAt: new Date(),
    };

    mockDatabase.set(id, updated);

    logger.info('Record updated successfully', {
      collection,
      recordId: id,
      fieldsUpdated: Object.keys(data),
    });

    return updated;
  } catch (error) {
    logger.error('Failed to update record', error, { collection, id });
    throw error;
  } finally {
    endTimer();
  }
}

/**
 * Delete a record
 */
export async function deleteById(collection: string, id: string): Promise<boolean> {
  logger.debug('Deleting record', { collection, id });

  try {
    if (!isConnected) {
      throw new Error('Database not connected');
    }

    const existed = mockDatabase.delete(id);

    if (existed) {
      logger.info('Record deleted successfully', { collection, id });
    } else {
      logger.warn('Attempted to delete non-existent record', { collection, id });
    }

    return existed;
  } catch (error) {
    logger.error('Failed to delete record', error, { collection, id });
    throw error;
  }
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  name: string,
  operations: () => Promise<T>
): Promise<T> {
  const transactionId = `txn-${Date.now()}`;
  const txnLogger = logger.child({
    context: 'Transaction',
    metadata: { transactionId, transactionName: name },
  });

  txnLogger.info('Transaction started');
  const endTimer = txnLogger.time(`transaction_${name}`);

  try {
    const result = await operations();
    txnLogger.info('Transaction committed successfully');
    return result;
  } catch (error) {
    txnLogger.error('Transaction failed, rolling back', error);
    throw error;
  } finally {
    endTimer();
  }
}
