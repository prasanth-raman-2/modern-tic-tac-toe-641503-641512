import React from 'react';

// PUBLIC_INTERFACE
const Board = ({ squares, onSquareClick, winningLine }) => {
  return (
    <div className="game-board">
      {squares.map((square, index) => (
        <button
          key={index}
          className={`square ${winningLine?.includes(index) ? 'winning' : ''}`}
          onClick={() => onSquareClick(index)}
          disabled={square || winningLine}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default Board;
