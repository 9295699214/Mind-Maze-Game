import React from 'react';
import './Maze.css';

const Maze = ({ maze, playerPosition }) => {
  return (
    <div className="maze">
      {maze.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <div
              key={j}
              className={`cell ${cell === 'W' ? 'wall' : ''} ${
                i === playerPosition.x && j === playerPosition.y ? 'player' : ''
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Maze;
