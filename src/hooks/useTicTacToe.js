import React from 'react';

import {
  DIFFICULTIES,
  GAME_MODES,
  PLAYER_LABELS,
  SYMBOLS,
  TURN_COMPLEMENT,
  capitalize,
  createEmptyBoard,
  evaluateBoard,
  getComputerMove,
} from '../game/gameLogic';

export const useTicTacToe = ({ gameMode, difficulty }) => {
  const [board, setBoard] = React.useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = React.useState('player1');
  const [winner, setWinner] = React.useState('');
  const [winningLine, setWinningLine] = React.useState([]);
  const [players, setPlayers] = React.useState({
    player1: 'Player1',
    player2: 'Player2',
  });
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [isPaused, setIsPaused] = React.useState(false);

  const resetBoard = React.useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('player1');
    setWinner('');
    setWinningLine([]);
    setIsPaused(false);
  }, []);

  React.useEffect(() => {
    resetBoard();

    setPlayers((previousPlayers) => ({
      ...previousPlayers,
      player2:
        gameMode === GAME_MODES.ONE_PLAYER
          ? difficulty === DIFFICULTIES.HARD
            ? 'Smart Computer'
            : 'Dumb Computer'
          : 'Player2',
    }));
  }, [difficulty, gameMode, resetBoard]);

  React.useEffect(() => {
    setLeaderboard([]);
  }, [difficulty]);

  const handleNameChange = React.useCallback((event) => {
    const { name, value } = event.target;

    setPlayers((previousPlayers) => ({
      ...previousPlayers,
      [name]: capitalize(value),
    }));
  }, []);

  const handleMove = React.useCallback(
    (position, nextPlayer = currentPlayer) => {
      if (isPaused || typeof board[position] !== 'number') {
        return false;
      }

      if (gameMode === GAME_MODES.ONE_PLAYER && nextPlayer === 'player2' && currentPlayer !== 'player2') {
        return false;
      }

      const nextBoard = [...board];
      nextBoard[position] = SYMBOLS[nextPlayer];
      const result = evaluateBoard(nextBoard);

      setBoard(nextBoard);

      if (result) {
        setWinner(result.winner);
        setWinningLine(result.winLine ?? []);
        setIsPaused(true);
        setLeaderboard((previousLeaderboard) => [...previousLeaderboard, result.winner]);
        return true;
      }

      setCurrentPlayer(TURN_COMPLEMENT[nextPlayer]);
      return true;
    },
    [board, currentPlayer, gameMode, isPaused]
  );

  React.useEffect(() => {
    if (gameMode !== GAME_MODES.ONE_PLAYER || currentPlayer !== 'player2' || isPaused) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const computerMove = getComputerMove(board, difficulty);

      if (computerMove !== null) {
        handleMove(computerMove, 'player2');
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [board, currentPlayer, difficulty, gameMode, handleMove, isPaused]);

  const handleReset = React.useCallback(() => {
    resetBoard();
  }, [resetBoard]);

  const winnerDisplay = winner === 'Tie' ? 'Tie' : players[PLAYER_LABELS[winner]];

  return {
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
  };
};
