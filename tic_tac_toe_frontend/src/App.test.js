import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { simulateGameMoves, simulateRapidClicks, simulateKeyboardNavigation, validateAccessibilityAttributes } from './utils/testUtils';

describe('App Component', () => {
  describe('Basic Game Functionality', () => {
    test('renders game title', () => {
      render(<App />);
      const titleElement = screen.getByText(/tic tac toe/i);
      expect(titleElement).toBeInTheDocument();
    });

    test('initializes with empty board and correct initial state', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9); // Exclude reset button
      squares.forEach(square => {
        expect(square).toHaveTextContent('');
      });
      expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
      expect(screen.getByText('Player X: 0')).toBeInTheDocument();
      expect(screen.getByText('Player O: 0')).toBeInTheDocument();
    });

    test('allows players to make alternating moves', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      
      // First move - X
      fireEvent.click(squares[0]);
      expect(squares[0]).toHaveTextContent('X');
      expect(screen.getByText(/next player: o/i)).toBeInTheDocument();
      
      // Second move - O
      fireEvent.click(squares[1]);
      expect(squares[1]).toHaveTextContent('O');
      expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    test('handles rapid multiple clicks on same square', async () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      
      await simulateRapidClicks(squares[0], 5);
      expect(squares[0]).toHaveTextContent('X');
      expect(screen.getByText(/next player: o/i)).toBeInTheDocument();
    });

    test('handles rapid clicks on different squares', async () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      
      // Simulate rapid clicks on different squares
      await Promise.all([
        simulateRapidClicks(squares[0], 2),
        simulateRapidClicks(squares[1], 2),
        simulateRapidClicks(squares[2], 2),
      ]);

      // Verify game state remains consistent
      expect(squares[0]).toHaveTextContent('X');
      expect(squares[1]).toHaveTextContent('O');
      expect(squares[2]).toHaveTextContent('X');
    });

    test('maintains game state during rapid reset clicks', async () => {
      render(<App />);
      const resetButton = screen.getByText(/reset game/i);
      
      // Make some moves
      const squares = screen.getAllByRole('button').slice(0, 9);
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[1]); // O
      
      // Rapid reset clicks
      await simulateRapidClicks(resetButton, 5);
      
      // Verify board is cleared and game state is reset
      squares.forEach(square => {
        expect(square).toHaveTextContent('');
      });
      expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    test('supports keyboard navigation through game board', async () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      
      // Focus first square
      squares[0].focus();
      expect(document.activeElement).toBe(squares[0]);
      
      // Test arrow key navigation
      await simulateKeyboardNavigation(squares[0], ['ArrowRight', 'Enter']);
      expect(squares[1]).toHaveTextContent('X');
      
      await simulateKeyboardNavigation(squares[1], ['ArrowDown', 'Enter']);
      expect(squares[4]).toHaveTextContent('O');
    });

    test('verifies accessibility attributes on game elements', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      
      squares.forEach((square, index) => {
        const attrs = validateAccessibilityAttributes(square);
        expect(attrs.role).toBe('button');
        expect(attrs.ariaLabel).toBe(`Square ${index + 1}`);
      });

      const resetButton = screen.getByText(/reset game/i);
      const resetAttrs = validateAccessibilityAttributes(resetButton);
      expect(resetAttrs.role).toBe('button');
      expect(resetAttrs.ariaLabel).toBe('Reset game');
    });
  });

  describe('Score Tracking and Game Progress', () => {
    test('maintains score across multiple games', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);
      
      // Win first game with X
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[2]); // X wins
      
      expect(screen.getByText('Player X: 1')).toBeInTheDocument();
      
      // Reset and win second game with O
      fireEvent.click(resetButton);
      fireEvent.click(squares[0]); // X
      fireEvent.click(squares[3]); // O
      fireEvent.click(squares[1]); // X
      fireEvent.click(squares[4]); // O
      fireEvent.click(squares[8]); // X
      fireEvent.click(squares[5]); // O wins
      
      expect(screen.getByText('Player X: 1')).toBeInTheDocument();
      expect(screen.getByText('Player O: 1')).toBeInTheDocument();
    });

    test('handles multiple game resets without score corruption', () => {
      render(<App />);
      const squares = screen.getAllByRole('button').slice(0, 9);
      const resetButton = screen.getByText(/reset game/i);
      
      // Play and win multiple games
      for (let i = 0; i < 3; i++) {
        // Win game with X
        fireEvent.click(squares[0]); // X
        fireEvent.click(squares[3]); // O
        fireEvent.click(squares[1]); // X
        fireEvent.click(squares[4]); // O
        fireEvent.click(squares[2]); // X wins
        
        fireEvent.click(resetButton);
      }
      
      expect(screen.getByText('Player X: 3')).toBeInTheDocument();
      expect(screen.getByText('Player O: 0')).toBeInTheDocument();
    });
  });
});
