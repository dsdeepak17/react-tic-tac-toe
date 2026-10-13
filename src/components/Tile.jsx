import React from 'react';

import CrossMarkIcon from '../assets/cross.svg';

const Tile = ({ value, index, currentPlayer, winningLine = [], isDisabled, onSelect }) => {
  const isWinningTile = winningLine.includes(index);
  const mark = typeof value === 'number' ? '' : value;

  const tileContent = () => {
    if (typeof value === 'number') {
      return '';
    }

    if (value === 'X') {
      return <img src={CrossMarkIcon} alt="X mark" className="cross-svg-icon" />;
    }

    return value;
  };

  const handleClick = () => {
    if (!isDisabled && typeof value === 'number') {
      onSelect(index, currentPlayer);
    }
  };

  return (
    <div className="tile">
      <button
        type="button"
        className={isWinningTile ? 'tile-btn win-pos' : 'tile-btn'}
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={mark ? `Square ${index + 1}: ${mark}` : `Square ${index + 1}, empty`}
        aria-pressed={Boolean(mark)}
      >
        {tileContent()}
      </button>
    </div>
  );
};

export default Tile;
