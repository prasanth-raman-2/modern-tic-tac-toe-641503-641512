import React from 'react';

// PUBLIC_INTERFACE
const Board = ({ squares, onSquareClick, winningLine }) => {
  return (
    <div className="game-board" role="grid">
      {squares.map((square, index) => (
        <button
          key={index}
          className={`square ${winningLine?.includes(index) ? 'winning' : ''}`}
          onClick={() => onSquareClick(index)}
          disabled={square || winningLine}
          aria-label={`Square ${index + 1}`}
          aria-pressed={square ? 'true' : 'false'}
          tabIndex={0}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default Board;
