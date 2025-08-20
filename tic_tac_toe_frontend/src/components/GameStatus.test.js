import { render, screen } from '@testing-library/react';
import GameStatus from './GameStatus';

describe('GameStatus Component', () => {
  describe('Score Display', () => {
    test('displays correct player scores', () => {
      const scores = { X: 3, O: 2 };
      render(<GameStatus currentPlayer="X" scores={scores} />);
      
      expect(screen.getByText('Player X: 3')).toBeInTheDocument();
      expect(screen.getByText('Player O: 2')).toBeInTheDocument();
    });

    test('handles large score numbers correctly', () => {
      const scores = { X: 9999, O: 10000 };
      render(<GameStatus currentPlayer="X" scores={scores} />);
      
      expect(screen.getByText('Player X: 9999')).toBeInTheDocument();
      expect(screen.getByText('Player O: 10000')).toBeInTheDocument();
    });
  });

  describe('Player Indicators', () => {
    test('shows active player indicator for X', () => {
      render(<GameStatus currentPlayer="X" scores={{ X: 0, O: 0 }} />);
      
      const playerXDiv = screen.getByText(/Player X:/i).parentElement;
      const playerODiv = screen.getByText(/Player O:/i).parentElement;
      
      expect(playerXDiv).toHaveClass('active');
      expect(playerODiv).not.toHaveClass('active');
    });

    test('shows active player indicator for O', () => {
      render(<GameStatus currentPlayer="O" scores={{ X: 0, O: 0 }} />);
      
      const playerXDiv = screen.getByText(/Player X:/i).parentElement;
      const playerODiv = screen.getByText(/Player O:/i).parentElement;
      
      expect(playerXDiv).not.toHaveClass('active');
      expect(playerODiv).toHaveClass('active');
    });
  });

  describe('Game State Messages', () => {
    test('displays winner message when X wins', () => {
      render(
        <GameStatus
          currentPlayer="O"
          winner="X"
          isDraw={false}
          scores={{ X: 1, O: 0 }}
        />
      );
      
      const message = screen.getByText('Winner: X');
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute('aria-label', 'Winner: X');
    });

    test('displays winner message when O wins', () => {
      render(
        <GameStatus
          currentPlayer="X"
          winner="O"
          isDraw={false}
          scores={{ X: 0, O: 1 }}
        />
      );
      
      const message = screen.getByText('Winner: O');
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute('aria-label', 'Winner: O');
    });

    test('displays draw message when game is drawn', () => {
      render(
        <GameStatus
          currentPlayer="O"
          winner={null}
          isDraw={true}
          scores={{ X: 0, O: 0 }}
        />
      );
      
      const message = screen.getByText("It's a draw!");
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute('aria-label', "It's a draw!");
    });

    test('displays next player message during active game', () => {
      render(
        <GameStatus
          currentPlayer="O"
          winner={null}
          isDraw={false}
          scores={{ X: 0, O: 0 }}
        />
      );
      
      const message = screen.getByText('Next player: O');
      expect(message).toBeInTheDocument();
      expect(message).toHaveAttribute('aria-label', 'Next player: O');
    });
  });

  describe('Accessibility', () => {
    test('has correct ARIA roles and labels', () => {
      render(
        <GameStatus
          currentPlayer="X"
          winner={null}
          isDraw={false}
          scores={{ X: 1, O: 2 }}
        />
      );
      
      const statusContainer = screen.getByRole('status');
      expect(statusContainer).toHaveAttribute('aria-live', 'polite');
      
      const playerXScore = screen.getByLabelText('Player X score: 1');
      const playerOScore = screen.getByLabelText('Player O score: 2');
      
      expect(playerXScore).toBeInTheDocument();
      expect(playerOScore).toBeInTheDocument();
    });

    test('updates ARIA labels when game state changes', () => {
      const { rerender } = render(
        <GameStatus
          currentPlayer="X"
          winner={null}
          isDraw={false}
          scores={{ X: 0, O: 0 }}
        />
      );
      
      expect(screen.getByLabelText('Next player: X')).toBeInTheDocument();
      
      rerender(
        <GameStatus
          currentPlayer="X"
          winner="X"
          isDraw={false}
          scores={{ X: 1, O: 0 }}
        />
      );
      
      expect(screen.getByLabelText('Winner: X')).toBeInTheDocument();
    });
  });
});
