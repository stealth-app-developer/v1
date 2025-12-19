/**
 * String utility functions for common string operations
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The input string
 * @returns The string with first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to camelCase
 * @param str - The input string (can be kebab-case, snake_case, or space-separated)
 * @returns The camelCase version of the string
 */
export function toCamelCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
}

/**
 * Converts a string to kebab-case
 * @param str - The input string
 * @returns The kebab-case version of the string
 */
export function toKebabCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake_case
 * @param str - The input string
 * @returns The snake_case version of the string
 */
export function toSnakeCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - The input string
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns The truncated string
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Removes all whitespace from a string
 * @param str - The input string
 * @returns String with all whitespace removed
 */
export function removeWhitespace(str: string): string {
  if (!str) return str;
  return str.replace(/\s+/g, '');
}

/**
 * Checks if a string is a palindrome
 * @param str - The input string
 * @returns True if the string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  if (!str) return false;
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**
 * Counts the number of words in a string
 * @param str - The input string
 * @returns The number of words
 */
export function wordCount(str: string): number {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).length;
}

/**
 * Reverses a string
 * @param str - The input string
 * @returns The reversed string
 */
export function reverse(str: string): string {
  if (!str) return str;
  return str.split('').reverse().join('');
}

/**
 * Pads a string to a specified length
 * @param str - The input string
 * @param length - Target length
 * @param char - Character to use for padding (default: ' ')
 * @param direction - 'left', 'right', or 'both' (default: 'right')
 * @returns The padded string
 */
export function pad(
  str: string,
  length: number,
  char: string = ' ',
  direction: 'left' | 'right' | 'both' = 'right'
): string {
  if (!str) str = '';
  if (str.length >= length) return str;
  
  const padLength = length - str.length;
  const padChar = char.charAt(0) || ' ';
  
  switch (direction) {
    case 'left':
      return padChar.repeat(padLength) + str;
    case 'both': {
      const leftPad = Math.floor(padLength / 2);
      const rightPad = padLength - leftPad;
      return padChar.repeat(leftPad) + str + padChar.repeat(rightPad);
    }
    case 'right':
    default:
      return str + padChar.repeat(padLength);
  }
}
