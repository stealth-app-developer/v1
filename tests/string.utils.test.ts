import {
  capitalize,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  truncate,
  removeWhitespace,
  isPalindrome,
  wordCount,
  reverse,
  pad
} from '../src/string.utils';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle null/undefined by returning the input', () => {
      expect(capitalize(null as unknown as string)).toBe(null);
      expect(capitalize(undefined as unknown as string)).toBe(undefined);
    });

    it('should handle strings starting with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
    });
  });

  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('my-variable-name')).toBe('myVariableName');
    });

    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('my_variable_name')).toBe('myVariableName');
    });

    it('should convert space separated to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should handle empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('should handle already camelCase strings', () => {
      expect(toCamelCase('helloWorld')).toBe('helloworld');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('myVariableName')).toBe('my-variable-name');
    });

    it('should convert snake_case to kebab-case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should convert spaces to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(toKebabCase('')).toBe('');
    });

    it('should handle already kebab-case strings', () => {
      expect(toKebabCase('hello-world')).toBe('hello-world');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('myVariableName')).toBe('my_variable_name');
    });

    it('should convert kebab-case to snake_case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });

    it('should convert spaces to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate string longer than maxLength', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate string shorter than maxLength', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should not truncate string equal to maxLength', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('hello world', 8, '…')).toBe('hello w…');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(truncate(null as unknown as string, 10)).toBe(null);
    });
  });

  describe('removeWhitespace', () => {
    it('should remove all spaces', () => {
      expect(removeWhitespace('hello world')).toBe('helloworld');
    });

    it('should remove tabs and newlines', () => {
      expect(removeWhitespace('hello\tworld\n!')).toBe('helloworld!');
    });

    it('should handle multiple consecutive spaces', () => {
      expect(removeWhitespace('hello   world')).toBe('helloworld');
    });

    it('should handle empty string', () => {
      expect(removeWhitespace('')).toBe('');
    });

    it('should handle string with only whitespace', () => {
      expect(removeWhitespace('   ')).toBe('');
    });
  });

  describe('isPalindrome', () => {
    it('should return true for palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('level')).toBe(true);
      expect(isPalindrome('madam')).toBe(true);
    });

    it('should ignore case', () => {
      expect(isPalindrome('RaceCar')).toBe(true);
    });

    it('should ignore non-alphanumeric characters', () => {
      expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    });

    it('should return false for non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isPalindrome('')).toBe(false);
    });

    it('should handle single character', () => {
      expect(isPalindrome('a')).toBe(true);
    });
  });

  describe('wordCount', () => {
    it('should count words in a sentence', () => {
      expect(wordCount('hello world')).toBe(2);
      expect(wordCount('one two three four five')).toBe(5);
    });

    it('should handle multiple spaces between words', () => {
      expect(wordCount('hello   world')).toBe(2);
    });

    it('should return 0 for empty string', () => {
      expect(wordCount('')).toBe(0);
    });

    it('should return 0 for whitespace only', () => {
      expect(wordCount('   ')).toBe(0);
    });

    it('should count single word', () => {
      expect(wordCount('hello')).toBe(1);
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('world')).toBe('dlrow');
    });

    it('should handle palindromes', () => {
      expect(reverse('racecar')).toBe('racecar');
    });

    it('should handle empty string', () => {
      expect(reverse('')).toBe('');
    });

    it('should handle single character', () => {
      expect(reverse('a')).toBe('a');
    });

    it('should handle null/undefined', () => {
      expect(reverse(null as unknown as string)).toBe(null);
    });
  });

  describe('pad', () => {
    it('should pad right by default', () => {
      expect(pad('hello', 10)).toBe('hello     ');
    });

    it('should pad left when specified', () => {
      expect(pad('hello', 10, ' ', 'left')).toBe('     hello');
    });

    it('should pad both sides when specified', () => {
      expect(pad('hello', 11, ' ', 'both')).toBe('   hello   ');
    });

    it('should use custom padding character', () => {
      expect(pad('5', 3, '0', 'left')).toBe('005');
    });

    it('should not pad if string is already at target length', () => {
      expect(pad('hello', 5)).toBe('hello');
    });

    it('should not pad if string is longer than target length', () => {
      expect(pad('hello world', 5)).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(pad('', 5)).toBe('     ');
    });
  });
});
