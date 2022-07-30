import React from 'react';
import CrossMarkIcon from './assets/cross.svg';

const Tile = ({ val, turn, handleTurn, handleTileVal, index, winPos = [] }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (isNaN(val)) return;
    handleTileVal(val, turn);
    handleTurn(turn);
  };

  const tileImage = () => {
    if (!isNaN(val)) return '';
    if (val === 'X')
      return <img src={CrossMarkIcon} alt="" className="cross-svg-icon" />;
    return val;
  };

  return (
    <div className="tile">
      <button className={winPos.includes(index) ? 'tile-btn win-pos' : 'tile-btn'} onClick={handleClick}>
        {tileImage()}
      </button>
    </div>
  );
};

export default Tile;
