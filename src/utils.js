const findWinner = (board) => {
  let winnerPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winnerPositions.length; i++) {
    let [a, b, c] = winnerPositions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const isGameOver = (board) => {
  let winner = findWinner(board);
  if (winner) {
    return winner;
  }
  for (let i = 0; i < board.length; i++) {
    if (!isNaN(board[i])) {
      return null;
    }
  }
  return 'Tie';
};

export const capitalize = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
export const getWordsFromCamelCase = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (txt) => {
    return txt.toUpperCase();
  });
};
export const getScore = (leaderboard) => {
  let score = {
    X: 0,
    O: 0,
    Tie: 0,
  };
  for (let i = 0; i < leaderboard.length; i++) {
    score[leaderboard[i]]++;
  }
  return score;
};

const getRandNum = (n, indices) => {
  let allPos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let remainingPos = allPos.filter((val) => !indices.includes(val));
  let num = Math.floor(Math.random() * n);
  return remainingPos[num];
};

const getIndices = (board) => {
  let indices = [];
  board.forEach((val, i) => {
    if (val === 'X' || val === 'O') {
      indices.push(i);
    }
  });
  return indices;
};

const getNextMovePos = (board) => {
  let movesLeft = board.filter((val) => !isNaN(val)).length;
  let indices = getIndices(board);
  let pos = getRandNum(movesLeft, indices);
  return pos;
};

export const newBoardAfterMove = (board, val) => {
  let pos = getNextMovePos(board);
  let newBoard = board.slice();
  newBoard[pos] = val;
  return newBoard;
};
