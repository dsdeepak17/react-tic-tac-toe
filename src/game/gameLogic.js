export const GAME_MODES = {
  ONE_PLAYER: 'onePlayerMode',
  TWO_PLAYER: 'twoPlayerMode',
};

export const DIFFICULTIES = {
  EASY: 'easy',
  HARD: 'hard',
};

export const SYMBOLS = {
  player1: 'X',
  player2: 'O',
};

export const TURN_COMPLEMENT = {
  player1: 'player2',
  player2: 'player1',
};

export const PLAYER_LABELS = {
  X: 'player1',
  O: 'player2',
  Tie: 'Tie',
};

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const createEmptyBoard = () => Array.from({ length: 9 }, (_, index) => index);

export const capitalize = (value = '') =>
  value
    .trim()
    .replace(/\w\S*/g, (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`);

export const evaluateBoard = (board) => {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winLine: [a, b, c],
      };
    }
  }

  if (board.every((cell) => typeof cell !== 'number')) {
    return {
      winner: 'Tie',
      winLine: [],
    };
  }

  return null;
};

export const getScoreSummary = (leaderboard = []) => {
  const summary = { X: 0, O: 0, Tie: 0 };

  leaderboard.forEach((result) => {
    if (result in summary) {
      summary[result] += 1;
    }
  });

  return summary;
};

const minimax = (board, currentPlayer) => {
  const gameState = evaluateBoard(board);

  if (gameState?.winner === 'O') {
    return { score: 10, index: -1 };
  }

  if (gameState?.winner === 'X') {
    return { score: -10, index: -1 };
  }

  if (gameState?.winner === 'Tie') {
    return { score: 0, index: -1 };
  }

  const availableMoves = board
    .map((cell, index) => (typeof cell === 'number' ? index : null))
    .filter((cellIndex) => cellIndex !== null);

  let bestScore = currentPlayer === 'O' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  let bestMove = availableMoves[0];

  availableMoves.forEach((moveIndex) => {
    const nextBoard = [...board];
    nextBoard[moveIndex] = currentPlayer;

    const result = minimax(nextBoard, currentPlayer === 'O' ? 'X' : 'O');

    if (currentPlayer === 'O') {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = moveIndex;
      }
    } else if (result.score < bestScore) {
      bestScore = result.score;
      bestMove = moveIndex;
    }
  });

  return { score: bestScore, index: bestMove };
};

export const getComputerMove = (board, difficulty) => {
  const availableMoves = board
    .map((cell, index) => (typeof cell === 'number' ? index : null))
    .filter((cellIndex) => cellIndex !== null);

  if (!availableMoves.length) {
    return null;
  }

  if (difficulty === DIFFICULTIES.EASY) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  const bestMove = minimax(board, 'O');
  return bestMove.index;
};
