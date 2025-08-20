import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { simulateGameMoves } from './utils/testUtils';

describe('App Component', () => {
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

  test('prevents clicking on already filled squares', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').slice(0, 9);
    
    fireEvent.click(squares[0]); // X plays
    expect(squares[0]).toHaveTextContent('X');
    
    fireEvent.click(squares[0]); // Try to play in same square
    expect(squares[0]).toHaveTextContent('X'); // Should not change
    expect(screen.getByText(/next player: o/i)).toBeInTheDocument(); // Turn should not change
  });

  test('detects and announces winner correctly', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').slice(0, 9);
    
    // Create winning condition for X: top row
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X wins
    
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
    expect(screen.getByText('Player X: 1')).toBeInTheDocument();
  });

  test('detects and announces draw correctly', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').slice(0, 9);
    
    // Simulate a draw game
    const moves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    moves.forEach(index => {
      fireEvent.click(squares[index]);
    });
    
    expect(screen.getByText("It's a draw!")).toBeInTheDocument();
  });

  test('reset button clears the board and maintains scores', () => {
    render(<App />);
    const squares = screen.getAllByRole('button').slice(0, 9);
    
    // Play a winning game for X
    fireEvent.click(squares[0]);
    fireEvent.click(squares[3]);
    fireEvent.click(squares[1]);
    fireEvent.click(squares[4]);
    fireEvent.click(squares[2]);
    
    const resetButton = screen.getByText(/reset game/i);
    fireEvent.click(resetButton);
    
    // Board should be cleared
    squares.forEach(square => {
      expect(square).toHaveTextContent('');
    });
    
    // Scores should be maintained
    expect(screen.getByText('Player X: 1')).toBeInTheDocument();
    expect(screen.getByText('Player O: 0')).toBeInTheDocument();
    
    // Game should be ready for new moves
    expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
  });
});
