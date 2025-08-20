import { render } from '@testing-library/react';

// Helper to render components with any necessary providers/context
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { ...options });
};

// Helper to create a mock game state
export const createMockGameState = (squares = Array(9).fill(null)) => ({
  squares,
  currentPlayer: 'X',
  scores: { X: 0, O: 0 },
});

// Helper to simulate a sequence of moves
export const simulateGameMoves = (moves) => {
  const squares = Array(9).fill(null);
  let currentPlayer = 'X';
  
  moves.forEach(position => {
    if (position >= 0 && position < 9 && !squares[position]) {
      squares[position] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  });
  
  return squares;
};
