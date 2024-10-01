import React from 'react';

const Controls = ({ onMove }) => {
  return (
    <div className="controls">
      <button onClick={() => onMove(-1, 0)}>Up</button>
      <button onClick={() => onMove(1, 0)}>Down</button>
      <button onClick={() => onMove(0, -1)}>Left</button>
      <button onClick={() => onMove(0, 1)}>Right</button>
    </div>
  );
};

export default Controls;
