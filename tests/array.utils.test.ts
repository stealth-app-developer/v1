import {
  unique,
  flatten,
  chunk,
  shuffle,
  intersection,
  difference,
  union,
  groupBy,
  findLast,
  countBy,
  partition,
  zip,
  take,
  takeLast
} from '../src/array.utils';

describe('Array Utilities', () => {
  describe('unique', () => {
    it('should remove duplicates from array', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for empty input', () => {
      expect(unique([])).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(unique(null as unknown as number[])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should preserve order', () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays by one level', () => {
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    });

    it('should flatten deeply nested arrays with depth parameter', () => {
      expect(flatten([[[1, 2]], [[3, 4]]], 2)).toEqual([1, 2, 3, 4]);
    });

    it('should handle mixed levels', () => {
      expect(flatten([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
    });

    it('should return empty array for empty input', () => {
      expect(flatten([])).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(flatten(null as unknown as number[][])).toEqual([]);
    });

    it('should not flatten when depth is 0', () => {
      expect(flatten([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should return empty array for empty input', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should return empty array for size 0', () => {
      expect(chunk([1, 2, 3], 0)).toEqual([]);
    });

    it('should return empty array for negative size', () => {
      expect(chunk([1, 2, 3], -1)).toEqual([]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });

  describe('shuffle', () => {
    it('should return array with same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const copy = [...arr];
      shuffle(arr);
      expect(arr).toEqual(copy);
    });

    it('should return empty array for empty input', () => {
      expect(shuffle([])).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(shuffle(null as unknown as number[])).toEqual([]);
    });

    it('should handle single element', () => {
      expect(shuffle([1])).toEqual([1]);
    });
  });

  describe('intersection', () => {
    it('should return common elements', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should return empty array when no common elements', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2])).toEqual([]);
      expect(intersection([1, 2], [])).toEqual([]);
    });

    it('should remove duplicates from result', () => {
      expect(intersection([1, 1, 2, 2], [1, 2, 3])).toEqual([1, 2]);
    });

    it('should handle null/undefined', () => {
      expect(intersection(null as unknown as number[], [1, 2])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should return elements in first array but not in second', () => {
      expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    });

    it('should return all elements when no overlap', () => {
      expect(difference([1, 2], [3, 4])).toEqual([1, 2]);
    });

    it('should return empty array when all elements are in second array', () => {
      expect(difference([1, 2], [1, 2, 3])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(difference([], [1, 2])).toEqual([]);
      expect(difference([1, 2], [])).toEqual([1, 2]);
    });

    it('should handle null/undefined', () => {
      expect(difference(null as unknown as number[], [1, 2])).toEqual([]);
    });
  });

  describe('union', () => {
    it('should return unique elements from both arrays', () => {
      expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle disjoint arrays', () => {
      expect(union([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle identical arrays', () => {
      expect(union([1, 2], [1, 2])).toEqual([1, 2]);
    });

    it('should handle empty arrays', () => {
      expect(union([], [1, 2])).toEqual([1, 2]);
      expect(union([1, 2], [])).toEqual([1, 2]);
    });

    it('should handle null/undefined', () => {
      expect(union(null as unknown as number[], [1, 2])).toEqual([1, 2]);
    });

    it('should remove duplicates', () => {
      expect(union([1, 1, 2], [2, 3, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('groupBy', () => {
    it('should group elements by key function', () => {
      const result = groupBy([1, 2, 3, 4, 5], x => x % 2 === 0 ? 'even' : 'odd');
      expect(result).toEqual({
        odd: [1, 3, 5],
        even: [2, 4]
      });
    });

    it('should handle objects', () => {
      const arr = [
        { name: 'John', age: 20 },
        { name: 'Jane', age: 20 },
        { name: 'Bob', age: 30 }
      ];
      const result = groupBy(arr, x => x.age);
      expect(result[20]).toHaveLength(2);
      expect(result[30]).toHaveLength(1);
    });

    it('should return empty object for empty array', () => {
      expect(groupBy([], x => x)).toEqual({});
    });

    it('should handle null/undefined', () => {
      expect(groupBy(null as unknown as number[], x => x)).toEqual({});
    });
  });

  describe('findLast', () => {
    it('should find last element matching predicate', () => {
      expect(findLast([1, 2, 3, 4, 5], x => x % 2 === 0)).toBe(4);
    });

    it('should return undefined when no match', () => {
      expect(findLast([1, 3, 5], x => x % 2 === 0)).toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      expect(findLast([], () => true)).toBeUndefined();
    });

    it('should handle null/undefined', () => {
      expect(findLast(null as unknown as number[], () => true)).toBeUndefined();
    });

    it('should return first match when only one exists', () => {
      expect(findLast([1, 2, 3], x => x === 2)).toBe(2);
    });
  });

  describe('countBy', () => {
    it('should count occurrences of each element', () => {
      expect(countBy(['a', 'b', 'a', 'c', 'a', 'b'])).toEqual({
        a: 3,
        b: 2,
        c: 1
      });
    });

    it('should handle numbers', () => {
      expect(countBy([1, 2, 1, 3, 1, 2])).toEqual({
        1: 3,
        2: 2,
        3: 1
      });
    });

    it('should return empty object for empty array', () => {
      expect(countBy([])).toEqual({});
    });

    it('should handle null/undefined', () => {
      expect(countBy(null as unknown as string[])).toEqual({});
    });

    it('should handle single element', () => {
      expect(countBy(['a'])).toEqual({ a: 1 });
    });
  });

  describe('partition', () => {
    it('should partition array based on predicate', () => {
      expect(partition([1, 2, 3, 4, 5], x => x % 2 === 0)).toEqual([[2, 4], [1, 3, 5]]);
    });

    it('should return empty first array when no matches', () => {
      expect(partition([1, 3, 5], x => x % 2 === 0)).toEqual([[], [1, 3, 5]]);
    });

    it('should return empty second array when all match', () => {
      expect(partition([2, 4, 6], x => x % 2 === 0)).toEqual([[2, 4, 6], []]);
    });

    it('should return empty arrays for empty input', () => {
      expect(partition([], () => true)).toEqual([[], []]);
    });

    it('should handle null/undefined', () => {
      expect(partition(null as unknown as number[], () => true)).toEqual([[], []]);
    });
  });

  describe('zip', () => {
    it('should zip arrays together', () => {
      expect(zip<string | number>([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });

    it('should stop at shortest array', () => {
      expect(zip<string | number>([1, 2, 3], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']]);
    });

    it('should handle multiple arrays', () => {
      expect(zip<string | number | boolean>([1, 2], ['a', 'b'], [true, false])).toEqual([[1, 'a', true], [2, 'b', false]]);
    });

    it('should return empty array for empty input', () => {
      expect(zip()).toEqual([]);
    });

    it('should handle single array', () => {
      expect(zip([1, 2, 3])).toEqual([[1], [2], [3]]);
    });
  });

  describe('take', () => {
    it('should take first n elements', () => {
      expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });

    it('should take all elements when n is larger than array', () => {
      expect(take([1, 2, 3], 5)).toEqual([1, 2, 3]);
    });

    it('should return empty array when n is 0', () => {
      expect(take([1, 2, 3], 0)).toEqual([]);
    });

    it('should return empty array for negative n', () => {
      expect(take([1, 2, 3], -1)).toEqual([]);
    });

    it('should handle empty array', () => {
      expect(take([], 3)).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(take(null as unknown as number[], 3)).toEqual([]);
    });
  });

  describe('takeLast', () => {
    it('should take last n elements', () => {
      expect(takeLast([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
    });

    it('should take all elements when n is larger than array', () => {
      expect(takeLast([1, 2, 3], 5)).toEqual([1, 2, 3]);
    });

    it('should return empty array when n is 0', () => {
      expect(takeLast([1, 2, 3], 0)).toEqual([]);
    });

    it('should return empty array for negative n', () => {
      expect(takeLast([1, 2, 3], -1)).toEqual([]);
    });

    it('should handle empty array', () => {
      expect(takeLast([], 3)).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(takeLast(null as unknown as number[], 3)).toEqual([]);
    });
  });
});
