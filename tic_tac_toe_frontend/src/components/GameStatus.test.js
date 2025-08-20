import { render, screen } from '@testing-library/react';
import GameStatus from './GameStatus';

describe('GameStatus Component', () => {
  test('displays correct player scores', () => {
    const scores = { X: 3, O: 2 };
    render(<GameStatus currentPlayer="X" scores={scores} />);
    
    expect(screen.getByText('Player X: 3')).toBeInTheDocument();
    expect(screen.getByText('Player O: 2')).toBeInTheDocument();
  });

  test('shows active player indicator', () => {
    render(<GameStatus currentPlayer="X" scores={{ X: 0, O: 0 }} />);
    
    const playerXDiv = screen.getByText(/Player X:/i).parentElement;
    const playerODiv = screen.getByText(/Player O:/i).parentElement;
    
    expect(playerXDiv).toHaveClass('active');
    expect(playerODiv).not.toHaveClass('active');
  });

  test('displays winner message when there is a winner', () => {
    render(
      <GameStatus
        currentPlayer="O"
        winner="X"
        isDraw={false}
        scores={{ X: 1, O: 0 }}
      />
    );
    
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
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
    
    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
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
    
    expect(screen.getByText('Next player: O')).toBeInTheDocument();
  });
});
