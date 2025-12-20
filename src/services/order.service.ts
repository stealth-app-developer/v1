import { createLogger, LogLevel, Logger } from '../logger';

/**
 * Order service demonstrating logging for business operations
 * Shows patterns for:
 * - Operation timing
 * - State transitions
 * - Business metrics
 * - Correlation IDs
 */

const logger = createLogger({
  context: 'OrderService',
  level: LogLevel.DEBUG,
  format: 'pretty',
});

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: Array<{ status: OrderStatus; timestamp: Date }>;
}

// Mock order store
const orders = new Map<string, Order>();

/**
 * Create a new order
 */
export async function createOrder(
  customerId: string,
  items: OrderItem[],
  correlationId?: string
): Promise<Order> {
  // Create a child logger with correlation ID for request tracing
  const orderLogger = logger.child({
    metadata: { customerId },
  });
  
  if (correlationId) {
    orderLogger.setCorrelationId(correlationId);
  } else {
    orderLogger.generateCorrelationId();
  }

  const endTimer = orderLogger.time('create_order');

  orderLogger.info('Creating new order', {
    itemCount: items.length,
    productIds: items.map(i => i.productId),
  });

  try {
    // Validate order
    if (!items.length) {
      orderLogger.warn('Order creation failed - empty cart');
      throw new Error('Order must contain at least one item');
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    orderLogger.debug('Order total calculated', { totalAmount });

    // Create order
    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      items,
      status: 'pending',
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    };

    orders.set(order.id, order);

    orderLogger.info('Order created successfully', {
      orderId: order.id,
      totalAmount,
      itemCount: items.length,
    });

    // Log business metric
    orderLogger.info('ORDER_METRIC', {
      metric: 'order_created',
      orderId: order.id,
      customerId,
      totalAmount,
      itemCount: items.length,
    });

    return order;
  } catch (error) {
    orderLogger.error('Failed to create order', error, {
      itemCount: items.length,
    });
    throw error;
  } finally {
    endTimer();
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  logger.debug('Fetching order', { orderId });
  
  const order = orders.get(orderId);
  
  if (!order) {
    logger.debug('Order not found', { orderId });
    return null;
  }

  return order;
}

/**
 * Update order status with state machine logging
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  correlationId?: string
): Promise<Order | null> {
  const statusLogger = logger.child({
    metadata: { orderId },
  });
  
  if (correlationId) {
    statusLogger.setCorrelationId(correlationId);
  }

  statusLogger.info('Order status update requested', {
    newStatus,
  });

  try {
    const order = orders.get(orderId);

    if (!order) {
      statusLogger.warn('Status update failed - order not found');
      return null;
    }

    const oldStatus = order.status;

    // Validate state transition
    if (!isValidStatusTransition(oldStatus, newStatus)) {
      statusLogger.warn('Invalid status transition', {
        currentStatus: oldStatus,
        requestedStatus: newStatus,
      });
      throw new Error(`Cannot transition from ${oldStatus} to ${newStatus}`);
    }

    // Update status
    order.status = newStatus;
    order.updatedAt = new Date();
    order.statusHistory.push({ status: newStatus, timestamp: new Date() });

    statusLogger.info('Order status updated', {
      previousStatus: oldStatus,
      newStatus,
      transitionTime: order.updatedAt.toISOString(),
    });

    // Log business metric for status changes
    statusLogger.info('ORDER_METRIC', {
      metric: 'status_changed',
      orderId,
      fromStatus: oldStatus,
      toStatus: newStatus,
      customerId: order.customerId,
    });

    return order;
  } catch (error) {
    statusLogger.error('Failed to update order status', error);
    throw error;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  orderId: string,
  reason: string,
  correlationId?: string
): Promise<Order | null> {
  const cancelLogger = logger.child({
    metadata: { orderId, reason },
  });

  if (correlationId) {
    cancelLogger.setCorrelationId(correlationId);
  }

  cancelLogger.info('Order cancellation requested');

  try {
    const order = orders.get(orderId);

    if (!order) {
      cancelLogger.warn('Cancellation failed - order not found');
      return null;
    }

    if (order.status === 'cancelled') {
      cancelLogger.warn('Order already cancelled');
      return order;
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      cancelLogger.warn('Cannot cancel - order already in fulfillment', {
        currentStatus: order.status,
      });
      throw new Error('Cannot cancel order that has been shipped or delivered');
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date() });

    cancelLogger.info('Order cancelled successfully', {
      previousStatus: order.statusHistory[order.statusHistory.length - 2]?.status,
      refundAmount: order.totalAmount,
    });

    // Log business metric
    cancelLogger.info('ORDER_METRIC', {
      metric: 'order_cancelled',
      orderId,
      customerId: order.customerId,
      reason,
      totalAmount: order.totalAmount,
    });

    return order;
  } catch (error) {
    cancelLogger.error('Failed to cancel order', error);
    throw error;
  }
}

/**
 * Get orders by customer
 */
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  logger.debug('Fetching customer orders', { customerId });

  const customerOrders = Array.from(orders.values()).filter(
    order => order.customerId === customerId
  );

  logger.debug('Customer orders retrieved', {
    customerId,
    orderCount: customerOrders.length,
  });

  return customerOrders;
}

/**
 * Validate order status transitions
 */
function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  return validTransitions[from]?.includes(to) ?? false;
}
