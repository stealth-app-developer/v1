/**
 * Validation utility functions for common validation operations
 */

/**
 * Validates if a string is a valid email address
 * @param email - The email to validate
 * @returns True if valid email format
 */
export function isEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL to validate
 * @returns True if valid URL format
 */
export function isUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a value is a valid number (not NaN)
 * @param value - The value to check
 * @returns True if valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validates if a value is an integer
 * @param value - The value to check
 * @returns True if integer
 */
export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Validates if a value is a positive number
 * @param value - The value to check
 * @returns True if positive number
 */
export function isPositive(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Validates if a value is a negative number
 * @param value - The value to check
 * @returns True if negative number
 */
export function isNegative(value: unknown): value is number {
  return isNumber(value) && value < 0;
}

/**
 * Validates if a string is empty or only whitespace
 * @param str - The string to check
 * @returns True if empty or whitespace only
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Validates if a value is null or undefined
 * @param value - The value to check
 * @returns True if null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Validates if a string is a valid phone number (basic validation)
 * @param phone - The phone number to validate
 * @returns True if valid phone format
 */
export function isPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  // Matches common phone formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validates if a string is a valid UUID v4
 * @param uuid - The UUID to validate
 * @returns True if valid UUID v4 format
 */
export function isUuid(uuid: string): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates if a string is a valid hex color
 * @param color - The color to validate
 * @returns True if valid hex color format
 */
export function isHexColor(color: string): boolean {
  if (!color) return false;
  const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexRegex.test(color);
}

/**
 * Validates if a string is a valid IP address (IPv4)
 * @param ip - The IP address to validate
 * @returns True if valid IPv4 format
 */
export function isIpv4(ip: string): boolean {
  if (!ip) return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
  });
}

/**
 * Validates if a value is a plain object
 * @param value - The value to check
 * @returns True if plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Validates if a value is an array
 * @param value - The value to check
 * @returns True if array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Validates if a string contains only alphanumeric characters
 * @param str - The string to check
 * @returns True if alphanumeric only
 */
export function isAlphanumeric(str: string): boolean {
  if (!str) return false;
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
}

/**
 * Validates if a string is a valid date
 * @param dateStr - The date string to validate
 * @returns True if valid date
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validates if a string meets minimum length requirement
 * @param str - The string to check
 * @param minLength - Minimum required length
 * @returns True if meets minimum length
 */
export function hasMinLength(str: string, minLength: number): boolean {
  if (!str) return minLength <= 0;
  return str.length >= minLength;
}

/**
 * Validates if a string meets maximum length requirement
 * @param str - The string to check
 * @param maxLength - Maximum allowed length
 * @returns True if within maximum length
 */
export function hasMaxLength(str: string, maxLength: number): boolean {
  if (!str) return true;
  return str.length <= maxLength;
}

/**
 * Validates if a string is within length range
 * @param str - The string to check
 * @param minLength - Minimum required length
 * @param maxLength - Maximum allowed length
 * @returns True if within range
 */
export function isLengthInRange(str: string, minLength: number, maxLength: number): boolean {
  return hasMinLength(str, minLength) && hasMaxLength(str, maxLength);
}
