import React from 'react';

import Leaderboard from './Leaderboard';
import Tile from './Tile';
import { GAME_MODES, getScoreSummary } from '../game/gameLogic';
import { useTicTacToe } from '../hooks/useTicTacToe';

const Board = ({ gameMode, difficulty, onStatsChange }) => {
  const {
    board,
    currentPlayer,
    winner,
    winnerDisplay,
    winningLine,
    players,
    leaderboard,
    isPaused,
    handleMove,
    handleNameChange,
    handleReset,
  } = useTicTacToe({ gameMode, difficulty });

  React.useEffect(() => {
    onStatsChange({
      playerName: players.player2,
      difficulty,
      scores: getScoreSummary(leaderboard),
      gamesPlayed: leaderboard.length,
    });
  }, [difficulty, leaderboard, onStatsChange, players.player2]);

  const showWinnerMessage = winner === 'Tie' ? 'The Game is Tied!' : `Winner: ${winnerDisplay}`;
  const turnMessage = winner
    ? 'Round complete'
    : gameMode === GAME_MODES.ONE_PLAYER && currentPlayer === 'player2'
      ? 'Computer is thinking…'
      : `${players[currentPlayer]}'s turn`;

  return (
    <div className="center">
      <Leaderboard leaderboard={leaderboard} players={players} />

      <div className="player-names">
        <label className={currentPlayer === 'player1' && !winner ? 'player-card active' : 'player-card'}>
          <span className="player-symbol symbol-x">X</span>
          <span className="player-detail">
            <span className="player-caption">Player one</span>
            <input
              type="text"
              className="player-name-input"
              name="player1"
              aria-label="Player one name"
              value={players.player1}
              onChange={handleNameChange}
            />
          </span>
        </label>

        <label className={currentPlayer === 'player2' && !winner ? 'player-card active' : 'player-card'}>
          <span className="player-symbol symbol-o">O</span>
          <span className="player-detail">
            <span className="player-caption">{gameMode === GAME_MODES.ONE_PLAYER ? 'Computer' : 'Player two'}</span>
            <input
              type="text"
              className="player-name-input"
              name="player2"
              aria-label="Player two name"
              value={players.player2}
              onChange={handleNameChange}
              disabled={gameMode === GAME_MODES.ONE_PLAYER}
            />
          </span>
        </label>
      </div>

      <p className={winner ? 'turn-status finished' : 'turn-status'} aria-live="polite">
        {!winner && !isPaused && gameMode === GAME_MODES.ONE_PLAYER && currentPlayer === 'player2' && (
          <span className="thinking-indicator" aria-hidden="true" />
        )}
        {turnMessage}
      </p>

      <div className="game">
        <div className={winner ? 'board game-over' : 'board'} role="group" aria-label="Tic-tac-toe board">
          {board.map((value, index) => (
            <Tile
              key={index}
              value={value}
              index={index}
              currentPlayer={currentPlayer}
              winningLine={winningLine}
              isDisabled={
                isPaused ||
                (gameMode === GAME_MODES.ONE_PLAYER && currentPlayer === 'player2') ||
                typeof value !== 'number'
              }
              onSelect={handleMove}
            />
          ))}
        </div>
      </div>

      {winner && (
        <p className="game-over-message" aria-live="polite">{showWinnerMessage}</p>
      )}

      {isPaused && (
        <button type="button" className="reset-btn" onClick={handleReset}>
          Play again
        </button>
      )}
    </div>
  );
};

export default Board;
