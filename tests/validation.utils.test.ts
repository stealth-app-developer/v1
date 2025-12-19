import {
  isEmail,
  isUrl,
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  isEmpty,
  isNullOrUndefined,
  isPhoneNumber,
  isUuid,
  isHexColor,
  isIpv4,
  isPlainObject,
  isArray,
  isAlphanumeric,
  isValidDate,
  hasMinLength,
  hasMaxLength,
  isLengthInRange
} from '../src/validation.utils';

describe('Validation Utilities', () => {
  describe('isEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co')).toBe(true);
      expect(isEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test@example')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isEmail('')).toBe(false);
      expect(isEmail(null as unknown as string)).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://localhost:3000')).toBe(true);
      expect(isUrl('https://www.example.com/path?query=1')).toBe(true);
      expect(isUrl('ftp://files.example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('example.com')).toBe(false);
      expect(isUrl('http://')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isUrl('')).toBe(false);
      expect(isUrl(null as unknown as string)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
      expect(isNumber(-10)).toBe(true);
      expect(isNumber(0)).toBe(true);
    });

    it('should return false for NaN and Infinity', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('should return true for integers', () => {
      expect(isInteger(42)).toBe(true);
      expect(isInteger(-10)).toBe(true);
      expect(isInteger(0)).toBe(true);
    });

    it('should return false for floats', () => {
      expect(isInteger(3.14)).toBe(false);
      expect(isInteger(0.1)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isInteger('42')).toBe(false);
      expect(isInteger(null)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(0.001)).toBe(true);
      expect(isPositive(100)).toBe(true);
    });

    it('should return false for zero and negative numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-1)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isPositive('1')).toBe(false);
      expect(isPositive(null)).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative numbers', () => {
      expect(isNegative(-1)).toBe(true);
      expect(isNegative(-0.001)).toBe(true);
      expect(isNegative(-100)).toBe(true);
    });

    it('should return false for zero and positive numbers', () => {
      expect(isNegative(0)).toBe(false);
      expect(isNegative(1)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNegative('-1')).toBe(false);
      expect(isNegative(null)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for whitespace only strings', () => {
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });

    it('should return true for null/undefined', () => {
      expect(isEmpty(null as unknown as string)).toBe(true);
      expect(isEmpty(undefined as unknown as string)).toBe(true);
    });
  });

  describe('isNullOrUndefined', () => {
    it('should return true for null', () => {
      expect(isNullOrUndefined(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined('')).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined({})).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    it('should return true for valid phone formats', () => {
      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('123-456-7890')).toBe(true);
      expect(isPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isPhoneNumber('+1 (123) 456-7890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isPhoneNumber('123')).toBe(false);
      expect(isPhoneNumber('abc-def-ghij')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isPhoneNumber('')).toBe(false);
      expect(isPhoneNumber(null as unknown as string)).toBe(false);
    });
  });

  describe('isUuid', () => {
    it('should return true for valid UUID v4', () => {
      expect(isUuid('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
      expect(isUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for invalid UUIDs', () => {
      expect(isUuid('not-a-uuid')).toBe(false);
      expect(isUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(false); // v1 not v4
      expect(isUuid('123e4567-e89b-42d3-c456-426614174000')).toBe(false); // wrong variant
    });

    it('should return false for empty or null', () => {
      expect(isUuid('')).toBe(false);
      expect(isUuid(null as unknown as string)).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('should return true for valid hex colors', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#FFF')).toBe(true);
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#FFFFFF')).toBe(true);
      expect(isHexColor('#123abc')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isHexColor('fff')).toBe(false);
      expect(isHexColor('#gggggg')).toBe(false);
      expect(isHexColor('#12345')).toBe(false);
      expect(isHexColor('#1234567')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isHexColor('')).toBe(false);
      expect(isHexColor(null as unknown as string)).toBe(false);
    });
  });

  describe('isIpv4', () => {
    it('should return true for valid IPv4 addresses', () => {
      expect(isIpv4('192.168.1.1')).toBe(true);
      expect(isIpv4('0.0.0.0')).toBe(true);
      expect(isIpv4('255.255.255.255')).toBe(true);
      expect(isIpv4('10.0.0.1')).toBe(true);
    });

    it('should return false for invalid IPv4 addresses', () => {
      expect(isIpv4('256.1.1.1')).toBe(false);
      expect(isIpv4('1.1.1')).toBe(false);
      expect(isIpv4('1.1.1.1.1')).toBe(false);
      expect(isIpv4('a.b.c.d')).toBe(false);
      expect(isIpv4('192.168.1.01')).toBe(false); // leading zeros
    });

    it('should return false for empty or null', () => {
      expect(isIpv4('')).toBe(false);
      expect(isIpv4(null as unknown as string)).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('should return false for non-plain objects', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new Map())).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(() => {})).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array())).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should return false for strings with special characters', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc_123')).toBe(false);
      expect(isAlphanumeric('abc@123')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isAlphanumeric('')).toBe(false);
      expect(isAlphanumeric(null as unknown as string)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDate('2023-12-25')).toBe(true);
      expect(isValidDate('December 25, 2023')).toBe(true);
      expect(isValidDate('2023-12-25T10:30:00')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDate('not-a-date')).toBe(false);
      expect(isValidDate('2023-13-45')).toBe(false);
    });

    it('should return false for empty or null', () => {
      expect(isValidDate('')).toBe(false);
      expect(isValidDate(null as unknown as string)).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('should return true when string meets minimum length', () => {
      expect(hasMinLength('hello', 3)).toBe(true);
      expect(hasMinLength('hello', 5)).toBe(true);
    });

    it('should return false when string is too short', () => {
      expect(hasMinLength('hi', 3)).toBe(false);
      expect(hasMinLength('', 1)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(hasMinLength('', 0)).toBe(true);
      expect(hasMinLength(null as unknown as string, 0)).toBe(true);
      expect(hasMinLength(null as unknown as string, 1)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('should return true when string is within maximum length', () => {
      expect(hasMaxLength('hello', 10)).toBe(true);
      expect(hasMaxLength('hello', 5)).toBe(true);
    });

    it('should return false when string is too long', () => {
      expect(hasMaxLength('hello world', 5)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(hasMaxLength('', 0)).toBe(true);
      expect(hasMaxLength(null as unknown as string, 0)).toBe(true);
    });
  });

  describe('isLengthInRange', () => {
    it('should return true when string is within range', () => {
      expect(isLengthInRange('hello', 3, 10)).toBe(true);
      expect(isLengthInRange('hello', 5, 5)).toBe(true);
    });

    it('should return false when string is outside range', () => {
      expect(isLengthInRange('hi', 3, 10)).toBe(false);
      expect(isLengthInRange('hello world', 3, 5)).toBe(false);
    });

    it('should handle boundary cases', () => {
      expect(isLengthInRange('abc', 3, 3)).toBe(true);
      expect(isLengthInRange('', 0, 5)).toBe(true);
    });
  });
});
