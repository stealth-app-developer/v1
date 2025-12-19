/**
 * Array utility functions for common array operations
 */

/**
 * Removes duplicate values from an array
 * @param arr - The input array
 * @returns A new array with duplicates removed
 */
export function unique<T>(arr: T[]): T[] {
  if (!arr) return [];
  return [...new Set(arr)];
}

/**
 * Flattens a nested array to a specified depth
 * @param arr - The input array
 * @param depth - The depth to flatten (default: 1)
 * @returns The flattened array
 */
export function flatten<T>(arr: (T | T[])[], depth: number = 1): T[] {
  if (!arr) return [];
  if (depth <= 0) return arr as T[];
  return arr.reduce<T[]>((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...(depth > 1 ? flatten(val as (T | T[])[], depth - 1) : val));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

/**
 * Chunks an array into smaller arrays of a specified size
 * @param arr - The input array
 * @param size - The chunk size
 * @returns An array of chunks
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (!arr || arr.length === 0 || size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Shuffles an array (Fisher-Yates algorithm)
 * @param arr - The input array
 * @returns A new shuffled array
 */
export function shuffle<T>(arr: T[]): T[] {
  if (!arr) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gets the intersection of two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns An array containing elements present in both arrays
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1 || !arr2) return [];
  const set2 = new Set(arr2);
  return unique(arr1.filter(item => set2.has(item)));
}

/**
 * Gets the difference between two arrays (elements in arr1 but not in arr2)
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns An array containing elements in arr1 but not in arr2
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1) return [];
  if (!arr2) return [...arr1];
  const set2 = new Set(arr2);
  return unique(arr1.filter(item => !set2.has(item)));
}

/**
 * Gets the union of two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns An array containing all unique elements from both arrays
 */
export function union<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1 && !arr2) return [];
  if (!arr1) return unique(arr2);
  if (!arr2) return unique(arr1);
  return unique([...arr1, ...arr2]);
}

/**
 * Groups array elements by a key function
 * @param arr - The input array
 * @param keyFn - Function to get the group key
 * @returns An object with grouped elements
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  if (!arr) return {} as Record<K, T[]>;
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

/**
 * Finds the last element matching a predicate
 * @param arr - The input array
 * @param predicate - The predicate function
 * @returns The last matching element or undefined
 */
export function findLast<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  if (!arr) return undefined;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i];
    }
  }
  return undefined;
}

/**
 * Counts occurrences of each element in an array
 * @param arr - The input array
 * @returns An object with element counts
 */
export function countBy<T extends string | number | symbol>(arr: T[]): Record<T, number> {
  if (!arr) return {} as Record<T, number>;
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

/**
 * Partitions an array into two arrays based on a predicate
 * @param arr - The input array
 * @param predicate - The predicate function
 * @returns A tuple of [matching, non-matching] arrays
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!arr) return [[], []];
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const item of arr) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

/**
 * Zips multiple arrays together
 * @param arrays - Arrays to zip
 * @returns An array of tuples
 */
export function zip<T>(...arrays: T[][]): T[][] {
  if (!arrays || arrays.length === 0) return [];
  const minLength = Math.min(...arrays.map(arr => arr?.length || 0));
  const result: T[][] = [];
  for (let i = 0; i < minLength; i++) {
    result.push(arrays.map(arr => arr[i]));
  }
  return result;
}

/**
 * Gets the first n elements of an array
 * @param arr - The input array
 * @param n - Number of elements to get
 * @returns The first n elements
 */
export function take<T>(arr: T[], n: number): T[] {
  if (!arr || n <= 0) return [];
  return arr.slice(0, n);
}

/**
 * Gets the last n elements of an array
 * @param arr - The input array
 * @param n - Number of elements to get
 * @returns The last n elements
 */
export function takeLast<T>(arr: T[], n: number): T[] {
  if (!arr || n <= 0) return [];
  return arr.slice(-n);
}
