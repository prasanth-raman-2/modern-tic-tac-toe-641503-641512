import { calculateWinner, isDraw } from './gameUtils';

describe('Game Utilities', () => {
  describe('calculateWinner', () => {
    test('detects horizontal win', () => {
      const squares = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const result = calculateWinner(squares);
      expect(result).toEqual({ winner: 'X', line: [0, 1, 2] });
    });

    test('detects vertical win', () => {
      const squares = ['O', null, 'X', 'O', null, 'X', 'O', null, null];
      const result = calculateWinner(squares);
      expect(result).toEqual({ winner: 'O', line: [0, 3, 6] });
    });

    test('detects diagonal win', () => {
      const squares = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
      const result = calculateWinner(squares);
      expect(result).toEqual({ winner: 'X', line: [0, 4, 8] });
    });

    test('returns null when no winner', () => {
      const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
      const result = calculateWinner(squares);
      expect(result).toBeNull();
    });

    test('handles empty board', () => {
      const squares = Array(9).fill(null);
      const result = calculateWinner(squares);
      expect(result).toBeNull();
    });
  });

  describe('isDraw', () => {
    test('detects draw when board is full with no winner', () => {
      const squares = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(isDraw(squares)).toBe(true);
    });

    test('returns false when board is not full', () => {
      const squares = ['X', 'O', 'X', null, 'O', 'O', 'O', 'X', 'X'];
      expect(isDraw(squares)).toBe(false);
    });

    test('returns false for empty board', () => {
      const squares = Array(9).fill(null);
      expect(isDraw(squares)).toBe(false);
    });
  });
});
