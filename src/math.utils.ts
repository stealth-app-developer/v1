/**
 * Math utility functions for common mathematical operations
 */

/**
 * Clamps a number between a minimum and maximum value
 * @param value - The number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks if a number is within a range (inclusive)
 * @param value - The number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Calculates the sum of an array of numbers
 * @param numbers - Array of numbers
 * @returns The sum
 */
export function sum(numbers: number[]): number {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Calculates the average of an array of numbers
 * @param numbers - Array of numbers
 * @returns The average
 */
export function average(numbers: number[]): number {
  if (!numbers || numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * Finds the minimum value in an array of numbers
 * @param numbers - Array of numbers
 * @returns The minimum value or undefined if array is empty
 */
export function min(numbers: number[]): number | undefined {
  if (!numbers || numbers.length === 0) return undefined;
  return Math.min(...numbers);
}

/**
 * Finds the maximum value in an array of numbers
 * @param numbers - Array of numbers
 * @returns The maximum value or undefined if array is empty
 */
export function max(numbers: number[]): number | undefined {
  if (!numbers || numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns A random integer
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Rounds a number to a specified number of decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded number
 */
export function round(value: number, decimals: number = 0): number {
  if (decimals < 0) decimals = 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculates the factorial of a number
 * @param n - The number
 * @returns The factorial
 */
export function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial is not defined for negative numbers');
  if (!Number.isInteger(n)) throw new Error('Factorial is only defined for integers');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculates the greatest common divisor of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The GCD
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculates the least common multiple of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The LCM
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
}

/**
 * Checks if a number is prime
 * @param n - The number to check
 * @returns True if the number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Calculates the percentage of a value
 * @param value - The value
 * @param total - The total
 * @returns The percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}
