import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import { calculateWinner, isDraw } from './utils/gameUtils';

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;
  const gameIsDraw = !winner && isDraw(squares);

  const handleSquareClick = (index) => {
    if (squares[index] || winner) return;

    const newSquares = squares.slice();
    newSquares[index] = currentPlayer;
    setSquares(newSquares);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    const result = calculateWinner(newSquares);
    if (result) {
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
    }
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1>Tic Tac Toe</h1>
        <GameStatus 
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={gameIsDraw}
          scores={scores}
        />
        <Board 
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button className="reset-button" onClick={handleReset}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;
