



//Tictactoe constants

export const COMPUTER_WAIT_TIME = {
  easy: 170,
  hard: 380,
};

export const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const turnComplement = {
  player1: 'player2',
  player2: 'player1',
};
export const symbol = {
  player1: 'X',
  player2: 'O',
};
export const p = {
  X: 'player1',
  O: 'player2',
  Tie: 'Tie',
};

//App Constants

export const gameMode = {
  onePlayerMode: 'twoPlayerMode',
  twoPlayerMode: 'onePlayerMode',
};
export const difficultyMode = {
  easy: 'hard',
  hard: 'easy',
};