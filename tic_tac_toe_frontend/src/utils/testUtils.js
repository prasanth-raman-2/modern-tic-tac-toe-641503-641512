import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

// Helper to simulate rapid clicks on game board
export const simulateRapidClicks = async (element, times = 3) => {
  for (let i = 0; i < times; i++) {
    fireEvent.click(element);
    await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to simulate rapid clicks
  }
};

// Helper to test keyboard navigation
export const simulateKeyboardNavigation = async (startElement, steps) => {
  let currentElement = startElement;
  for (const step of steps) {
    fireEvent.keyDown(currentElement, { key: step });
    await new Promise(resolve => setTimeout(resolve, 50));
  }
};

// Helper to validate accessibility attributes
export const validateAccessibilityAttributes = (element) => {
  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  const ariaPressed = element.getAttribute('aria-pressed');
  const tabIndex = element.getAttribute('tabindex');
  
  return {
    role,
    ariaLabel,
    ariaPressed,
    tabIndex
  };
};
