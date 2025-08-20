import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';

describe('Board Component', () => {
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

  test('calls onSquareClick with correct index', () => {
    const squares = Array(9).fill(null);
    const mockClick = jest.fn();
    render(<Board squares={squares} onSquareClick={mockClick} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[4]);
    expect(mockClick).toHaveBeenCalledWith(4);
  });

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

  test('disables squares when game is won', () => {
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
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
