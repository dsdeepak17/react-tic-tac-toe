import React from 'react';

const Tile = ({ val, turn, handleTurn, handleTileVal }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (isNaN(val)) return;
    handleTileVal(val, turn);
    handleTurn(turn);
  };

  return (
    <div className="tile">
      <button className="tile-btn" onClick={handleClick}>
        {isNaN(val) ? val : ''}
      </button>
    </div>
  );
};

export default Tile;
