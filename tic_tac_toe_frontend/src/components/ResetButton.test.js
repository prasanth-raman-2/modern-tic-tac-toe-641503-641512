import { render, screen, fireEvent } from '@testing-library/react';
import { simulateRapidClicks, validateAccessibilityAttributes } from '../utils/testUtils';
import App from '../App';

describe('Reset Button', () => {
  describe('Basic Functionality', () => {
    test('renders reset button with correct text', () => {
      render(<App />);
      const resetButton = screen.getByText(/reset game/i);
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toHaveClass('reset-button');
    });

    test('resets game board when clicked', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Make some moves
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      fireEvent.click(squares[2]); // X

      // Verify moves were made
      expect(squares[0]).toHaveTextContent('X');
      expect(squares[1]).toHaveTextContent('O');
      expect(squares[2]).toHaveTextContent('X');

      // Reset game
      fireEvent.click(resetButton);

      // Verify board is cleared
      squares.forEach(square => {
        expect(square).toHaveTextContent('');
      });
    });

    test('resets to player X after reset', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Make moves to change current player to O
      fireEvent.click(squares[0]); // X plays
      expect(screen.getByText(/next player: o/i)).toBeInTheDocument();

      // Reset game
      fireEvent.click(resetButton);

      // Verify it's X's turn
      expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
    });
  });

  describe('Score Preservation', () => {
    test('maintains scores after reset', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Play a winning game for X
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X wins

      // Verify X's score is 1
      expect(screen.getByText('Player X: 1')).toBeInTheDocument();

      // Reset and verify score remains
      fireEvent.click(resetButton);
      expect(screen.getByText('Player X: 1')).toBeInTheDocument();
    });

    test('preserves multiple game scores through resets', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Win two games with X
      for (let i = 0; i < 2; i++) {
        fireEvent.click(squares[0]); // X
        fireEvent.click(squares[3]); // O
        fireEvent.click(squares[1]); // X
        fireEvent.click(squares[4]); // O
        fireEvent.click(squares[2]); // X wins
        fireEvent.click(resetButton);
      }

      expect(screen.getByText('Player X: 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid multiple resets', async () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Make some moves
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O

      // Rapid resets
      await simulateRapidClicks(resetButton, 5);

      // Verify game state is properly reset
      squares.forEach(square => {
        expect(square).toHaveTextContent('');
      });
      expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
    });

    test('resets during ongoing game preserves win conditions', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);

      // Start a game
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O

      // Reset mid-game
      fireEvent.click(resetButton);

      // Complete a winning game
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X wins

      // Verify win is detected
      expect(screen.getByText('Winner: X')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has correct accessibility attributes', () => {
      render(<App />);
      const resetButton = screen.getByText(/reset game/i);
      const attrs = validateAccessibilityAttributes(resetButton);
      
      expect(resetButton).toHaveAttribute('role', 'button');
      expect(resetButton).toHaveAttribute('aria-label', 'Reset game');
    });

    test('is keyboard accessible', () => {
      render(<App />);
      const resetButton = screen.getByText(/reset game/i);
      const squares = screen.getAllByRole('button').slice(0, 9);

      // Make some moves
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O

      // Reset using keyboard
      resetButton.focus();
      fireEvent.keyPress(resetButton, { key: 'Enter', code: 'Enter' });

      // Verify reset occurred
      squares.forEach(square => {
        expect(square).toHaveTextContent('');
      });
    });
  });
});
