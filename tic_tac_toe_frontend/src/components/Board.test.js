import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from './Board';
import { validateAccessibilityAttributes } from '../utils/testUtils';

describe('Board Component', () => {
  describe('Basic Rendering', () => {
    test('renders empty board correctly', () => {
      const squares = Array(9).fill(null);
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(9);
      buttons.forEach(button => {
        expect(button).toHaveTextContent('');
      });
    });

    test('renders squares with correct values', () => {
      const squares = ['X', 'O', null, 'X', null, 'O', null, null, 'X'];
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('X');
      expect(buttons[1]).toHaveTextContent('O');
      expect(buttons[2]).toHaveTextContent('');
    });
  });

  describe('Interaction Handling', () => {
    test('calls onSquareClick with correct index', () => {
      const squares = Array(9).fill(null);
      const mockClick = jest.fn();
      render(<Board squares={squares} onSquareClick={mockClick} />);
      
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[4]);
      expect(mockClick).toHaveBeenCalledWith(4);
    });

    test('handles rapid multiple clicks on squares', async () => {
      const squares = Array(9).fill(null);
      const mockClick = jest.fn();
      render(<Board squares={squares} onSquareClick={mockClick} />);
      
      const buttons = screen.getAllByRole('button');
      await Promise.all([
        fireEvent.click(buttons[0]),
        fireEvent.click(buttons[0]),
        fireEvent.click(buttons[0])
      ]);
      
      expect(mockClick).toHaveBeenCalledTimes(3);
      expect(mockClick).toHaveBeenCalledWith(0);
    });
  });

  describe('Visual Feedback', () => {
    test('highlights winning squares', () => {
      const squares = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const winningLine = [0, 1, 2];
      render(
        <Board 
          squares={squares} 
          onSquareClick={() => {}} 
          winningLine={winningLine}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('winning');
      expect(buttons[1]).toHaveClass('winning');
      expect(buttons[2]).toHaveClass('winning');
      expect(buttons[3]).not.toHaveClass('winning');
    });

    test('applies correct styles to disabled squares', () => {
      const squares = ['X', null, null, null, null, null, null, null, null];
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toBeDisabled();
      expect(buttons[0]).toHaveStyle({ cursor: 'not-allowed' });
    });
  });

  describe('Accessibility', () => {
    test('has correct ARIA attributes', () => {
      const squares = Array(9).fill(null);
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const board = screen.getByRole('grid');
      expect(board).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button, index) => {
        const attrs = validateAccessibilityAttributes(button);
        expect(attrs.ariaLabel).toBe(`Square ${index + 1}`);
        expect(attrs.ariaPressed).toBe('false');
        expect(attrs.tabIndex).toBe('0');
      });
    });

    test('updates ARIA pressed state correctly', () => {
      const squares = ['X', 'O', null, null, null, null, null, null, null];
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Edge Cases', () => {
    test('handles all squares filled', () => {
      const squares = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      render(<Board squares={squares} onSquareClick={() => {}} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    test('handles undefined winning line', () => {
      const squares = Array(9).fill(null);
      render(<Board squares={squares} onSquareClick={() => {}} winningLine={undefined} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveClass('winning');
      });
    });
  });
});
