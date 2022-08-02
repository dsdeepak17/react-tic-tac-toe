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
const findWinner = (board) => {

  for (let i = 0; i < winnerPositions.length; i++) {
    let [a, b, c] = winnerPositions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winPos: [a, b, c] };
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
  return { winner: 'Tie', winPos: [] };
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

export const newBoardAfterEasyMove = (board, val) => {
  let pos = getNextMovePos(board);
  let newBoard = board.slice();
  newBoard[pos] = val;
  return newBoard;
};

const checkWin = (board, player) => {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winnerPositions.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

const minimax = (newBoard, player) => {
  let availSpots = newBoard.filter(s => typeof s == 'number');

  if (checkWin(newBoard, 'X')) {
    return { score: -10 };
  } else if (checkWin(newBoard, 'O')) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == 'O') {
      let result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      let result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }
  let bestMove;
  if (player === 'O') {
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Number.POSITIVE_INFINITY;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

export const newBoardAfterDifficultMove = (board, val) => {
  let { index: pos, score } = minimax(board, 'O');
  let newBoard = board.slice();
  newBoard[pos] = val;
  return newBoard;
};


//debounce function
//explaination: https://medium.com/@dabit3/debounce-and-throttle-in-javascript-b6e0f9f9f8f4

export const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}