import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/tic tac toe/i);
  expect(titleElement).toBeInTheDocument();
});

test('allows players to make moves', () => {
  render(<App />);
  const squares = screen.getAllByRole('button');
  // Click first square
  fireEvent.click(squares[0]);
  expect(squares[0]).toHaveTextContent('X');
  // Click second square
  fireEvent.click(squares[1]);
  expect(squares[1]).toHaveTextContent('O');
});

test('shows current player', () => {
  render(<App />);
  expect(screen.getByText(/next player: x/i)).toBeInTheDocument();
});

test('reset button clears the board', () => {
  render(<App />);
  const squares = screen.getAllByRole('button');
  fireEvent.click(squares[0]);
  const resetButton = screen.getByText(/reset game/i);
  fireEvent.click(resetButton);
  expect(squares[0]).toHaveTextContent('');
});
