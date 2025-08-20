import React from 'react';

// PUBLIC_INTERFACE
const GameStatus = ({ currentPlayer, winner, isDraw, scores }) => {
  return (
    <div className="game-status">
      <div className="players-score">
        <div className={`player ${currentPlayer === 'X' ? 'active' : ''}`}>
          Player X: {scores.X}
        </div>
        <div className={`player ${currentPlayer === 'O' ? 'active' : ''}`}>
          Player O: {scores.O}
        </div>
      </div>
      <div className="status-message">
        {winner 
          ? `Winner: ${winner}`
          : isDraw 
          ? "It's a draw!"
          : `Next player: ${currentPlayer}`}
      </div>
    </div>
  );
};

export default GameStatus;
