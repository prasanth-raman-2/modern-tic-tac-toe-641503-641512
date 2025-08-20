import React from 'react';

// PUBLIC_INTERFACE
const GameStatus = ({ currentPlayer, winner, isDraw, scores }) => {
  const statusMessage = winner 
    ? `Winner: ${winner}`
    : isDraw 
    ? "It's a draw!"
    : `Next player: ${currentPlayer}`;

  return (
    <div className="game-status" role="status" aria-live="polite">
      <div className="players-score">
        <div 
          className={`player ${currentPlayer === 'X' ? 'active' : ''}`}
          role="status"
          aria-label={`Player X score: ${scores.X}`}
        >
          Player X: {scores.X}
        </div>
        <div 
          className={`player ${currentPlayer === 'O' ? 'active' : ''}`}
          role="status"
          aria-label={`Player O score: ${scores.O}`}
        >
          Player O: {scores.O}
        </div>
      </div>
      <div 
        className="status-message"
        aria-label={statusMessage}
      >
        {statusMessage}
      </div>
    </div>
  );
};

export default GameStatus;
