import {
  clamp,
  inRange,
  sum,
  average,
  min,
  max,
  randomInt,
  round,
  factorial,
  gcd,
  lcm,
  isPrime,
  percentage
} from '../src/math.utils';

describe('Math Utilities', () => {
  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle equal min and max', () => {
      expect(clamp(5, 5, 5)).toBe(5);
    });

    it('should throw error when min > max', () => {
      expect(() => clamp(5, 10, 0)).toThrow('min must be less than or equal to max');
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
    });
  });

  describe('inRange', () => {
    it('should return true when value is within range', () => {
      expect(inRange(5, 0, 10)).toBe(true);
    });

    it('should return true when value equals min', () => {
      expect(inRange(0, 0, 10)).toBe(true);
    });

    it('should return true when value equals max', () => {
      expect(inRange(10, 0, 10)).toBe(true);
    });

    it('should return false when value is below range', () => {
      expect(inRange(-1, 0, 10)).toBe(false);
    });

    it('should return false when value is above range', () => {
      expect(inRange(11, 0, 10)).toBe(false);
    });
  });

  describe('sum', () => {
    it('should return sum of array elements', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should handle single element', () => {
      expect(sum([5])).toBe(5);
    });

    it('should return 0 for empty array', () => {
      expect(sum([])).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(sum([1, -2, 3, -4, 5])).toBe(3);
    });

    it('should handle null/undefined input', () => {
      expect(sum(null as unknown as number[])).toBe(0);
    });

    it('should handle decimal numbers', () => {
      expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
    });
  });

  describe('average', () => {
    it('should return average of array elements', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should handle single element', () => {
      expect(average([5])).toBe(5);
    });

    it('should return 0 for empty array', () => {
      expect(average([])).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(average([1, 2, 3, 4])).toBe(2.5);
    });
  });

  describe('min', () => {
    it('should return minimum value', () => {
      expect(min([3, 1, 4, 1, 5, 9])).toBe(1);
    });

    it('should handle single element', () => {
      expect(min([5])).toBe(5);
    });

    it('should return undefined for empty array', () => {
      expect(min([])).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      expect(min([3, -1, 4, -5, 9])).toBe(-5);
    });

    it('should handle null/undefined input', () => {
      expect(min(null as unknown as number[])).toBeUndefined();
    });
  });

  describe('max', () => {
    it('should return maximum value', () => {
      expect(max([3, 1, 4, 1, 5, 9])).toBe(9);
    });

    it('should handle single element', () => {
      expect(max([5])).toBe(5);
    });

    it('should return undefined for empty array', () => {
      expect(max([])).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      expect(max([-3, -1, -4, -5, -9])).toBe(-1);
    });
  });

  describe('randomInt', () => {
    it('should return value within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should return integer', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should return same value when min equals max', () => {
      expect(randomInt(5, 5)).toBe(5);
    });
  });

  describe('round', () => {
    it('should round to integer by default', () => {
      expect(round(3.7)).toBe(4);
      expect(round(3.2)).toBe(3);
    });

    it('should round to specified decimal places', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 4)).toBe(3.1416);
    });

    it('should handle negative numbers', () => {
      expect(round(-3.7)).toBe(-4);
      expect(round(-3.2)).toBe(-3);
    });

    it('should handle negative decimals parameter', () => {
      expect(round(3.14159, -1)).toBe(3);
    });

    it('should round 0.5 up', () => {
      expect(round(2.5)).toBe(3);
    });
  });

  describe('factorial', () => {
    it('should return correct factorial', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });

    it('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });

    it('should throw error for non-integers', () => {
      expect(() => factorial(3.5)).toThrow('Factorial is only defined for integers');
    });
  });

  describe('gcd', () => {
    it('should return greatest common divisor', () => {
      expect(gcd(12, 8)).toBe(4);
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(17, 13)).toBe(1);
    });

    it('should handle when one number is 0', () => {
      expect(gcd(5, 0)).toBe(5);
      expect(gcd(0, 5)).toBe(5);
    });

    it('should handle both numbers being 0', () => {
      expect(gcd(0, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(gcd(-12, 8)).toBe(4);
      expect(gcd(12, -8)).toBe(4);
    });
  });

  describe('lcm', () => {
    it('should return least common multiple', () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(3, 5)).toBe(15);
      expect(lcm(12, 8)).toBe(24);
    });

    it('should return 0 when either number is 0', () => {
      expect(lcm(5, 0)).toBe(0);
      expect(lcm(0, 5)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(lcm(-4, 6)).toBe(12);
    });
  });

  describe('isPrime', () => {
    it('should return true for prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(7)).toBe(true);
      expect(isPrime(11)).toBe(true);
      expect(isPrime(97)).toBe(true);
    });

    it('should return false for non-prime numbers', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(6)).toBe(false);
      expect(isPrime(9)).toBe(false);
      expect(isPrime(100)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isPrime(-5)).toBe(false);
    });

    it('should return false for non-integers', () => {
      expect(isPrime(3.5)).toBe(false);
    });
  });

  describe('percentage', () => {
    it('should calculate percentage correctly', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(50, 200)).toBe(25);
    });

    it('should return 0 when total is 0', () => {
      expect(percentage(5, 0)).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(percentage(1, 3)).toBeCloseTo(33.333, 2);
    });

    it('should handle percentages over 100', () => {
      expect(percentage(150, 100)).toBe(150);
    });

    it('should handle negative values', () => {
      expect(percentage(-25, 100)).toBe(-25);
    });
  });
});
