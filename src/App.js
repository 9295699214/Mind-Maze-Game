import React, { useState, useEffect } from 'react';
import './App.css';
import winSound from './sounds/win.mp3';
import trapSound from './sounds/trap.mp3';
import moveSound from './sounds/move.mp3';

const ROWS = 10;
const COLS = 10;
const TRAP_COUNT = 15;

const generateMaze = () => {
  const maze = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  
  // Set some walls (for simplicity, we'll place some random walls)
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (Math.random() < 0.2 && (i !== 0 || j !== 0) && (i !== ROWS - 1 || j !== COLS - 1)) {
        maze[i][j] = 1; // 1 for Wall
      }
    }
  }

  // Generate traps
  let trapsPlaced = 0;
  while (trapsPlaced < TRAP_COUNT) {
    const x = Math.floor(Math.random() * ROWS);
    const y = Math.floor(Math.random() * COLS);
    
    if ((x !== 0 || y !== 0) && (x !== ROWS - 1 || y !== COLS - 1) && maze[x][y] === 0) {
      maze[x][y] = 'T'; // T for Trap
      trapsPlaced++;
    }
  }

  // Ensure there's at least one path to the goal (bottom-right corner)
  maze[ROWS - 1][COLS - 1] = 'G'; // G for Goal
  return maze;
};

const App = () => {
  const [maze, setMaze] = useState(generateMaze());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(30);
  const [revealedTraps, setRevealedTraps] = useState([]); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || won) return;
      
      const { key } = e;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      if (key === 'ArrowUp') newX--;
      else if (key === 'ArrowDown') newX++;
      else if (key === 'ArrowLeft') newY--;
      else if (key === 'ArrowRight') newY++;
      
      if (newX < 0 || newY < 0 || newX >= ROWS || newY >= COLS) return;
      if (maze[newX][newY] === 1) return; // Block movement if it's a wall
      if (maze[newX][newY] === 'T') {
        setGameOver(true);
        setRevealedTraps(prev => [...prev, { x: newX, y: newY }]);
        new Audio(trapSound).play();
        return;
      }
      if (maze[newX][newY] === 'G') {
        setWon(true);
        new Audio(winSound).play();
        return;
      }

      setPlayerPosition({ x: newX, y: newY });
      new Audio(moveSound).play();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, gameOver, won]);

  useEffect(() => {
    if (timer > 0 && !gameOver && !won) {
      const timerId = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver, won]);

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPosition({ x: 0, y: 0 });
    setGameOver(false);
    setWon(false);
    setRevealedTraps([]);
    setTimer(30);
  };

  const isTrapRevealed = (x, y) => {
    return revealedTraps.some(trap => trap.x === x && trap.y === y);
  };

  return (
    <div className="App">
      <h1>Maze Game</h1>
      <h2>{gameOver ? 'Game Over!' : won ? 'You Won!' : `Time Remaining: ${timer}`}</h2>
      <div className="container">
        <div className="maze">
          {maze.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                const isPlayer = playerPosition.x === rowIndex && playerPosition.y === colIndex;
                const isGoal = cell === 'G';
                const isWall = cell === 1;
                const isTrap = cell === 'T' && isTrapRevealed(rowIndex, colIndex);
                const className = `cell ${
                  isPlayer
                    ? 'player'
                    : isGoal
                    ? 'goal'
                    : isWall
                    ? 'wall'
                    : isTrap
                    ? 'trap'
                    : cell === 'T'
                    ? 'invisible-trap'
                    : 'empty'
                }`;
                return <div key={colIndex} className={className}></div>;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {(gameOver || won) && (
        <button onClick={resetGame}>Play Again</button>
      )}
    </div>
  );
};

export default App;
