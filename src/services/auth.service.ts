import { createLogger, LogLevel } from '../logger';

/**
 * Authentication service demonstrating logging for auth operations
 */

// Create a logger with auth context - intentionally less verbose for security
const logger = createLogger({
  context: 'AuthService',
  level: LogLevel.INFO,
  format: 'pretty',
});

export interface User {
  id: string;
  email: string;
  role: string;
  lastLogin?: Date;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Mock user store
const users = new Map<string, { user: User; passwordHash: string }>();

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  role: string = 'user'
): Promise<AuthResult> {
  // Never log passwords or sensitive data
  logger.info('User registration attempt', { email, role });

  try {
    // Validate input
    if (!email || !password) {
      logger.warn('Registration failed - missing credentials', { email: !!email });
      return { success: false, error: 'Email and password are required' };
    }

    if (users.has(email)) {
      logger.warn('Registration failed - email already exists', { email });
      return { success: false, error: 'Email already registered' };
    }

    // Create user (simulate password hashing)
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      role,
    };

    users.set(email, {
      user,
      passwordHash: `hashed-${password}`, // In reality, use bcrypt
    });

    logger.info('User registered successfully', {
      userId: user.id,
      email,
      role,
    });

    return { success: true, user };
  } catch (error) {
    logger.error('Registration error', error, { email });
    return { success: false, error: 'Registration failed' };
  }
}

/**
 * Authenticate a user
 */
export async function login(email: string, password: string): Promise<AuthResult> {
  const requestId = `auth-${Date.now()}`;
  logger.info('Login attempt', { email, requestId });

  try {
    const userData = users.get(email);

    if (!userData) {
      // Don't reveal if user exists or not in logs exposed to attackers
      logger.warn('Login failed - invalid credentials', { requestId });
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password (simplified - use bcrypt.compare in production)
    if (userData.passwordHash !== `hashed-${password}`) {
      logger.warn('Login failed - invalid credentials', {
        requestId,
        userId: userData.user.id,
      });
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    userData.user.lastLogin = new Date();

    // Generate token (simplified)
    const token = Buffer.from(JSON.stringify({
      userId: userData.user.id,
      exp: Date.now() + 3600000,
    })).toString('base64');

    logger.info('Login successful', {
      requestId,
      userId: userData.user.id,
      email,
    });

    return {
      success: true,
      user: userData.user,
      token,
    };
  } catch (error) {
    logger.error('Login error', error, { requestId });
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Validate a token
 */
export async function validateToken(token: string): Promise<AuthResult> {
  // Never log the actual token
  logger.debug('Token validation attempt', {
    tokenLength: token?.length,
    tokenPrefix: token?.substring(0, 8),
  });

  try {
    if (!token) {
      logger.warn('Token validation failed - no token provided');
      return { success: false, error: 'No token provided' };
    }

    // Decode token (simplified)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

    if (decoded.exp < Date.now()) {
      logger.warn('Token validation failed - token expired', {
        userId: decoded.userId,
      });
      return { success: false, error: 'Token expired' };
    }

    // Find user
    for (const [, userData] of users) {
      if (userData.user.id === decoded.userId) {
        logger.debug('Token validated successfully', {
          userId: decoded.userId,
        });
        return { success: true, user: userData.user };
      }
    }

    logger.warn('Token validation failed - user not found', {
      userId: decoded.userId,
    });
    return { success: false, error: 'User not found' };
  } catch (error) {
    logger.error('Token validation error', error);
    return { success: false, error: 'Invalid token' };
  }
}

/**
 * Logout user
 */
export async function logout(userId: string): Promise<void> {
  logger.info('User logout', { userId });
  // In a real app, you'd invalidate the token here
}

/**
 * Check authorization for a resource
 */
export async function authorize(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  logger.debug('Authorization check', { userId, resource, action });

  try {
    // Find user
    let userRole: string | null = null;
    for (const [, userData] of users) {
      if (userData.user.id === userId) {
        userRole = userData.user.role;
        break;
      }
    }

    if (!userRole) {
      logger.warn('Authorization denied - user not found', { userId, resource, action });
      return false;
    }

    // Simple role-based check (in production, use a proper RBAC system)
    const isAuthorized = userRole === 'admin' || 
      (userRole === 'user' && action === 'read');

    if (isAuthorized) {
      logger.info('Authorization granted', { userId, resource, action, role: userRole });
    } else {
      logger.warn('Authorization denied', { userId, resource, action, role: userRole });
    }

    return isAuthorized;
  } catch (error) {
    logger.error('Authorization error', error, { userId, resource, action });
    return false;
  }
}
